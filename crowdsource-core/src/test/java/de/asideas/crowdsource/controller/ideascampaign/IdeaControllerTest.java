package de.asideas.crowdsource.controller.ideascampaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.CoreMatchers;
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import de.asideas.crowdsource.controller.ControllerExceptionAdvice;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;
import de.asideas.crowdsource.testutil.Fixtures;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    public void createIdea_ShouldReturn_400_onEmptyPitch() throws Exception {
        Idea cmd = new Idea((String) null);

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
        Idea cmd = new Idea("nope");

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
        final Idea cmd = new Idea("Lo000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
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

}