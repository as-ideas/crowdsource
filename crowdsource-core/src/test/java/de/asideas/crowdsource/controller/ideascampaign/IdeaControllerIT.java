package de.asideas.crowdsource.controller.ideascampaign;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
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
    public void fetchIdeas_shouldReturnAllAsPage() throws Exception {

        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("pitch 1");
        final Idea cmd2 = new Idea("pitch 2");
        givenIdeaExists(userToken, parentCampaign.getId(), cmd1).andExpect(status().isCreated()).andReturn();
        givenIdeaExists(userToken, parentCampaign.getId(), cmd2).andExpect(status().isCreated()).andReturn();

        mockMvc.perform(get("/ideas_campaigns/{campaignId}/ideas", parentCampaign.getId())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalElements", is(2)))
            .andExpect(jsonPath("$.totalPages", is(1)))
            .andExpect(jsonPath("$.number", is(0)))
            .andExpect(jsonPath("$.numberOfElements", is(2)))
            .andExpect(jsonPath("$.first", is(true)))
            .andExpect(jsonPath("$.last", is(true)))
            .andExpect(jsonPath("$.content.length()", is(2)))
            .andExpect(jsonPath("$.content[0].pitch", is("pitch 1")))
            .andExpect(jsonPath("$.content[1].pitch", is("pitch 2")))
            .andReturn().getResponse().getContentAsString()
            ;

    }

    @Test
    public void fetchIdeasOfCurrentUser_shouldReturnCurrentUsersIdeas() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        givenIdeaExists(adminToken, parentCampaign.getId(), new Idea("Admin's idea"));
        final Idea idea1 = toIdea(givenIdeaExists(userToken, parentCampaign.getId(), new Idea("User's idea 1")));
        final Idea idea2 = toIdea(givenIdeaExists(userToken, parentCampaign.getId(), new Idea("User's idea 2")));

        final String resultJson = mockMvc.perform(get("/ideas_campaigns/{campaignId}/my_ideas", parentCampaign.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .header("Authorization", "Bearer " + userToken)
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
                .andDo(log())
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        final List<Idea> res = Arrays.asList(mapper.readValue(resultJson, Idea[].class));
        assertThat(res.size(), is(2));
        assertThat(res.stream().anyMatch(el -> el.getId().equals(idea1.getId())), is(true));
        assertThat(res.stream().anyMatch(el -> el.getId().equals(idea2.getId())), is(true));
        res.forEach(el -> {
            assertThat(el.getCreatorName(), is(user.getFirstName()));
        });
    }

    @Test
    public void modifyIdea_shouldUpdateExistingIdea() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("this is a poorly written first draft of my pitch");
        final Idea cmd2 = new Idea("This is a perfectly written idea pitch.");

        final MvcResult mvcRes = givenIdeaExists(userToken, parentCampaign.getId(), cmd1)
                .andExpect(status().isCreated()).andReturn();

        final Idea initialIdeaInMongo = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}", parentCampaign.getId(), initialIdeaInMongo.getId())
                .header("Authorization", "Bearer " + userToken)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(cmd2))
        )
                .andDo(log())
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        final IdeaEntity modifiedIdeaInMongo = ideaRepository.findOne(initialIdeaInMongo.getId());
        thenIdeaEntityContainsExpectedFields(modifiedIdeaInMongo, cmd2, parentCampaign.getId());
    }

    @Test
    public void updateIdea_shouldReturn_401_OnUnknownUser() throws Exception {
        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}", "someCampaignId", "someIdeaId")
                .header("Authorization", "Bearer " + "bogustoken")
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(new Idea("I am fake.")))
        )
                .andDo(log())
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void updateIdea_shouldReturn_403_OnUnauthorizedUser() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user1 = givenUserExists();
        final String user1Token = obtainAccessToken(user1.getEmail(), user1.getPassword());

        final UserEntity user2 = givenDifferentUserExists();
        final String user2Token = obtainAccessToken(user2.getEmail(), user2.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea originalIdea = givenValidIdeaCmd();
        final MvcResult mvcRes = givenIdeaExists(user1Token, parentCampaign.getId(), originalIdea)
                .andExpect(status().isCreated()).andReturn();

        final Idea actual = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        final IdeaEntity initialIdeaInMongo = ideaRepository.findOne(actual.getId());

        final Idea modifiedIdea = givenValidIdeaCmd();

        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}", parentCampaign.getId(), initialIdeaInMongo.getId())
                .header("Authorization", "Bearer " + user2Token)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(modifiedIdea))
        )
                .andDo(log())
                .andExpect(status().isForbidden());

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

    private Idea toIdea(ResultActions givenIdeaExists) throws IOException {
        return mapper.readValue(givenIdeaExists.andReturn().getResponse().getContentAsString(), Idea.class);
    }

}
