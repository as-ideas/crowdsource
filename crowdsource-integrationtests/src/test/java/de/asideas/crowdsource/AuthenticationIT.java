package de.asideas.crowdsource;

import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.util.CrowdSourceClient;
import de.asideas.crowdsource.testsupport.util.UrlProvider;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RunWith(SpringJUnit4ClassRunner.class)
@WebIntegrationTest
@SpringApplicationConfiguration(classes = {CrowdSourceExample.class, CrowdSourceTestConfig.class})
public class AuthenticationIT {

    @Autowired
    private UrlProvider urlProvider;

    @Autowired
    private CrowdSourceClient crowdSourceClient;

    @Test
    public void unauthorizedRequest() {
        RestTemplate restTemplate = crowdSourceClient.getUnderlyingClient();

        try {
            restTemplate.postForObject(urlProvider.applicationUrl() + "/project", getPreparedProject(), Project.class);
            Assert.fail("Accessing a protected resource without access token should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(UNAUTHORIZED));
        }
    }

    @Test
    public void authorizedRequest() throws IOException {
        CrowdSourceClient.AuthToken authToken = crowdSourceClient.authorizeWithDefaultUser();
        assertThat(authToken.getAccessToken(), is(notNullValue()));

        ResponseEntity<Project> response = crowdSourceClient.createProject(getPreparedProject(), authToken);
        assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
    }

    @Test
    public void invalidCredentials() throws IOException {
        try {
            crowdSourceClient.authorize("wrong", "credentials");
            Assert.fail("Requesting an access token with wrong credentials should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(BAD_REQUEST));
        }
    }

    @Test
    public void invalidAccessToken() throws IOException {
        CrowdSourceClient.AuthToken authToken = new CrowdSourceClient.AuthToken();
        authToken.setAccessToken("some-invalid-access-token");

        try {
            crowdSourceClient.createProject(getPreparedProject(), authToken);
            Assert.fail("Accessing a protected resource with an invalid token should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(UNAUTHORIZED));
        }
    }

    private Project getPreparedProject() {
        final Project project = new Project();
        project.setPledgeGoal(1000);
        project.setTitle("myTitle");
        project.setShortDescription("shortDescription");
        project.setDescription("myDescription");
        return project;
    }
}
