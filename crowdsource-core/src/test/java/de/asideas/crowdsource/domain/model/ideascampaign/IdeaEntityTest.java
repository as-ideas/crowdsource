package de.asideas.crowdsource.domain.model.ideascampaign;

import org.hamcrest.Matchers;
import org.joda.time.DateTime;
import org.junit.Test;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.testutil.Fixtures;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class IdeaEntityTest {

    public static final String EXP_CAMPAIGN_ID = "test_campaignId";
    public static final UserEntity INITIATOR = Fixtures.givenUserEntity("12345");

    @Test
    public void createIdeaEntity_shouldContainExpectedFileds() {
        final Idea expectedIdea = new Idea("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(expectedIdea, EXP_CAMPAIGN_ID, INITIATOR);

        assertThat(ideaEntity.getTitle(), equalTo(expectedIdea.getTitle()));
        assertThat(ideaEntity.getPitch(), equalTo(expectedIdea.getPitch()));
        assertThat(ideaEntity.getCreator(), equalTo(INITIATOR));
        assertThat(ideaEntity.getStatus(), equalTo(IdeaStatus.PROPOSED));
        assertThat(ideaEntity.getCampaignId(), equalTo(EXP_CAMPAIGN_ID));
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_creator_is_null() {
        final Idea ideaCommand = new Idea("test_title", "Make more placstic forks!");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_pitch_is_empty() {
        final Idea ideaCommand = new Idea("test_title", "          ");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_campaignId_isEmpty() {
        final Idea ideaCommand = new Idea("test_title", "          ");
        IdeaEntity.createIdeaEntity(ideaCommand, "   ", INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIdeaEntity_shouldFail_on_title_isEmpty() {
        final Idea ideaCommand = new Idea("", "Make more placstic forks!");
        IdeaEntity.createIdeaEntity(ideaCommand, EXP_CAMPAIGN_ID, INITIATOR);
    }

    @Test(expected = IllegalArgumentException.class)
    public void approveIdea_ShouldThrowOnAlreadyApproved() {
        final Idea givenIdea = new Idea("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));
        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));
        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));
    }

    @Test
    public void approveIdea_ShouldTransformExpectedMembers() {
        final Idea givenIdea = new Idea("test_title", "Make more placstic forks!");
        final IdeaEntity ideaEntity = IdeaEntity.createIdeaEntity(givenIdea, EXP_CAMPAIGN_ID, INITIATOR);
        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PROPOSED));

        ideaEntity.approveIdea(Fixtures.givenUserEntity("test_adminId"));

        assertThat(ideaEntity.getStatus(), is(IdeaStatus.PUBLISHED));
        assertThat(DateTime.now().getMillis() - ideaEntity.getApprovalDate().getMillis(), Matchers.lessThanOrEqualTo(1000L));
        assertThat(ideaEntity.getApprovingAdminId(), is("test_adminId"));
    }

}