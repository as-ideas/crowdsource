package de.asideas.crowdsource.domain.model.ideascampaign;

import java.util.Arrays;
import java.util.Collection;

import de.asideas.crowdsource.presentation.ideascampaign.IdeaIn;
import org.hamcrest.Matchers;
import org.hamcrest.number.IsCloseTo;
import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Test;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Rating;
import de.asideas.crowdsource.testutil.Fixtures;

import static de.asideas.crowdsource.testutil.Fixtures.givenIdeasCampaignEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class IdeaEntityTest {

    public static final String EXP_CAMPAIGN_ID = "test_campaignId";
    public static final UserEntity INITIATOR = Fixtures.givenUserEntity("12345");

    @Test
    public void createIdeaEntity_shouldContainExpectedFileds() {
        final IdeaIn expectedIdea = new IdeaIn("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(expectedIdea, EXP_CAMPAIGN_ID, INITIATOR);

        assertThat(ideaEntity.getOriginalTitle(), equalTo(expectedIdea.getTitle()));
        assertThat(ideaEntity.getOriginalPitch(), equalTo(expectedIdea.getPitch()));
        assertThat(ideaEntity.getCreator(), equalTo(INITIATOR));
        assertThat(ideaEntity.getStatus(), equalTo(IdeaStatus.PROPOSED));
        assertThat(ideaEntity.getCampaignId(), equalTo(EXP_CAMPAIGN_ID));
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_creator_is_null() {
        final IdeaIn ideaCommand = new IdeaIn("test_title", "Make more placstic forks!");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_pitch_is_empty() {
        final IdeaIn ideaCommand = new IdeaIn("test_title", "          ");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_campaignId_isEmpty() {
        final IdeaIn ideaCommand = new IdeaIn("test_title", "          ");
        IdeaEntity.createIdeaEntity(ideaCommand, "   ", INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_title_isEmpty() {
        final IdeaIn ideaCommand = new IdeaIn("", "Make more placstic forks!");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void approveIdea_ShouldThrowOnAlreadyApproved() {
        final IdeaIn givenIdea = new IdeaIn("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));
        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));
        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));
    }

    @Test
    public void approveIdea_ShouldTransformExpectedMembers() {
        final IdeaIn givenIdea = new IdeaIn("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);
        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));

        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PUBLISHED));
        assertThat(DateTime.now().getMillis() - ideaEntity.getReviewDate().getMillis(), Matchers.lessThanOrEqualTo(1000L));
        assertThat(ideaEntity.getApprovingAdminId(), is("test_adminId"));
    }

    @Test
    public void rejectIdea_ShouldTransformExpectedMembers() {
        final IdeaIn givenIdea = new IdeaIn("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);
        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));

        final String expComment = "Kannste so machen, is aba kagge!";
        ideaEntity.rejectIdea(Fixtures.givenUserEntity("test_adminId"), expComment);

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.REJECTED));
        assertThat(DateTime.now().getMillis() - ideaEntity.getReviewDate().getMillis(), Matchers.lessThanOrEqualTo(1000L));
        assertThat(ideaEntity.getApprovingAdminId(), is("test_adminId"));
        assertThat(ideaEntity.getRejectionComment(), is(expComment));
    }

    @Test(expected = IllegalArgumentException.class)
    public void approveIdea_ShouldThrowOnAlreadyRejected() {
        final IdeaIn givenIdea = new IdeaIn("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));
        ideaEntity.rejectIdea(Fixtures.givenUserEntity("test_adminId"), "mag ich nicht");
        ideaEntity.rejectIdea(Fixtures.givenUserEntity("test_adminId"), "nope");
    }

    @Test
    public void vote_ShouldReturn_validVoteEntity() {
        final IdeaEntity givenIdea = givenValidApprovedIdea();

        final VoteEntity res = givenIdea.vote(givenUserEntity("voterId"), 5);

        assertThat(res.getId().getIdeaId(), is(givenIdea.getId()));
        assertThat(res.getId().getVoterId(), is("voterId"));
        assertThat(res.getVote(), is(5));
    }

    @Test
    public void vote_ShouldThrow_On_NonApprovedIdea() {
        final IdeaEntity ideaEntity = Fixtures.givenIdeaEntity();

        try {
            ideaEntity.vote(Fixtures.givenUserEntity("voter_id"), 3);
            fail("Expected exception not thrown.");
        } catch (InvalidRequestException e) {
            assertThat(e.getMessage(), equalTo("idea_status_invalid_for_vote"));
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void vote_ShouldThrow_onVote_outOfBounds_min() {
        final IdeaEntity givenIdea = Fixtures.givenIdeaEntity();
        givenIdea.approveIdea(Fixtures.givenUserEntity("adminId"));

        givenIdea.vote(givenUserEntity("voterId"), 0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void vote_ShouldThrow_onVote_outOfBounds_max() {
        final IdeaEntity givenIdea = Fixtures.givenIdeaEntity();
        givenIdea.approveIdea(Fixtures.givenUserEntity("adminId"));

        givenIdea.vote(givenUserEntity("voterId"), 6);
    }

    @Test
    public void calculateVotes_shouldCalculateAverageRating() {
        final IdeaEntity idea = givenValidApprovedIdea();
        Collection<VoteEntity> givenVotes = Arrays.asList(
            new VoteEntity(new VoteId("voter1", idea.getId()), 5),
            new VoteEntity(new VoteId("voter2", idea.getId()), 3),
            new VoteEntity(new VoteId("voter3", idea.getId()), 2)
        );

        final Rating rating = idea.calculateRating(givenVotes, givenUserEntity("voter1"));
        assertThat((double)rating.getAverageRating(), IsCloseTo.closeTo(3.33d, 0.01d));
        assertThat(rating.getOwnVote(), is(5));
        assertThat(rating.getCountVotes(), is(3));
        assertThat(rating.getIdeaId(), is(idea.getId()));
    }

    @Test
    public void calculateVotes_shouldReturnOwnRating_As_0_IfNotRated() {
        final IdeaEntity idea = givenValidApprovedIdea();
        Collection<VoteEntity> givenVotes = Arrays.asList(
            new VoteEntity(new VoteId("voter1", idea.getId()), 5),
            new VoteEntity(new VoteId("voter2", idea.getId()), 3),
            new VoteEntity(new VoteId("voter3", idea.getId()), 2)
        );

        final Rating rating = idea.calculateRating(givenVotes, givenUserEntity("not_voted_for_Idea_User"));
        assertThat(rating.getOwnVote(), is(0));
    }

    private IdeaEntity givenValidApprovedIdea() {
        final IdeaEntity givenIdea = IdeaEntity.createIdeaEntity(new IdeaIn("test_title", "test_campaignId"), "aCampaignId", givenUserEntity("creator"));
        givenIdea.setId("test_ideaId");
        givenIdea.approveIdea(Fixtures.givenUserEntity("adminId"));
        return givenIdea;
    }

}
