package de.asideas.crowdsource.controller.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class IdeasCampaignControllerIT extends AbstractCrowdIT {

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;


    @Test
    public void createIdeasCampaign_ShouldPersistCampaign() throws Exception {
        final UserEntity currentUser = givenAdminUserExists();
        final String accessToken = obtainAccessToken(currentUser.getEmail(), currentUser.getPassword());

        final IdeasCampaign cmd = new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            null, "Test_Title", "test_descr", "test_vidRef");

        final MvcResult mvcResult = mockMvc.perform(post("/ideas_campaigns")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + accessToken)
        )
            .andDo(log())
            .andExpect(status().isCreated()).andReturn();

        final IdeasCampaign actual = mapper.readValue(mvcResult.getResponse().getContentAsString(), IdeasCampaign.class);
        assertThat(ideasCampaignRepository.findOne(actual.getId()), notNullValue());
        thenCampaignContainsExpectedFields(actual, cmd, currentUser);
    }

    private void thenCampaignContainsExpectedFields(IdeasCampaign actual, IdeasCampaign expected, UserEntity expInitiatorUser) {
        final CampaignInitiator expInitiator = new CampaignInitiator(expInitiatorUser);
        expected.setCampaignInitiator(expInitiator);

        assertThat(actual.getStartDate().getMillis(), equalTo(expected.getStartDate().getMillis()));
        assertThat(actual.getEndDate().getMillis(), equalTo(expected.getEndDate().getMillis()));
        assertThat(actual.getTitle(), equalTo(expected.getTitle()));
        assertThat(actual.getDescription(), equalTo(expected.getDescription()));
        assertThat(actual.getVideoReference(), equalTo(expected.getVideoReference()));
        assertThat(actual.getId(), notNullValue());
    }

}
