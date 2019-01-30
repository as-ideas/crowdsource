package de.asideas.crowdsource.domain.service.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;
import de.asideas.crowdsource.testutil.Fixtures;

import static de.asideas.crowdsource.testutil.Fixtures.givenIdeaEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenIdeasCampaignEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Matchers.isA;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class VotingServiceTest {

    @InjectMocks
    private VotingService votingService;

    @Mock
    private VoteRepository voteRepository;

    @Test(expected = IllegalArgumentException.class)
    public void voteForIdea_shouldThrow_on_idea_not_of_campaign() {
        final IdeaEntity givenIdea = givenIdeaEntity();
        ReflectionTestUtils.setField(givenIdea, "campaignId", "1111");
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("aUser"), 5);
    }

    @Test(expected = InvalidRequestException.class)
    public void voteForIdea_ShouldThrow_onVoteOfIdeaOfExpiredCampaign() {
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");
        givenCampaign.setEndDate(DateTime.now().minusSeconds(1));

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 5);
    }

    @Test(expected = InvalidRequestException.class)
    public void voteForIdea_ShouldThrow_onVoteofIdeaBeforeCampaignStart() {
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");
        givenCampaign.setStartDate(DateTime.now().plusDays(1));

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 5);
    }

    @Test
    public void voteForIdea_ShouldPersist() {
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        givenIdea.setId("test_ideaId");
        givenIdea.approveIdea(Fixtures.givenUserEntity("fake_admin"));

        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 5);
        verify(voteRepository).save(isA(VoteEntity.class));
    }

    @Test
    public void voteForIdea_ShouldDeleteExistingVoteOnZero() {
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        givenIdea.setId("testid");
        givenIdea.approveIdea(Fixtures.givenUserEntity("fake_admin"));

        final VoteId expectedVoteId = new VoteId("voterId", givenIdea.getId());

        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 0);
        verify(voteRepository).delete(eq(expectedVoteId));
        verify(voteRepository, never()).save(any(VoteEntity.class));
    }


}