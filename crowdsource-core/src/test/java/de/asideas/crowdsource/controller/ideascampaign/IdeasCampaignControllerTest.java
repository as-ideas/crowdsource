package de.asideas.crowdsource.controller.ideascampaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignContent;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignContentList;
import org.joda.time.DateTime;
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

import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@EnableWebMvc
@WebAppConfiguration
@ContextConfiguration(classes = IdeasCampaignController.class)
public class IdeasCampaignControllerTest {

    private MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;

    @MockBean
    private IdeasCampaignService ideasCampaignService;

    @MockBean
    private UserService userService;

    protected ObjectMapper mapper = new ObjectMapper();

    @Before
    public void init() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .alwaysDo(print())
            .build();
    }

    @Test
    public void createCampaign_ShouldReturn_400_OnInvalidCmd() throws Exception {
        final IdeasCampaign cmd = givenIdeasCampaignCmd("test_userId", null, null);

        mockMvc.perform(post("/ideas_campaigns")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest()).andReturn();
    }

    @Test
    public void modifyCampaignMasterdata_ShouldReturn_400_OnInvalidCmd() throws Exception {
        final IdeasCampaign cmd = givenIdeasCampaignCmd("test_userId", null, null);

        mockMvc.perform(put("/ideas_campaigns/test_CampaignId")
            .content(mapper.writeValueAsString(cmd))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
        )
            .andDo(log())
            .andExpect(status().isBadRequest()).andReturn();
    }


    private IdeasCampaign givenIdeasCampaignCmd(String userId, DateTime startDate, DateTime endDate) {
        return new IdeasCampaign(
                startDate,
                endDate,
                new CampaignInitiator(userId, "test_username"),
                "test_sponsor",
                new IdeasCampaignContentList(
                    new IdeasCampaignContent("Test_Title", "test_descr", "test_teaserImg","test_vidRef", "videoImageRef"),
                    new IdeasCampaignContent("Test_Title", "test_descr", "test_teaserImg","test_vidRef", "videoImageRef")
                ));
    }

}
