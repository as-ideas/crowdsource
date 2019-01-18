package de.asideas.crowdsource.controller;

import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.Resource;
import java.util.Arrays;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = UserMetricsControllerTest.Config.class)
public class UserMetricsControllerTest {

    @Autowired
    private UserRepository userRepository;

    @Resource
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Before
    public void init() {

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        reset(userRepository);

        when(userRepository.findAll()).thenReturn(Arrays.asList(userEntity(21), userEntity(5), userEntity(7)));
    }

    @Test
    public void testGetUserMetrics() throws Exception {
        final MvcResult mvcResult = mockMvc.perform(get("/users/metrics"))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString(), is("{\"count\":3,\"remainingBudget\":33}"));
        verify(userRepository).findAll();
    }

    private UserEntity userEntity(int budget) {
        UserEntity userEntity = new UserEntity();
        userEntity.setBudget(budget);
        return userEntity;
    }


    @Configuration
    @EnableWebMvc
    static class Config {

        @Bean
        public UserMetricsController userMetricsController() {
            return new UserMetricsController();
        }

        @Bean
        public UserRepository userRepository() {
            return mock(UserRepository.class);
        }
    }
}