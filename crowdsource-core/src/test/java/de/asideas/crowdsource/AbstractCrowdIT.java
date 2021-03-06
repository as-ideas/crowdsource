package de.asideas.crowdsource;


import java.util.Arrays;
import java.util.List;
import javax.annotation.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.util.CrowdsourceTestApp;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@TestPropertySource("classpath:application-test.properties")
@SpringBootTest(classes = {CrowdsourceTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractCrowdIT {

    public static final String PASSWORD = "SEKRET";
    protected ObjectMapper mapper = new ObjectMapper();

    @Resource
    protected WebApplicationContext webApplicationContext;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    protected MockMvc mockMvc;

    @Before
    public void prepareTests() {
        mongoTemplate.getDb().dropDatabase();

        mockMvc = MockMvcBuilders
            .webAppContextSetup(webApplicationContext)
            .addFilter(springSecurityFilterChain)
            .build();
        mapper.registerModule(new JodaModule());
    }

    protected UserEntity givenAdminUserExists() {
        UserEntity user = givenUser("admin@mail.com", Arrays.asList(Roles.ROLE_USER, Roles.ROLE_ADMIN));
        user = userRepository.save(user);
        user.setPassword("SEKRET");
        user.setFirstName("Admin");
        user.setLastName("AdminAdmin");
        return user;
    }

    protected UserEntity givenUserExists() {
        UserEntity user = givenUser("user@mail.com", Arrays.asList(Roles.ROLE_USER));
        user = userRepository.save(user);
        user.setPassword("SEKRET");
        return user;
    }

    protected UserEntity givenDifferentUserExists() {
        UserEntity user = givenUser("alternative@blablubb.com", Arrays.asList(Roles.ROLE_USER));
        user = userRepository.save(user);
        user.setPassword(PASSWORD);
        return user;
    }

    private UserEntity givenUser(String mail, List<String> roles) {
        UserEntity res = new UserEntity(mail, "Guybrush", "Threepwood");
        res.setActivated(true);
        res.setRoles(roles);
        res.setPassword(passwordEncoder.encode(PASSWORD));
        return res;
    }

    protected String obtainAccessToken(String username, String password) throws Exception {

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "password");
        params.add("client_id", "web");
        params.add("username", username);
        params.add("password", password);

        ResultActions result
            = mockMvc.perform(post("/oauth/token")
            .params(params)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"));

        String resultString = result.andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        return jsonParser.parseMap(resultString).get("access_token").toString();
    }

}
