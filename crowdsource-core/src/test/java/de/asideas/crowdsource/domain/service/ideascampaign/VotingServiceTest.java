package de.asideas.crowdsource.domain.service.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.testutil.Fixtures;

import static de.asideas.crowdsource.testutil.Fixtures.givenIdeaEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenIdeasCampaignEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class VotingServiceTest {

    @InjectMocks
    private VotingService votingService;

    @Test(expected = IllegalArgumentException.class)
    public void voteForIdea_shouldThrow_on_idea_not_of_campaign(){
        final IdeaEntity givenIdea = givenIdeaEntity();
        ReflectionTestUtils.setField(givenIdea, "campaignId", "1111");
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("aUser"), 5);
    }

    @Test(expected = IllegalArgumentException.class)
    public void voteForIdea_ShouldThrow_onVote_outOfBounds_min(){
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), -1);
    }

    @Test(expected = IllegalArgumentException.class)
    public void voteForIdea_ShouldThrow_onVote_outOfBounds_max(){
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 6);
    }

    @Test(expected = IllegalArgumentException.class)
    public void voteForIdea_ShouldThrow_onVoteOfIdeaOfExpiredCampaign(){
        final IdeasCampaignEntity givenCampaign = givenIdeasCampaignEntity("test_InitUser");
        givenCampaign.setId("2222");
        givenCampaign.setEndDate(DateTime.now().minusSeconds(1));

        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new Idea("test_title", "test_campaignId"), givenCampaign.getId(), givenUserEntity("creator"));
        votingService.voteForIdea(givenIdea, givenCampaign, givenUserEntity("voterId"), 5);
    }




}