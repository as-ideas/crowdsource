package de.asideas.crowdsource.domain.model.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Test;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class IdeasCampaignEntityTest {

    @Test
    public void newIdeasCampaign_ShouldReturnFullyInitializedCampaign() {

        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId);

        UserEntity initiator = givenUserEntity(userId);

        final IdeasCampaignEntity res = IdeasCampaignEntity.newIdeasCampaign(cmd, initiator);
        thenIdeasCampaignContainsExpectedFields(res, cmd);

    }

    @Test(expected = IllegalArgumentException.class)
    public void newIdeasCampaigns_ShouldThrowOnInvalidTimeSpan() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId, DateTime.now().plusDays(3), DateTime.now().minusDays(1));

        UserEntity initiator = givenUserEntity(userId);

        IdeasCampaignEntity.newIdeasCampaign(cmd, initiator);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newIdeasCampaigns_ShouldThrowOnEmptyStartDate() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId, null, DateTime.now().minusDays(1));

        UserEntity initiator = givenUserEntity(userId);

        IdeasCampaignEntity.newIdeasCampaign(cmd, initiator);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newIdeasCampaigns_ShouldThrowOnEmptyEndDate() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId, DateTime.now().plusDays(3), null);

        UserEntity initiator = givenUserEntity(userId);

        IdeasCampaignEntity.newIdeasCampaign(cmd, initiator);
    }

    @Test
    public void updateMasterdata_ShouldOverrideExpectedFields() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId);

        final IdeasCampaign changeCmd = new IdeasCampaign(DateTime.now().plusDays(1), DateTime.now().plusDays(2),
            new CampaignInitiator(userId, "new username"), "better sponsor", "amazing title", "longer description", "tuuuut", "usw");

        final IdeasCampaignEntity testee = IdeasCampaignEntity.newIdeasCampaign(cmd, givenUserEntity(userId));
        testee.updateMasterdata(changeCmd);

        thenIdeasCampaignContainsExpectedFields(testee, changeCmd);

    }

    @Test(expected = IllegalArgumentException.class)
    public void updateMasterdata_ShouldThrowExceptionOnInvalidTimeSpan() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId);

        final IdeasCampaign changeCmd = new IdeasCampaign(DateTime.now().plusDays(2), DateTime.now().plusDays(1),
            new CampaignInitiator(userId, "new username"), "better sponsor", "amazing title", "longer description", "tuuuut", "usw");

        final IdeasCampaignEntity testee = IdeasCampaignEntity.newIdeasCampaign(cmd, givenUserEntity(userId));
        testee.updateMasterdata(changeCmd);
    }

    @Test(expected = IllegalArgumentException.class)
    public void updateMasterdata_ShouldThrowExceptionOnNullAsStartDate() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId);

        final IdeasCampaign changeCmd = new IdeasCampaign(null, DateTime.now().plusDays(1),
            new CampaignInitiator(userId, "new username"), "better sponsor", "amazing title", "longer description", "tuuuut", "usw");

        final IdeasCampaignEntity testee = IdeasCampaignEntity.newIdeasCampaign(cmd, givenUserEntity(userId));
        testee.updateMasterdata(changeCmd);
    }

    @Test(expected = IllegalArgumentException.class)
    public void updateMasterdata_ShouldThrowExceptionOnNullAsEndDate() {
        final String userId = "test_userId";
        IdeasCampaign cmd = givenIdeasCampaignCmd(userId);

        final IdeasCampaign changeCmd = new IdeasCampaign(DateTime.now().plusDays(2), null,
            new CampaignInitiator(userId, "new username"), "better sponsor", "amazing title", "longer description", "tuuuut", "usw");

        final IdeasCampaignEntity testee = IdeasCampaignEntity.newIdeasCampaign(cmd, givenUserEntity(userId));
        testee.updateMasterdata(changeCmd);
    }


    @Test
    public void isActive_shouldReturn_True_on_now_within_startDate_and_endDate() {
        final IdeasCampaignEntity ideasCampaignEntity = IdeasCampaignEntity.newIdeasCampaign(givenIdeasCampaignCmd(
            "DerErwin", DateTime.now().minusDays(1), DateTime.now().plusMinutes(1)), givenUserEntity("DerErwin"));

        assertThat(ideasCampaignEntity.isActive(), is(true));
    }

    @Test
    public void isActive_shouldReturn_False_on_now_Before_startDate() {
        final IdeasCampaignEntity ideasCampaignEntity = IdeasCampaignEntity.newIdeasCampaign(
            givenIdeasCampaignCmd("DerErwin", DateTime.now().plusDays(2), DateTime.now().plusDays(3)), givenUserEntity("DerErwin"));

        assertThat(ideasCampaignEntity.isActive(), is(false));
    }

    @Test
    public void isActive_shouldReturn_False_on_now_After_endDate() {
        final IdeasCampaignEntity ideasCampaignEntity = IdeasCampaignEntity.newIdeasCampaign(
            givenIdeasCampaignCmd("DerErwin", DateTime.now().minusDays(4), DateTime.now().minusDays(3)), givenUserEntity("DerErwin"));

        assertThat(ideasCampaignEntity.isActive(), is(false));
    }


    private IdeasCampaign givenIdeasCampaignCmd(String userId) {
        return givenIdeasCampaignCmd(userId, DateTime.now(), DateTime.now().plus(10000L));
    }

    private IdeasCampaign givenIdeasCampaignCmd(String userId, DateTime startDate, DateTime endDate) {
        return new IdeasCampaign(startDate, endDate,
            new CampaignInitiator(userId, "test_username"), "test_sponsor", "Test_Title", "test_descr", "test_vidRef", "test_teaserImg");
    }

    private void thenIdeasCampaignContainsExpectedFields(IdeasCampaignEntity actualRes, IdeasCampaign expected) {
        assertThat(actualRes.getStartDate(), equalTo(expected.getStartDate()));
        assertThat(actualRes.getEndDate(), equalTo(expected.getEndDate()));

        assertThat(actualRes.getSponsor(), equalTo(expected.getSponsor()));
        assertThat(actualRes.getTitle(), equalTo(expected.getTitle()));
        assertThat(actualRes.getDescription(), equalTo(expected.getDescription()));
        assertThat(actualRes.getVideoReference(), equalTo(expected.getVideoReference()));
        assertThat(actualRes.getTeaserImageReference(), equalTo(expected.getTeaserImageReference()));

        assertThat(actualRes.getInitiator().getId(), equalTo(expected.getCampaignInitiator().getId()));
    }

}