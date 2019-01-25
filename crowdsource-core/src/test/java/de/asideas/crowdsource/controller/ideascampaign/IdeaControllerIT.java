package de.asideas.crowdsource.controller.ideascampaign;

import java.util.Arrays;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class IdeaControllerIT extends AbstractCrowdIT {

    @Autowired
    private IdeaRepository ideaRepository;

    @Test
    public void createIdea_shouldPersistNewIdea() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd = givenValidIdeaCmd();
        final MvcResult mvcRes = givenIdeaExists(userToken, parentCampaign.getId(), cmd)
            .andExpect(status().isCreated()).andReturn();

        final Idea actual = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        final IdeaEntity actualPersisted = ideaRepository.findOne(actual.getId());
        thenIdeaEntityContainsExpectedFields(actualPersisted, cmd, parentCampaign.getId());
    }

    @Test
    public void createIdea_shouldReturn_401_OnUnknownUser() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final String userToken = "UNKNOWN";

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd = givenValidIdeaCmd();
        givenIdeaExists(userToken, parentCampaign.getId(), cmd)
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void fetchIdeas_shouldReturnAll() throws Exception {

        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("pitch 1");
        final Idea cmd2 = new Idea("pitch 2");
        givenIdeaExists(userToken, parentCampaign.getId(), cmd1).andExpect(status().isCreated()).andReturn();
        givenIdeaExists(userToken, parentCampaign.getId(), cmd2).andExpect(status().isCreated()).andReturn();

        final String resultJson = mockMvc.perform(get("/ideas_campaigns/{campaignId}/ideas", parentCampaign.getId())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        final List<Idea> resIdeas = Arrays.asList(mapper.readValue(resultJson, Idea[].class));
        assertThat(resIdeas.size(), is(2));
        assertThat(resIdeas.get(0).getId(), not(equalTo(resIdeas.get(0).getPitch())));

    }

    private ResultActions givenIdeaExists(String accessToken, String campaignId, Idea cmd) throws Exception {
        return mockMvc.perform(post("/ideas_campaigns/{campaignId}/ideas", campaignId)
            .header("Authorization", "Bearer " + accessToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(log());
    }

    private Idea givenValidIdeaCmd() {
        final Idea result = new Idea("SPOOOOOONS!");
        return result;
    }

    private void thenIdeaEntityContainsExpectedFields(IdeaEntity actual, Idea expected, String expectedCampaignId) {
        assertThat(actual, is(notNullValue()));
        assertThat(actual.getPitch(), equalTo(expected.getPitch()));
        assertThat(actual.getStatus(), equalTo(IdeaStatus.PROPOSED));

        assertThat(actual.getCreatedDate(), notNullValue());
        assertThat(actual.getLastModifiedDate(), notNullValue());
        assertThat(actual.getCreator().getEmail(), notNullValue());
        assertThat(actual.getCampaignId(), equalTo(expectedCampaignId));
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

    private IdeasCampaign givenValidCampaignCmd() {
        return new IdeasCampaign(DateTime.now().minus(1000L), DateTime.now().plus(10000L),
            null, "The Sponsor", "Test_Title", "test_descr", "test_vidRef", "test_teaserImage");
    }


}
