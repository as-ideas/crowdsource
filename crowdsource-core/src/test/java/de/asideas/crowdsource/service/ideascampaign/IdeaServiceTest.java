package de.asideas.crowdsource.service.ideascampaign;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.UserEntity;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.domain.service.ideascampaign.VotingService;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.presentation.ideascampaign.Rating;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.repository.UserRepository;

import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AuthorizationServiceException;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.testutil.Fixtures;

import static de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus.PUBLISHED;
import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class IdeaServiceTest {

    @InjectMocks
    private IdeaService ideaService;

    @Mock
    private IdeaRepository ideaRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private IdeasCampaignRepository ideasCampaignRepository;

    @Mock
    private UserNotificationService userNotificationService;

    @Mock
    private VotingService votingService;

    @Mock
    private VoteRepository voteRepository;


    @Test
    public void fetchIdeasByStatus_ShouldRequestWithDefaultPagesize_onNoPageOrSizeGiven(){
        final String campaignId = "test_campId";

        final ArgumentCaptor<PageRequest> pReqCap = ArgumentCaptor.forClass(PageRequest.class);
        doReturn(new PageImpl<IdeaEntity>(Collections.emptyList())).when(ideaRepository)
            .findByCampaignIdAndStatusIn(anyString(), anySet(), pReqCap.capture());

        ideaService.fetchIdeasByStatus(campaignId, singleton(PUBLISHED), 1, null, givenUserEntity("requestorId"));
        assertThat(pReqCap.getValue().getPageSize(), is(IdeaService.DEFAULT_PAGE_SIZE));
        assertThat(pReqCap.getValue().getPageNumber(), is(0));

        ideaService.fetchIdeasByStatus(campaignId, singleton(PUBLISHED), null, 200, givenUserEntity("requestorId"));
        assertThat(pReqCap.getValue().getPageSize(), is(IdeaService.DEFAULT_PAGE_SIZE));
        assertThat(pReqCap.getValue().getPageNumber(), is(0));
    }

    @Test
    public void fetchIdeasByStatus_ShouldRequestWith_GivenPageNumberAndCount(){
        final String campaignId = "test_campId";

        final ArgumentCaptor<PageRequest> pReqCap = ArgumentCaptor.forClass(PageRequest.class);
        doReturn(new PageImpl<IdeaEntity>(Collections.emptyList())).when(ideaRepository)
            .findByCampaignIdAndStatusIn(anyString(), eq(singleton(PUBLISHED)), pReqCap.capture());

        ideaService.fetchIdeasByStatus(campaignId, singleton(PUBLISHED), 17, 120, givenUserEntity("requestorId"));
        assertThat(pReqCap.getValue().getPageSize(), is(120));
        assertThat(pReqCap.getValue().getPageNumber(), is(17));
    }

    @Test
    public void fetchIdeasByStatus_ShouldResetPagesizeToDefault_OnMaxPagesizeExceeded(){
        final String campaignId = "test_campId";

        final ArgumentCaptor<PageRequest> pReqCap = ArgumentCaptor.forClass(PageRequest.class);
        doReturn(new PageImpl<IdeaEntity>(Collections.emptyList())).when(ideaRepository)
            .findByCampaignIdAndStatusIn(anyString(), eq(singleton(PUBLISHED)), pReqCap.capture());

        ideaService.fetchIdeasByStatus(campaignId, singleton(PUBLISHED), 17, IdeaService.MAX_PAGE_SIZE + 1, givenUserEntity("requestorId"));
        assertThat(pReqCap.getValue().getPageSize(), is(IdeaService.DEFAULT_PAGE_SIZE));
        assertThat(pReqCap.getValue().getPageNumber(), is(17));
    }

    @Test
    public void fetchIdeasByStatus_ShouldEnrichIdeas_ByRating(){
        final String campaignId = "test_campId";

        final ArgumentCaptor<PageRequest> pReqCap = ArgumentCaptor.forClass(PageRequest.class);
        final IdeaEntity expIdea = Fixtures.givenIdeaEntity("ideaId");
        doReturn(new PageImpl<>(singletonList(expIdea))).when(ideaRepository)
            .findByCampaignIdAndStatusIn(anyString(), eq(singleton(PUBLISHED)), pReqCap.capture());
        final Rating expRating = givenVoteRepositoryReturnsVotes(expIdea.getId());

        final Page<Idea> res = ideaService.fetchIdeasByStatus(campaignId, singleton(PUBLISHED), 17, IdeaService.MAX_PAGE_SIZE + 1, givenUserEntity("requestorId"));

        assertThat(res.getContent().get(0).getRating(), equalTo(expRating));
    }

    @Test
    public void fetchIdeasByRequestorHasVoted_ShouldEnrichIdeas_ByRating(){
        final String campaignId = "test_campId";

        final ArgumentCaptor<PageRequest> pReqCap = ArgumentCaptor.forClass(PageRequest.class);
        final IdeaEntity expIdea = Fixtures.givenIdeaEntity("ideaId");
        final Set<String> ideasIds = Collections.singleton(expIdea.getId());

        doReturn(Collections.singleton(new VoteEntity(new VoteId("votertestid", expIdea.getId()), 1)))
            .when(voteRepository).findIdsByVoterId(anyString());

        doReturn(new PageImpl<>(singletonList(expIdea))).when(ideaRepository)
            .findByCampaignIdAndStatusAndIdIn(eq(campaignId), eq(IdeaStatus.PUBLISHED), eq(ideasIds), pReqCap.capture());

        final Rating expRating = givenVoteRepositoryReturnsVotes(expIdea.getId());
        final Page<Idea> res = ideaService.fetchIdeasByRequestorHasVoted(campaignId, true, 0, 10, givenUserEntity("requestorId"));

        assertThat(res.getContent().get(0).getRating(), equalTo(expRating));
    }

    @Test
    public void fetchIdeasByCampaignAndCreator_ShouldEnrichIdeas_ByRating() {
        final String campaignId = "test_campId";

        final IdeaEntity expIdea = Fixtures.givenIdeaEntity("ideaId");
        doReturn(singletonList(expIdea)).when(ideaRepository).findByCampaignIdAndCreator(eq(campaignId), eq(givenUserEntity("creatorId")));
        final Rating expRating = givenVoteRepositoryReturnsVotes(expIdea.getId());

        final List<Idea> res = ideaService.fetchIdeasByCampaignAndCreator(campaignId, givenUserEntity("creatorId"), givenUserEntity("requestorId"));
        assertThat(res.get(0).getRating(), equalTo(expRating));
    }

    @Test
    public void createNewIdea_shouldPersistIdeaAndNotify() {
        final String campaignId = "mycampaign";
        final UserEntity creator = givenUserEntity("test_adminId");
        final Idea cmd = new Idea("test_title", "test_pitch");

        givenIdeaCampaignExists(campaignId, true);
        givenAdminUserExists();
        givenIdeaRepositoryCanSave();

        ideaService.createNewIdea(campaignId, cmd, creator);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        final ArgumentCaptor<IdeaEntity> captorNotification = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());
        assertThat(captor.getValue().getTitle(), is(cmd.getTitle()));
        assertThat(captor.getValue().getPitch(), is(cmd.getPitch()));
        assertThat(captor.getValue().getCampaignId(), is(campaignId));

        verify(userNotificationService).notifyAdminOnIdeaCreation(captorNotification.capture(), anyString());
        assertThat(captorNotification.getValue(), is(captor.getValue()));
    }

    @Test
    public void createNewIdea_shouldThrowOn_CampaignNotActive() {
        final String campaignId = "mycampaign";
        final UserEntity creator = givenUserEntity("test_adminId");
        final Idea cmd = new Idea("test_title", "test_pitch");

        givenIdeaCampaignExists(campaignId, false);
        givenAdminUserExists();
        givenIdeaRepositoryCanSave();

        try {
            ideaService.createNewIdea(campaignId, cmd, creator);
            fail("Expected exception not thrown");
        } catch (InvalidRequestException e) {
            assertThat(e.getMessage(), equalTo("campaign_not_active"));
        }
    }

    @Test(expected = ResourceNotFoundException.class)
    public void createNewIdea_shouldThrowException_OnNotExistingCampaign() {

        String campaignId = "testcampaignid";
        givenIdeaCampaignDoesntExist(campaignId);

        ideaService.createNewIdea(campaignId, new Idea("test_title", "Tu wat!"), givenUserEntity("123459"));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void updateIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        givenIdeaDoesntExist(missingIdeaId);

        ideaService.modifyIdea(missingIdeaId, new Idea("test_title", "my faulty pitch"), new UserEntity());
    }

    @Test
    public void rejectIdea_shouldPersistRejectedIdea() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", true);
        givenIdeaExists(new Idea("test_title", "test_pitch"), campaign.getId());

        ideaService.rejectIdea(campaign.getId(), missingIdeaId, "you are rejected!", approver);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());

        assertThat(captor.getValue().getStatus(), is(IdeaStatus.REJECTED));
        assertThat(captor.getValue().getRejectionComment(), is("you are rejected!"));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void rejectIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", true);

        givenIdeaDoesntExist(missingIdeaId);
        ideaService.rejectIdea(campaign.getId(), missingIdeaId, "test comment", approver);
    }

    @Test(expected = AuthorizationServiceException.class)
    public void rejectIdea_shouldThrowException_OnNonAdminRequesting() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(Collections.emptyList());

        final IdeasCampaignEntity campaignEntity = givenIdeaCampaignExists("test_campaignId", true);
        givenIdeaExists(new Idea("test_title", "test_pitch"), campaignEntity.getId());

        ideaService.rejectIdea(campaignEntity.getId(), missingIdeaId, "ich bin ein admin", approver);
    }

    @Test
    public void rejectIdea_shouldThrowException_OnCampaignNotActive() {
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", false);
        final IdeaEntity ideaEntity = givenIdeaExists(new Idea("test_title", "test_pitch"), campaign.getId());

        try {
            ideaService.rejectIdea(campaign.getId(), ideaEntity.getCampaignId(), ideaEntity.getId(), approver);
            fail("Expected exception not thrown");
        } catch (InvalidRequestException e) {
            assertThat(e.getMessage(), equalTo("campaign_not_active"));
        }
    }


    @Test(expected = AuthorizationServiceException.class)
    public void approveIdea_shouldThrowException_OnNonAdminRequesting() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(Collections.emptyList());

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", true);
        givenIdeaExists(new Idea("test_title", "test_pitch"), campaign.getId());

        ideaService.approveIdea("test_campaignId", missingIdeaId, approver);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void approveIdea_shouldThrowException_OnNotExistingIdea() {
        givenIdeaCampaignExists("test_campaignId", true);
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        givenIdeaDoesntExist(missingIdeaId);
        ideaService.approveIdea("test_campaignId", missingIdeaId, approver);
    }

    @Test
    public void approveIdea_shouldPersistApprovedIdeaAndNotifyUser() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", true);
        IdeaEntity expectedIdea = givenIdeaExists(new Idea("test_title", "test_pitch"), campaign.getId());

        ideaService.approveIdea(expectedIdea.getCampaignId(), missingIdeaId, approver);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus(), is(PUBLISHED));

        verify(userNotificationService).notifyCreatorOnIdeaAccepted(eq(expectedIdea));
    }

    @Test
    public void approveIdea_shouldThrowException_OnCampaignNotActive() {
        final UserEntity approver = givenUserEntity("test_adminId");
        approver.setRoles(singletonList(Roles.ROLE_ADMIN));

        final IdeasCampaignEntity campaign = givenIdeaCampaignExists("test_campaignId", false);
        final IdeaEntity ideaEntity = givenIdeaExists(new Idea("test_title", "test_pitch"), campaign.getId());

        try {
            ideaService.approveIdea(ideaEntity.getCampaignId(), ideaEntity.getId(), approver);
            fail("Expected exception not thrown");
        } catch (InvalidRequestException e) {
            assertThat(e.getMessage(), equalTo("campaign_not_active"));
        }
    }

    @Test
    public void voteForIdea_shouldCallVotingService(){
        final IdeasCampaignEntity expectedCampaign = givenIdeaCampaignExists("test_campaignId", true);
        final IdeaEntity ideaEntity = givenIdeaExists(new Idea("test_title", "test_pitch"), expectedCampaign.getId());
        final UserEntity voter = givenUserEntity("testvoter_id");

        ideaService.voteForIdea(new VoteCmd(ideaEntity.getId(), 1), voter);

        verify(votingService).voteForIdea(eq(ideaEntity), eq(expectedCampaign), eq(voter), eq(1));
    }

    private IdeaEntity givenIdeaExists(Idea idea, String campaignId) {
        final IdeaEntity theIdea = Fixtures.givenIdeaEntity(idea, campaignId);
        theIdea.setId("testidea_id");
        doReturn(true).when(ideaRepository).exists(anyString());
        doReturn(theIdea).when(ideaRepository).findOne(anyString());
        return theIdea;
    }

    private IdeasCampaignEntity givenIdeaCampaignExists(String campaignId, boolean active) {
        doReturn(true).when(ideasCampaignRepository).exists(campaignId);
        final IdeasCampaignEntity campaign = Fixtures.givenIdeasCampaignEntity("test_initiator");
        campaign.setId(campaignId);
        if (!active) {
            campaign.setEndDate(DateTime.now().minusSeconds(10));
        }
        doReturn(campaign).when(ideasCampaignRepository).findOne(campaignId);
        return campaign;
    }

    private void givenIdeaCampaignDoesntExist(String campaignId) {
        doReturn(false).when(ideasCampaignRepository).exists(campaignId);
    }

    private void givenIdeaDoesntExist(String ideaId) {
        doReturn(false).when(ideaRepository).exists(ideaId);
    }

    private void givenAdminUserExists() {
        doReturn(Collections.singletonList(givenUserEntity("test_fakeadmin"))).when(userRepository).findAllAdminUsers();
    }

    private void givenIdeaRepositoryCanSave() {
        doAnswer(invocationOnMock -> invocationOnMock.getArguments()[0]).when(ideaRepository).save(any(IdeaEntity.class));
    }

    /**
     * @return one rating to be found as expected data in final Idea DTOs
     */
    private Rating givenVoteRepositoryReturnsVotes(String ideaId){
        final Rating res = new Rating(ideaId, 1, 0, 4.0f);
        doReturn(singletonList(new VoteEntity(new VoteId("voterId", "anIdeaId"), 4))).when(voteRepository).findByIdIdeaId(anyString());
        return res;
    }


}