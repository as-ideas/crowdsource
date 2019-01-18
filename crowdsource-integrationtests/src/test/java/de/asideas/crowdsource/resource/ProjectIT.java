package de.asideas.crowdsource.resource;

import de.asideas.crowdsource.CrowdSourceExample;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.util.UrlProvider;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

@RunWith(SpringJUnit4ClassRunner.class)
@WebIntegrationTest
@SpringApplicationConfiguration(classes = {CrowdSourceExample.class, CrowdSourceTestConfig.class})
public class ProjectIT {

    @Autowired
    private UrlProvider urlProvider;

    @Test
    public void addProject_accessDenied() {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

        Project project = new Project();
        project.setTitle("title");
        project.setShortDescription("short description");
        project.setPledgeGoal(1);
        project.setDescription("description");

        try {
            restTemplate.postForObject(urlProvider.applicationUrl() + "/project", project, Void.class);
            Assert.fail("Accessing a protected resource should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
        }
    }

    @Test
    public void getProject_notFound() {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

        try {
            restTemplate.getForObject(urlProvider.applicationUrl() + "/project/{projectId}", Project.class, "non-existant-project-id");
            Assert.fail("Accessing a protected resource should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(HttpStatus.NOT_FOUND));
        }
    }

    @Test
    public void pledgeProject_accessDenied() {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

        Pledge pledge = new Pledge(1);

        try {
            restTemplate.postForObject(urlProvider.applicationUrl() + "/project/{projectId}/pledges", pledge, Void.class, "some-project-id");
            Assert.fail("Accessing a protected resource should fail");
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
        }
    }

}
