package de.asideas.crowdsource.domain.model.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Test;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;

public class IdeasCampaignEntityTest {

    @Test
    public void newIdeasCampaign_ShouldReturnFullyInitializedCampaign() {

        final String userId = "test_userId";
        IdeasCampaign cmd = new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            new CampaignInitiator(userId, "test_username"), "Test_Title", "test_descr", "test_vidRef");
        UserEntity initiator = givenUserEntity(userId);

        final IdeasCampaignEntity res = IdeasCampaignEntity.newIdeasCampaign(cmd, initiator);
        thenIdeasCampaignContainsExpectedFields(res, cmd);

    }

    private UserEntity givenUserEntity(String userId) {
        UserEntity initiator = new UserEntity("test_mail", "test_firstname", "test_lastname");
        initiator.setId(userId);
        return initiator;
    }

    private void thenIdeasCampaignContainsExpectedFields(IdeasCampaignEntity actualRes, IdeasCampaign cmd) {
        assertThat(actualRes.getStartDate(), equalTo(cmd.getStartDate()));
        assertThat(actualRes.getEndDate(), equalTo(cmd.getEndDate()));

        assertThat(actualRes.getTitle(), equalTo(cmd.getTitle()));
        assertThat(actualRes.getDescription(), equalTo(cmd.getDescription()));
        assertThat(actualRes.getVideoReference(), equalTo(cmd.getVideoReference()));

        assertThat(actualRes.getInitiator().getId(), equalTo(cmd.getCampaignInitiator().getId()));

    }

}