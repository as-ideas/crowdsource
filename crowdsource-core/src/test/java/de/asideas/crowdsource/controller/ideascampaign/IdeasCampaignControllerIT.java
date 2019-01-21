package de.asideas.crowdsource.controller.ideascampaign;

import org.hamcrest.CoreMatchers;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;

import static org.hamcrest.MatcherAssert.assertThat;

public class IdeasCampaignControllerIT extends AbstractCrowdIT {


    @Autowired
    private IdeasCampaignService ideasCampaignService;

    @Before
    public void init() {

    }

    @Test
    public void createIdeasCampaign_ShouldPersistCampaign() {

        UserEntity user = givenUserExists();
        IdeasCampaign cmd = new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            null, "Test_Title", "test_descr", "test_vidRef");

        ideasCampaignService.createCampaign(cmd, user);
        IdeasCampaign myCampaign = ideasCampaignService.activeCampaigns().get(0);

        thenCampaignContainsExpectedFields(myCampaign, cmd, user);

    }

    private void thenCampaignContainsExpectedFields(IdeasCampaign actual, IdeasCampaign expected, UserEntity expInitiatorUser) {
        CampaignInitiator expInitiator = new CampaignInitiator(expInitiatorUser);
        expected.setCampaignInitiator(expInitiator);
        assertThat(actual, CoreMatchers.equalTo(expected));
    }

}
