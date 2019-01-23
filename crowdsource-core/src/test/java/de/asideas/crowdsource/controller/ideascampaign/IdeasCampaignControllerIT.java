package de.asideas.crowdsource.controller.ideascampaign;

import java.util.Arrays;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

    @Test
    public void modifyCampaignMasterdata_ShouldPersistChanges() throws Exception {
        final UserEntity userEntityAdmin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(userEntityAdmin.getEmail(), userEntityAdmin.getPassword());
        final IdeasCampaign givenCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final IdeasCampaign modifyCmd = new IdeasCampaign(DateTime.now().plusDays(5), DateTime.now().plusDays(10),
            null, "new Sponsor", "new_title", "newDescr", null, "new teaser image");

        mockMvc.perform(put("/ideas_campaigns/{campaignId}", givenCampaign.getId())
            .header("Authorization", "Bearer " + adminToken)
            .content(mapper.writeValueAsBytes(modifyCmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isOk());

        final IdeasCampaign actual = new IdeasCampaign(ideasCampaignRepository.findOne(givenCampaign.getId()));
        assertThat(actual.getTitle(), equalTo(modifyCmd.getTitle()));
        assertThat(actual.getSponsor(), equalTo(modifyCmd.getSponsor()));
        assertThat(actual.getDescription(), equalTo(modifyCmd.getDescription()));
        assertThat(actual.getVideoReference(), equalTo(modifyCmd.getVideoReference()));
        assertThat(actual.getTeaserImageReference(), equalTo(modifyCmd.getTeaserImageReference()));
        assertThat(actual.getStartDate().getMillis(), equalTo(modifyCmd.getStartDate().getMillis()));
        assertThat(actual.getEndDate().getMillis(), equalTo(modifyCmd.getEndDate().getMillis()));
    }

    @Test
    public void modifyCampaignMasterdata_ShouldReturnForbidden_on_regularUser() throws Exception {
        final UserEntity userEntityAdmin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(userEntityAdmin.getEmail(), userEntityAdmin.getPassword());
        final IdeasCampaign givenCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final UserEntity userEntity = givenUserExists();
        final String userToken = obtainAccessToken(userEntity.getEmail(), userEntity.getPassword());

        final IdeasCampaign modifyCmd = new IdeasCampaign(DateTime.now().plusDays(5), DateTime.now().plusDays(10),
                null, "new Sponsor", "new_title", "newDescr", null, "new teaser image");

        mockMvc.perform(put("/ideas_campaigns/{campaignId}", givenCampaign.getId())
                .header("Authorization", "Bearer " + userToken)
                .content(mapper.writeValueAsBytes(modifyCmd))
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
                .andDo(log())
                .andExpect(status().isForbidden());
    }

    @Test
    public void modifyCampaignMasterdata_ShouldReturnUnauthorized_on_invalidToken() throws Exception {
        final UserEntity userEntityAdmin = givenAdminUserExists();
        final String invalidToken = "wrongwrongwrongwrongwrongwrongwrongwrongwrongwrong";
        final String adminToken = obtainAccessToken(userEntityAdmin.getEmail(), userEntityAdmin.getPassword());
        final IdeasCampaign givenCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final IdeasCampaign modifyCmd = new IdeasCampaign(DateTime.now().plusDays(5), DateTime.now().plusDays(10),
                null, "new Sponsor", "new_title", "newDescr", null, "new teaser image");

        mockMvc.perform(put("/ideas_campaigns/{campaignId}", givenCampaign.getId())
                .header("Authorization", "Bearer " + invalidToken)
                .content(mapper.writeValueAsBytes(modifyCmd))
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
                .andDo(log())
                .andExpect(status().isUnauthorized());
    }

    private IdeasCampaign givenValidCampaignCmd() {
        return new IdeasCampaign(DateTime.now().minus(1000L), DateTime.now().plus(10000L),
            null, "The Sponsor", "Test_Title", "test_descr", "test_vidRef", "test_teaserImage");
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

        assertThat(actual.getId(), notNullValue());
        assertThat(actual.isActive(), is(true));
        assertThat(actual.getStartDate().getMillis(), equalTo(expected.getStartDate().getMillis()));
        assertThat(actual.getEndDate().getMillis(), equalTo(expected.getEndDate().getMillis()));
        assertThat(actual.getTitle(), equalTo(expected.getTitle()));
        assertThat(actual.getDescription(), equalTo(expected.getDescription()));
        assertThat(actual.getVideoReference(), equalTo(expected.getVideoReference()));
        assertThat(actual.getTeaserImageReference(), equalTo(expected.getTeaserImageReference()));
        assertThat(actual.getSponsor(), equalTo(expected.getSponsor()));
    }

}
