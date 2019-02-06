package de.asideas.crowdsource.controller.ideascampaign;

import java.io.IOException;
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
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaRejectCmd;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;
import de.asideas.crowdsource.testutil.Fixtures;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.nullValue;
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

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;

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

        final Idea cmd1 = new Idea("test_title_1", "pitch 1");
        final Idea cmd2 = new Idea("test_title_2", "pitch 2");
        final Idea cmd3 = new Idea("test_title_3", "pitch 3");
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd1);
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd2);
        givenIdeaExists(userToken, parentCampaign.getId(), cmd3).andExpect(status().isCreated()).andReturn();

        mockMvc.perform(get(Paths.IDEAS, parentCampaign.getId())
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
    public void fetchIdeas_shouldReturnIdeas_ContaingingRatings() throws Exception {

        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("test_title_1", "pitch 1");
        final Idea cmd2 = new Idea("test_title_2", "pitch 2");
        final IdeaEntity idea1 = givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd1);
        final IdeaEntity idea2 = givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd2);
        givenIdeaHasVotings(idea1.getCampaignId(), idea1.getId(), userToken, 3);
        givenIdeaHasVotings(idea1.getCampaignId(), idea1.getId(), adminToken, 5);
        givenIdeaHasVotings(idea2.getCampaignId(), idea2.getId(), userToken, 1);
        givenIdeaHasVotings(idea2.getCampaignId(), idea2.getId(), adminToken, 3);

        mockMvc.perform(get(Paths.IDEAS, parentCampaign.getId())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()", is(2)))
            .andExpect(jsonPath("$.content[0].rating.averageRating", is(4.0)))
            .andExpect(jsonPath("$.content[1].rating.averageRating", is(2.0)))
            .andReturn().getResponse().getContentAsString()
        ;
    }

    @Test
    public void fetchIdeas_shouldReturnAllMatchingOnlyByStatus_forAdmin() throws Exception {

        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("test_title_1", "pitch 1");
        final Idea cmd2 = new Idea("test_title_2", "pitch 2");
        final Idea cmd3 = new Idea("test_title_3", "pitch 3");
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd1);
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd2);
        givenIdeaExists(userToken, parentCampaign.getId(), cmd3).andExpect(status().isCreated()).andReturn();

        mockMvc.perform(get(Paths.IDEAS, parentCampaign.getId())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .param("status", "PROPOSED")
            .header("Authorization", "Bearer " + adminToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalElements", is(1)))
            .andExpect(jsonPath("$.totalPages", is(1)))
            .andExpect(jsonPath("$.number", is(0)))
            .andExpect(jsonPath("$.numberOfElements", is(1)))
            .andExpect(jsonPath("$.first", is(true)))
            .andExpect(jsonPath("$.last", is(true)))
            .andExpect(jsonPath("$.content.length()", is(1)))
            .andExpect(jsonPath("$.content[0].pitch", is("pitch 3")))
            .andReturn().getResponse().getContentAsString()
        ;

    }

    @Test
    public void fetchIdeas_shouldReturn_Http403_onRequestingStatusByNonAdmin() throws Exception {

        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("test_title_1", "pitch 1");
        final Idea cmd2 = new Idea("test_title_2", "pitch 2");
        final Idea cmd3 = new Idea("test_title_3", "pitch 3");
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd1);
        givenApprovedIdeaExists(userToken, parentCampaign.getId(), cmd2);
        givenIdeaExists(userToken, parentCampaign.getId(), cmd3).andExpect(status().isCreated()).andReturn();

        mockMvc.perform(get(Paths.IDEAS, parentCampaign.getId())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .param("status", "PROPOSED")
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isForbidden())
        ;
    }

    @Test
    public void fetchIdeasOfCurrentUser_shouldReturnCurrentUsersIdeas() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        givenIdeaExists(adminToken, parentCampaign.getId(), new Idea("test_title", "Admin's idea"));
        final Idea idea1 = toIdea(givenIdeaExists(userToken, parentCampaign.getId(), new Idea("test_title", "User's idea 1")));
        final Idea idea2 = toIdea(givenIdeaExists(userToken, parentCampaign.getId(), new Idea("test_title", "User's idea 2")));

        final String resultJson = mockMvc.perform(get(Paths.USERS_IDEAS, parentCampaign.getId())
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
    public void fetchIdeasFiltered_ShouldReturnIdeasOnly_TheRequestorHasVotedFor_onParamAlreadyVoted_isTrue() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final IdeaEntity persistedIdea = givenApprovedIdeaExists(adminToken, parentCampaign.getId(), new Idea("test_title", "An Idea"));
        givenIdeaHasVotings(parentCampaign.getId(), persistedIdea.getId(), userToken, 4);
        givenApprovedIdeaExists(adminToken, parentCampaign.getId(), new Idea("test_title_anotherIdea", "Anotheridea"));

        mockMvc.perform(get(Paths.IDEAS_FILTERED, parentCampaign.getId())
            .param("alreadyVoted", "true")
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()", equalTo(1)))
            .andExpect(jsonPath("$.content[0].id", equalTo(persistedIdea.getId())));
    }

    @Test
    public void fetchIdeasFiltered_ShouldReturnIdeasOnly_TheRequestorHas_NOT_VotedFor_onParamAlreadyVoted_isFalse() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());
        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final IdeaEntity persistedIdea = givenApprovedIdeaExists(adminToken, parentCampaign.getId(), new Idea("test_title", "An Idea"));
        givenIdeaHasVotings(parentCampaign.getId(), persistedIdea.getId(), userToken, 4);
        final IdeaEntity anotherIdea = givenApprovedIdeaExists(adminToken, parentCampaign.getId(), new Idea("test_title_anotherIdea", "Anotheridea"));

        mockMvc.perform(get(Paths.IDEAS_FILTERED, parentCampaign.getId())
            .param("alreadyVoted", "false")
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()", equalTo(1)))
            .andExpect(jsonPath("$.content[0].id", equalTo(anotherIdea.getId())));
    }

    @Test
    public void modifyIdea_shouldUpdateExistingIdea() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea cmd1 = new Idea("test_title", "this is a poorly written first draft of my pitch");
        final Idea cmd2 = new Idea("test_title", "This is a perfectly written idea pitch.");

        final MvcResult mvcRes = givenIdeaExists(userToken, parentCampaign.getId(), cmd1)
                .andExpect(status().isCreated()).andReturn();

        final Idea initialIdeaInMongo = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        mockMvc.perform(put(Paths.IDEA, parentCampaign.getId(), initialIdeaInMongo.getId())
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
    public void modifyIdea_shouldReturn_401_OnUnknownUser() throws Exception {
        mockMvc.perform(put(Paths.IDEA, "someCampaignId", "someIdeaId")
                .header("Authorization", "Bearer " + "bogustoken")
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(new Idea("test_title", "I am fake.")))
        )
                .andDo(log())
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void modifyIdea_shouldReturn_403_OnUnauthorizedUser() throws Exception {
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

        mockMvc.perform(put(Paths.IDEA, parentCampaign.getId(), initialIdeaInMongo.getId())
                .header("Authorization", "Bearer " + user2Token)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(modifiedIdea))
        )
                .andDo(log())
                .andExpect(status().isForbidden());

    }

    @Test
    public void approveIdea_shouldReturn_403_OnNonAdminUser() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user1 = givenUserExists();
        final String user1Token = obtainAccessToken(user1.getEmail(), user1.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea originalIdea = givenValidIdeaCmd();
        final MvcResult mvcRes = givenIdeaExists(user1Token, parentCampaign.getId(), originalIdea)
            .andExpect(status().isCreated()).andReturn();

        final Idea actual = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);
        final IdeaEntity initialIdeaInMongo = ideaRepository.findOne(actual.getId());

        mockMvc.perform(put(Paths.IDEA_APPROVAL, parentCampaign.getId(), initialIdeaInMongo.getId())
            .header("Authorization", "Bearer " + user1Token)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isForbidden());

    }

    @Test
    public void approveIdea_shouldBePersisted() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user1 = givenUserExists();
        final String user1Token = obtainAccessToken(user1.getEmail(), user1.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea originalIdea = givenValidIdeaCmd();
        final MvcResult mvcRes = givenIdeaExists(user1Token, parentCampaign.getId(), originalIdea)
            .andExpect(status().isCreated()).andReturn();

        final Idea actualIdea = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        mockMvc.perform(put(Paths.IDEA_APPROVAL, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + adminToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isNoContent());

        final IdeaEntity res = ideaRepository.findOne(actualIdea.getId());
        assertThat(res.getStatus(), is(IdeaStatus.PUBLISHED));

    }

    @Test
    public void rejectIdea_shouldReturn_403_OnNonAdminUser() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final Idea originalIdea = givenValidIdeaCmd();

        final Idea actualIdea = mapper.readValue(givenIdeaExists(userToken, parentCampaign.getId(), originalIdea)
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString(), Idea.class);

        mockMvc.perform(put(Paths.IDEA_REJECTION, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(new IdeaRejectCmd("I am no admin but will attempt to reject")))
        )
            .andDo(log())
            .andExpect(status().isForbidden());

    }

    @Test
    public void rejecteIdea_shouldBePersisted() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());

        final Idea originalIdea = givenValidIdeaCmd();
        final MvcResult mvcRes = givenIdeaExists(userToken, parentCampaign.getId(), originalIdea)
            .andExpect(status().isCreated()).andReturn();

        final Idea actualIdea = mapper.readValue(mvcRes.getResponse().getContentAsString(), Idea.class);

        final IdeaRejectCmd cmd = new IdeaRejectCmd("test_rejectionComment");

        mockMvc.perform(put(Paths.IDEA_REJECTION, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + adminToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(log())
            .andExpect(status().isNoContent());

        final IdeaEntity res = ideaRepository.findOne(actualIdea.getId());
        assertThat(res.getStatus(), is(IdeaStatus.REJECTED));
        assertThat(res.getRejectionComment(), is(cmd.getRejectionComment()));

    }

    @Test
    public void voteForIdea_ShouldPersistVoting() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final IdeaEntity actualIdea = givenApprovedIdeaExists(userToken, parentCampaign.getId(), givenValidIdeaCmd());

        final VoteCmd cmd = new VoteCmd(null, 5);

        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(print())
            .andExpect(status().is2xxSuccessful());

        final VoteEntity actRes = voteRepository.findOne(new VoteId(user.getId(), actualIdea.getId()));
        assertThat(actRes, notNullValue());
        assertThat(actRes.getVote(), is(5));
    }

    @Test
    public void voteForIdea_ShouldReturn_400_onExpiredCampaign() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final IdeaEntity actualIdea = givenApprovedIdeaExists(userToken, parentCampaign.getId(), givenValidIdeaCmd());

        final IdeasCampaignEntity campaignToExpire = ideasCampaignRepository.findOne(parentCampaign.getId());
        campaignToExpire.setEndDate(DateTime.now().minusSeconds(1000));
        ideasCampaignRepository.save(campaignToExpire);

        final VoteCmd cmd = new VoteCmd(null, 5);

        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(print())
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.errorCode", is("campaign_not_active")));

        final VoteEntity actRes = voteRepository.findOne(new VoteId(user.getId(), actualIdea.getId()));
        assertThat(actRes, nullValue());
    }

    @Test
    public void voteForIdea_ShouldReturnRating() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final IdeaEntity actualIdea = givenApprovedIdeaExists(userToken, parentCampaign.getId(), givenValidIdeaCmd());

        final VoteCmd cmd1 = new VoteCmd(null, 5);

        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd1))
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ideaId", is(actualIdea.getId())))
            .andExpect(jsonPath("$.countVotes", is(1)))
            .andExpect(jsonPath("$.ownVote", is(5)))
            .andExpect(jsonPath("$.averageRating", is(5.0)))
        ;

        final VoteCmd cmd2 = new VoteCmd(null, 3);
        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + adminToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd2))
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ideaId", is(actualIdea.getId())))
            .andExpect(jsonPath("$.countVotes", is(2)))
            .andExpect(jsonPath("$.ownVote", is(3)))
            .andExpect(jsonPath("$.averageRating", is(4.0)))
        ;

    }

    @Test
    public void voteForIdea_ShouldDoNothing_on_ZeroValueWithoutExistingVote() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final IdeaEntity actualIdea = givenApprovedIdeaExists(userToken, parentCampaign.getId(), givenValidIdeaCmd());

        final VoteCmd cmd = new VoteCmd(null, 0);
        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ideaId", is(actualIdea.getId())))
            .andExpect(jsonPath("$.countVotes", is(0)))
            .andExpect(jsonPath("$.ownVote", is(0)))
            .andExpect(jsonPath("$.averageRating", is(0.0)))
        ;
    }

    @Test
    public void voteForIdea_ShouldRemoveVote_on_ZeroValue() throws Exception {
        final UserEntity admin = givenAdminUserExists();
        final String adminToken = obtainAccessToken(admin.getEmail(), admin.getPassword());

        final UserEntity user = givenUserExists();
        final String userToken = obtainAccessToken(user.getEmail(), user.getPassword());

        final IdeasCampaign parentCampaign = givenIdeasCampaignExists(adminToken, givenValidCampaignCmd());
        final IdeaEntity actualIdea = givenApprovedIdeaExists(userToken, parentCampaign.getId(), givenValidIdeaCmd());

        final VoteCmd cmd1 = new VoteCmd(null, 5);

        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd1))
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ideaId", is(actualIdea.getId())))
            .andExpect(jsonPath("$.countVotes", is(1)))
            .andExpect(jsonPath("$.ownVote", is(5)))
            .andExpect(jsonPath("$.averageRating", is(5.0)))
        ;

        final VoteCmd cmd2 = new VoteCmd(null, 0);
        mockMvc.perform(put(Paths.IDEA_VOTES, parentCampaign.getId(), actualIdea.getId())
            .header("Authorization", "Bearer " + userToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd2))
        )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ideaId", is(actualIdea.getId())))
            .andExpect(jsonPath("$.countVotes", is(0)))
            .andExpect(jsonPath("$.ownVote", is(0)))
            .andExpect(jsonPath("$.averageRating", is(0.0)))
        ;

    }

    private ResultActions givenIdeaExists(String accessToken, String campaignId, Idea cmd) throws Exception {
        return mockMvc.perform(post(Paths.IDEAS, campaignId)
                .header("Authorization", "Bearer " + accessToken)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(mapper.writeValueAsBytes(cmd))
        )
                .andDo(log());
    }
    private IdeaEntity givenApprovedIdeaExists(String accessToken, String campaignId, Idea cmd) throws Exception {
        final Idea givenIdea = mapper.readValue(givenIdeaExists(accessToken, campaignId, cmd).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString(), Idea.class);
        final IdeaEntity entity = ideaRepository.findOne(givenIdea.getId());
        entity.approveIdea(Fixtures.givenUserEntity("4212"));
        return ideaRepository.save(entity);
    }

    private Idea givenValidIdeaCmd() {
        final Idea result = new Idea("test_title", "SPOOOOOONS!");
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

    private void givenIdeaHasVotings(String campaignId, String ideaId, String bearerToken, int voting) throws Exception{

        final VoteCmd cmd = new VoteCmd(null, voting);
        mockMvc.perform(put(Paths.IDEA_VOTES, campaignId, ideaId)
            .header("Authorization", "Bearer " + bearerToken)
            .accept(MediaType.APPLICATION_JSON_UTF8)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(cmd))
        )
            .andDo(print())
            .andExpect(status().is2xxSuccessful());

    }
}
