package de.asideas.crowdsource;


import javax.annotation.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;

@RunWith(SpringRunner.class)
@TestPropertySource("/application-test.properties")
@SpringBootTest(classes = {
    CrowdsourceTestApp.class
})
public abstract class AbstractCrowdIT {

    protected MockMvc mockMvc;
    protected ObjectMapper mapper = new ObjectMapper();

    @Resource
    protected WebApplicationContext webApplicationContext;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Before
    public void prepareTests() {
        mongoTemplate.getDb().dropDatabase();

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        mapper.registerModule(new JodaModule());
    }

    protected UserEntity givenUserExists() {
        return userRepository.save(new UserEntity("test2@mail.com", "Guybrush", "Threepwood"));
    }
}
