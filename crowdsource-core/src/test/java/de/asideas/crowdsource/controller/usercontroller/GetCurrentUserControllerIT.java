package de.asideas.crowdsource.controller.usercontroller;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class GetCurrentUserControllerIT extends AbstractUserControllerIT {

    @Test
    public void getCurrentUser_shouldReturnUserSuccessfully() throws Exception {

        when(financingRoundRepository.findActive(any())).thenReturn(new FinancingRoundEntity());

        MvcResult mvcResult = mockMvc.perform(get("/user/current")
                .principal(new UsernamePasswordAuthenticationToken(ACTIVATED_USER_MAIL_ADDRESS, "somepassword"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString(),
                is("{\"email\":\"existing.and.activated@crowd.source.de\",\"roles\":[\"ROLE_USER\"],\"budget\":500,\"name\":\"Karl Ranseier\"}"));
    }

    @Test
    public void getCurrentUser_shouldReturnNoBudgetIfTheFinancingRoundIsOver() throws Exception {

        when(financingRoundRepository.findActive(any())).thenReturn(null);

        MvcResult mvcResult = mockMvc.perform(get("/user/current")
                .principal(new UsernamePasswordAuthenticationToken(ACTIVATED_USER_MAIL_ADDRESS, "somepassword"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString(),
                is("{\"email\":\"existing.and.activated@crowd.source.de\",\"roles\":[\"ROLE_USER\"],\"budget\":0,\"name\":\"Karl Ranseier\"}"));
    }

    @Test
    public void getCurrentUser_shouldRespondWith401IfUserWasNotFound() throws Exception {

        mockMvc.perform(get("/user/current")
                .principal(new UsernamePasswordAuthenticationToken("unknown@user.com", "somepassword"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
