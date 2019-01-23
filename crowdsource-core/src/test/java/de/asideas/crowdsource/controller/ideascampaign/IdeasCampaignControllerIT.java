package de.asideas.crowdsource.controller.ideascampaign;

import java.util.Arrays;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

        final IdeasCampaign cmd = givenValidCampaignCmd();
        final IdeasCampaign actual = givenIdeasCampaignExists(accessToken, cmd);

        assertThat(ideasCampaignRepository.findOne(actual.getId()), notNullValue());
        thenCampaignContainsExpectedFields(actual, cmd, currentUser);
    }

    @Test
    public void createIdeasCampaign_ShouldFailWithInvalidToken() throws Exception {
        final String accessToken = "wrongwrongwrongwrongwrongwrongwrongwrongwrongwrong";

        final IdeasCampaign cmd = givenValidCampaignCmd();

        mockMvc.perform(post("/ideas_campaigns")
                .content(mapper.writeValueAsString(cmd))
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .header("Authorization", "Bearer " + accessToken)
        )
                .andDo(log())
                .andExpect(status().is4xxClientError());

        assertTrue(ideasCampaignRepository.findActive(DateTime.now()).isEmpty());
    }

    @Test
    public void createIdeasCampaign_ShouldNotPersistCampaignFromStandardUser() throws Exception {
        final UserEntity currentUser = givenUserExists();
        final String accessToken = obtainAccessToken(currentUser.getEmail(), currentUser.getPassword());

        final IdeasCampaign cmd = givenValidCampaignCmd();

        mockMvc.perform(post("/ideas_campaigns")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + accessToken)
        )
            .andDo(log())
            .andExpect(status().isForbidden());

        assertTrue(ideasCampaignRepository.findActive(DateTime.now()).isEmpty());
    }

    @Test
    public void loadIdeasCampaign_ShouldReturnListOfCampaigns() throws Exception {
        final UserEntity currentAdmin = givenAdminUserExists();
        final String accessTokenAdmin = obtainAccessToken(currentAdmin.getEmail(), currentAdmin.getPassword());

        final IdeasCampaign expectedCampaign = givenIdeasCampaignExists(accessTokenAdmin, givenValidCampaignCmd());

        final UserEntity requester = givenUserExists();
        final String accessToken = obtainAccessToken(requester.getEmail(), requester.getPassword());

        final MvcResult mvcResult = mockMvc.perform(get("/ideas_campaigns")
            .header("Authorization", "Bearer " + accessToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isOk()).andReturn();

        final List<IdeasCampaign> actual = Arrays.asList(mapper.readValue(mvcResult.getResponse().getContentAsString(), IdeasCampaign[].class));
        assertThat(actual.size(), equalTo(1));
        assertThat(actual.get(0).getId(), equalTo(expectedCampaign.getId()));
    }

    @Test
    public void loadIdeasCampaign_ShouldReturnEmptyList_IfNoneExists() throws Exception {
        final UserEntity requester = givenUserExists();
        final String accessToken = obtainAccessToken(requester.getEmail(), requester.getPassword());

        final MvcResult mvcResult = mockMvc.perform(get("/ideas_campaigns")
            .header("Authorization", "Bearer " + accessToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isOk()).andReturn();

        final List<IdeasCampaign> actual = Arrays.asList(mapper.readValue(mvcResult.getResponse().getContentAsString(), IdeasCampaign[].class));
        assertThat(actual.size(), equalTo(0));
    }

    @Test
    public void loadIdeasCampaign_ShouldReturnUnauthorized_on_InvalidToken() throws Exception {
        final String accessToken = "wrongwrongwrongwrongwrongwrongwrongwrongwrongwrong";

        mockMvc.perform(get("/ideas_campaigns")
            .header("Authorization", "Bearer " + accessToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isUnauthorized());
    }

    private IdeasCampaign givenValidCampaignCmd() {
        return new IdeasCampaign(DateTime.now(), DateTime.now().plus(10000L),
            null, "Test_Title", "test_descr", "test_vidRef");
    }

    private IdeasCampaign givenIdeasCampaignExists(String accessToken, IdeasCampaign cmd) throws Exception {
        final MvcResult mvcResult = mockMvc.perform(post("/ideas_campaigns")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + accessToken)
        )
            .andDo(log())
            .andExpect(status().isCreated()).andReturn();
        return mapper.readValue(mvcResult.getResponse().getContentAsString(), IdeasCampaign.class);
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
