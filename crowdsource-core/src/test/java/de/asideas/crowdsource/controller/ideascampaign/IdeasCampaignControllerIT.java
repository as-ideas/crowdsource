package de.asideas.crowdsource.controller.ideascampaign;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import de.asideas.crowdsource.CrowdSource;
import de.asideas.crowdsource.CrowdsourceTestApp;
import de.asideas.crowdsource.config.MongoDBConfig;
import de.asideas.crowdsource.config.SchedulerConfig;
import de.asideas.crowdsource.config.SecurityConfig;
import de.asideas.crowdsource.config.mail.MailSenderConfig;
import de.asideas.crowdsource.config.mail.MailTemplateConfig;
import de.asideas.crowdsource.controller.prototypecampaign.FinancingRoundControllerMockMvcTest;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.util.TestMongoConfig;

import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)

@Import({ThymeleafAutoConfiguration.class, MongoDBConfig.class, SecurityConfig.class, MailSenderConfig.class, MailTemplateConfig.class, SchedulerConfig.class})
@ComponentScan(basePackages = "de.asideas.crowdsource", excludeFilters = @ComponentScan.Filter(Configuration.class))
@SpringApplicationConfiguration(classes = {
    CrowdsourceTestApp.class
//    TestMongoConfig.class,
//    IdeasCampaignControllerIT.TestConfig.class
})
@IntegrationTest
public class IdeasCampaignControllerIT {

    private MockMvc mockMvc;
    private ObjectMapper mapper = new ObjectMapper();

    @Resource
    private WebApplicationContext webApplicationContext;

    @Before
    public void init() {

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        List<UserEntity> userEntities = new ArrayList<>();
        userEntities.add(new UserEntity("test1@mail.com", "Karl", "Ranseier"));
        userEntities.add(new UserEntity("test2@mail.com", "Guybrush", "Threepwood"));

        mapper.registerModule(new JodaModule());
    }

    @Test
    public void createIdeasCampaign_ShouldPersistCampaign(){

    }

    @Configuration
    @Import(CrowdsourceTestApp.class)
    public static class TestConfig {

        @Bean
        public PropertyPlaceholderConfigurer propertyPlaceholderConfigurer() {
            final PropertyPlaceholderConfigurer res = new PropertyPlaceholderConfigurer();
            res.setLocations(
                new ClassPathResource("application.properties"),
                new ClassPathResource("application-test.properties"));
            return res;
        }

    }

}
