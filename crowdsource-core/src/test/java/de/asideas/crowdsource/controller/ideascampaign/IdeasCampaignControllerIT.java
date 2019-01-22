package de.asideas.crowdsource.controller.ideascampaign;

import org.hamcrest.CoreMatchers;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class IdeasCampaignControllerIT extends AbstractCrowdIT {


    @Autowired
    private IdeasCampaignService ideasCampaignService;

    @Before
    public void init() {

    }

//    @Test
    @Deprecated
    public void createIdeasCampaign_overService_ShouldPersistCampaign() {

        UserEntity user = givenUserExists();
        IdeasCampaign cmd = new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            null, "Test_Title", "test_descr", "test_vidRef");

        ideasCampaignService.createCampaign(cmd, user);
        IdeasCampaign myCampaign = ideasCampaignService.activeCampaigns().get(0);

        thenCampaignContainsExpectedFields(myCampaign, cmd, user);

    }

    @Test
    public void createIdeasCampaign_ShouldPersistCampaign() throws Exception{
        UserEntity user = givenUserExists();
        IdeasCampaign cmd = new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            null, "Test_Title", "test_descr", "test_vidRef");


        mockMvc.perform(post("/ideas_campaigns")
            .content(mapper.writeValueAsString(cmd)))
            .andDo(log())
            .andExpect(status().isOk());

    }

    private void thenCampaignContainsExpectedFields(IdeasCampaign actual, IdeasCampaign expected, UserEntity expInitiatorUser) {
        CampaignInitiator expInitiator = new CampaignInitiator(expInitiatorUser);
        expected.setCampaignInitiator(expInitiator);
        assertThat(actual, CoreMatchers.equalTo(expected));
    }

}
