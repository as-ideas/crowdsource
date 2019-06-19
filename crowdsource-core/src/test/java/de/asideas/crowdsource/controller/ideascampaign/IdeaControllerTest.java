package de.asideas.crowdsource.controller.ideascampaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaIn;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import de.asideas.crowdsource.controller.ControllerExceptionAdvice;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaRejectCmd;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@EnableWebMvc
@WebAppConfiguration
@ContextConfiguration(classes = {IdeaController.class, ControllerExceptionAdvice.class})
public class IdeaControllerTest {

    private MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;

    @MockBean
    private UserService userService;

    @MockBean
    private IdeaService ideaService;

    protected ObjectMapper mapper = new ObjectMapper();

    @Before
    public void init() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .alwaysDo(print())
            .build();
    }

    @Test
    public void createIdea_ShouldReturn_400_onEmptyTitle() throws Exception {
        IdeaIn cmd = new IdeaIn((String) null, "test_pitch");

        mockMvc.perform(post("/ideas_campaigns/anId/ideas")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.title", equalTo("may not be empty")));
    }

    @Test
    public void createIdea_ShouldReturn_400_onEmptyPitch() throws Exception {
        IdeaIn cmd = new IdeaIn("test_title", (String) null);

        mockMvc.perform(post("/ideas_campaigns/anId/ideas")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.pitch", equalTo("may not be empty")));
    }

    @Test
    public void updateIdea_ShouldReturn_400_onInvalidPitch() throws Exception {
        IdeaIn cmd = new IdeaIn("test_title", "nope");

        mockMvc.perform(put("/ideas_campaigns/aCampaignId/ideas/anIdeaId")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.pitch", equalTo("size must be between 5 and 255")));
    }

    @Test
    public void createIdea_ShouldReturn_400_onPitchSizeInvalid() throws Exception {
        // Longer than 255 chars
        final IdeaIn cmd = new IdeaIn("test_title", "Lo000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
            "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ng");

        mockMvc.perform(post("/ideas_campaigns/anId/ideas")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.fieldViolations.pitch", equalTo("size must be between 5 and 255")));
        ;
    }

    @Test
    public void rejectIdea_ShouldReturn_400_onRejectionCommentNotGiven() throws Exception {

        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}/rejection", "test_campId", "test_ideaId")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content("{}")
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.rejectionComment", equalTo("may not be empty"))
            );
    }

    @Test
    public void rejectIdea_ShouldReturn_400_onRejectionCommentSizeViolation() throws Exception {
        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}/rejection", "test_campId", "test_ideaId")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(new IdeaRejectCmd("too Short")))
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.rejectionComment", equalTo("size must be between 10 and 1000"))
            );
    }

    @Test
    public void voteIdea_ShouldReturn_400_onValueLowerThan_0() throws Exception {
        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}/votes", "test_campId", "test_ideaId")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(new VoteCmd(null, -1)))
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.vote", equalTo("must be greater than or equal to 0"))
            );
    }

    @Test
    public void voteIdea_ShouldReturn_400_onValueHigherThan_5() throws Exception {
        mockMvc.perform(put("/ideas_campaigns/{campaignId}/ideas/{ideaId}/votes", "test_campId", "test_ideaId")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(mapper.writeValueAsBytes(new VoteCmd(null, 6)))
        )
            .andDo(log())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldViolations.vote", equalTo("must be less than or equal to 5"))
            );
    }


}