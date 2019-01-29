package de.asideas.crowdsource.service.ideascampaign;

import java.util.Arrays;
import java.util.Collections;

import de.asideas.crowdsource.domain.model.UserEntity;

import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.repository.UserRepository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.access.AuthorizationServiceException;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.testutil.Fixtures;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
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

    @Test
    public void createNewIdea_shouldPersistIdeaAndNotify() {
        final String campaignId = "mycampaign";
        final UserEntity creator = Fixtures.givenUserEntity("test_adminId");
        final Idea cmd = new Idea("test_title", "test_pitch");

        givenIdeaCampaignExists(campaignId);
        givenAdminUserExists();
        givenIdeaRepositoryCanSave();

        ideaService.createNewIdea(campaignId, cmd, creator);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        final ArgumentCaptor<IdeaEntity> captorNotification = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());
        assertThat(captor.getValue().getTitle(), is(cmd.getTitle()));
        assertThat(captor.getValue().getPitch(), is(cmd.getPitch()));

        verify(userNotificationService).notifyAdminOnIdeaCreation(captorNotification.capture(), anyString());
        assertThat(captorNotification.getValue(), is(captor.getValue()));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void createNewIdea_shouldThrowException_OnNotExistingCampaign() {

        String campaignId = "testcampaignid";
        givenIdeaCampaignDoesntExist(campaignId);

        ideaService.createNewIdea(campaignId, new Idea("test_title", "Tu wat!"), Fixtures.givenUserEntity("123459"));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void updateIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        givenIdeaDoesntExist(missingIdeaId);

        ideaService.modifyIdea(missingIdeaId, new Idea("test_title", "my faulty pitch"), new UserEntity());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void approveIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Arrays.asList(Roles.ROLE_ADMIN));

        givenIdeaDoesntExist(missingIdeaId);
        ideaService.approveIdea(missingIdeaId, approver);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void rejectIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Arrays.asList(Roles.ROLE_ADMIN));

        givenIdeaDoesntExist(missingIdeaId);
        ideaService.rejectIdea(missingIdeaId, "test comment", approver);
    }

    @Test(expected = AuthorizationServiceException.class)
    public void approveIdea_shouldThrowException_OnNonAdminRequesting() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Collections.emptyList());

        givenIdeaExists(new Idea("test_title", "test_pitch"));

        ideaService.approveIdea(missingIdeaId, approver);
    }

    @Test(expected = AuthorizationServiceException.class)
    public void rejectIdea_shouldThrowException_OnNonAdminRequesting() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Collections.emptyList());

        givenIdeaExists(new Idea("test_title", "test_pitch"));

        ideaService.rejectIdea(missingIdeaId, "ich bin ein admin", approver);
    }

    @Test
    public void approveIdea_shouldPersistApprovedIdeaAndNotifyUser() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Arrays.asList(Roles.ROLE_ADMIN));

        IdeaEntity expectedIdea = givenIdeaExists(new Idea("test_title", "test_pitch"));

        ideaService.approveIdea(missingIdeaId, approver);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus(), is(IdeaStatus.PUBLISHED));

        verify(userNotificationService).notifyCreatorOnIdeaAccepted(eq(expectedIdea));
    }

    @Test
    public void rejectIdea_shouldPersistRejectedIdea() {
        final String missingIdeaId = "idea27";
        final UserEntity approver = Fixtures.givenUserEntity("test_adminId");
        approver.setRoles(Arrays.asList(Roles.ROLE_ADMIN));

        givenIdeaExists(new Idea("test_title", "test_pitch"));

        ideaService.rejectIdea(missingIdeaId, "you are rejected!", approver);

        final ArgumentCaptor<IdeaEntity> captor = ArgumentCaptor.forClass(IdeaEntity.class);
        verify(ideaRepository).save(captor.capture());

        assertThat(captor.getValue().getStatus(), is(IdeaStatus.REJECTED));
        assertThat(captor.getValue().getRejectionComment(), is("you are rejected!"));
    }

    private IdeaEntity givenIdeaExists(Idea idea) {
        final IdeaEntity theIdea = Fixtures.givenIdeaEntity(idea);
        doReturn(true).when(ideaRepository).exists(anyString());
        doReturn(theIdea).when(ideaRepository).findOne(anyString());
        return theIdea;
    }

    private void givenIdeaCampaignExists(String campaignId) {
        doReturn(true).when(ideasCampaignRepository).exists(campaignId);
    }

    private void givenIdeaCampaignDoesntExist(String campaignId) {
        doReturn(false).when(ideasCampaignRepository).exists(campaignId);
    }

    private void givenIdeaDoesntExist(String ideaId) {
        doReturn(false).when(ideaRepository).exists(ideaId);
    }

    private void givenAdminUserExists() {
        doReturn(Collections.singletonList(Fixtures.givenUserEntity("test_fakeadmin"))).when(userRepository).findAllAdminUsers();
    }

    private void givenIdeaRepositoryCanSave() {
        doAnswer(invocationOnMock -> invocationOnMock.getArguments()[0]).when(ideaRepository).save(any(IdeaEntity.class));
    }


}