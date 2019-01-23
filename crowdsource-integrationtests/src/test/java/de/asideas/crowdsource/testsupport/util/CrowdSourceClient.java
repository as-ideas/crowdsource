package de.asideas.crowdsource.testsupport.util;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.prototypecampaign.Comment;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Attachment;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.presentation.prototypecampaign.project.ProjectStatusUpdate;
import de.asideas.crowdsource.presentation.user.UserActivation;
import de.asideas.crowdsource.presentation.user.UserRegistration;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

@Component
public class CrowdSourceClient {

    private static final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

    public static final String DEFAULT_USER_EMAIL = "crowdsource@crowd.source.de";
    public static final String DEFAULT_USER_FIRSTNAME = "Bob";
    public static final String DEFAULT_USER_LASTNAME = "Ross";
    public static final String DEFAULT_USER_PASS = "einEselGehtZumBaecker!";

    public static final String DEFAULT_ADMIN_EMAIL = "cs_admin@crowd.source.de";
    public static final String DEFAULT_ADMIN_PASS = "einAdminGehtZumBaecker!";

    @Autowired
    private UrlProvider urlProvider;

    @Value("${de.asideas.crowdsource.content.allowed.email.domain}")
    private String allowedEmailDomain;

    public AuthToken authorizeWithDefaultUser() {
        return authorize(DEFAULT_USER_EMAIL, DEFAULT_USER_PASS);
    }

    public AuthToken authorizeWithAdminUser() {
        return authorize(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS);
    }

    public AuthToken authorize(String email, String password) {
        MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
        tokenRequest.put("username", Arrays.asList(email));
        tokenRequest.put("password", Arrays.asList(password));
        tokenRequest.put("client_id", Arrays.asList("web"));
        tokenRequest.put("grant_type", Arrays.asList("password"));

        return restTemplate.postForObject(urlProvider.applicationUrl() + "/oauth/token", tokenRequest, AuthToken.class);
    }

    public void registerUser(String emailName) {
        // create a user via the REST API
        UserRegistration userRegistration = new UserRegistration();
        userRegistration.setEmail(emailName + "@" + allowedEmailDomain);
        userRegistration.setTermsOfServiceAccepted(true);

        restTemplate.postForObject(urlProvider.applicationUrl() + "/user", userRegistration, Void.class);
    }

    public void activateUser(String emailName, UserActivation userActivation) {
        restTemplate.postForObject(urlProvider.applicationUrl() + "/user/{email}/activation", userActivation, Void.class, emailName + "@" + allowedEmailDomain);
    }

    public void recoverPassword(String userEmail) {
        restTemplate.getForObject(urlProvider.applicationUrl() + "/user/{email}/password-recovery", Void.class, userEmail);
    }

    public ResponseEntity<Project> createProject(Project project, AuthToken authToken) {
        HttpEntity<Project> requestEntity = createRequestEntity(project, authToken);
        return restTemplate.exchange(urlProvider.applicationUrl() + "/project", HttpMethod.POST, requestEntity, Project.class);
    }

    public Attachment uploadFileAttachmentForProject(Project project, ClassPathResource fileResource) {
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = createRequestEntity(body, authorizeWithDefaultUser());

        ResponseEntity<Attachment> result = restTemplate.exchange(
                urlProvider.applicationUrl() + "/projects/" + project.getId() + "/attachments/",
                HttpMethod.POST, requestEntity, Attachment.class);
        return result.getBody();
    }

    public ResponseEntity<FinancingRound> startFinancingRound(FinancingRound financingRound, AuthToken authToken) {
        HttpEntity<FinancingRound> requestEntity = createRequestEntity(financingRound, authToken);
        return restTemplate.exchange(urlProvider.applicationUrl() + "/financingrounds", HttpMethod.POST, requestEntity, FinancingRound.class);
    }

    public FinancingRound getActiveFinanceRound() {
        try {
            return restTemplate.getForObject(urlProvider.applicationUrl() + "/financingrounds/active", FinancingRound.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public ResponseEntity<FinancingRound> stopFinancingRound(String id, AuthToken authToken) {
        HttpEntity requestEntity = createRequestEntity(authToken);
        return restTemplate.exchange(urlProvider.applicationUrl() + "/financingrounds/{id}/cancel", HttpMethod.PUT, requestEntity, FinancingRound.class, id);
    }

    public ResponseEntity<Void> pledgeProject(Project project, Pledge pledge, AuthToken authToken) {
        HttpEntity<Pledge> requestEntity = createRequestEntity(pledge, authToken);
        return restTemplate.exchange(urlProvider.applicationUrl() + "/project/{id}/pledges", HttpMethod.POST, requestEntity, Void.class, project.getId());
    }

    public void comment(Project project, String comment, AuthToken token) {
        final String commentUrl = urlProvider.applicationUrl() + "/project/{id}/comment";
        restTemplate.exchange(commentUrl, HttpMethod.POST, createRequestEntity(new Comment(null, null, comment), token), Void.class, project.getId());
    }

    private <T> HttpEntity<T> createRequestEntity(T body, AuthToken authToken) {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.put("Authorization", Arrays.asList("Bearer " + authToken.accessToken));

        return new HttpEntity<>(body, headers);
    }

    private HttpEntity createRequestEntity(AuthToken authToken) {
        return createRequestEntity(null, authToken);
    }

    public RestTemplate getUnderlyingClient() {
        return restTemplate;
    }

    public void publish(Project project, AuthToken token) {
        modifyProjectStatus(project.getId(), ProjectStatus.PUBLISHED, token);
        project.setStatus(ProjectStatus.PUBLISHED);
    }

    public void reject(Project project, AuthToken token) {
        modifyProjectStatus(project.getId(), ProjectStatus.REJECTED, token);
        project.setStatus(ProjectStatus.REJECTED);
    }

    public void defer(Project project, AuthToken token) {
        modifyProjectStatus(project.getId(), ProjectStatus.DEFERRED, token);
        project.setStatus(ProjectStatus.DEFERRED);
    }

    public void likeProject(Project project, AuthToken token) {
        final ResponseEntity<Project> exchange = restTemplate.exchange(
                urlProvider.applicationUrl() + "/projects/" + project.getId() + "/likes",
                HttpMethod.POST,
                createRequestEntity(token),
                Project.class);
        assertEquals(HttpStatus.OK, exchange.getStatusCode());
    }
    public void unlikeProject(Project project, AuthToken token) {
        final ResponseEntity<Project> exchange = restTemplate.exchange(
                urlProvider.applicationUrl() + "/projects/" + project.getId() + "/likes",
                HttpMethod.DELETE,
                createRequestEntity(token),
                Project.class);
        assertEquals(HttpStatus.OK, exchange.getStatusCode());
    }

    private void modifyProjectStatus(String projectId, ProjectStatus status, AuthToken token) {
        final ResponseEntity<Project> exchange = restTemplate.exchange(
                urlProvider.applicationUrl() + "/project/" + projectId + "/status",
                HttpMethod.PATCH,
                createRequestEntity(new ProjectStatusUpdate(status), token),
                Project.class);
        assertEquals(HttpStatus.OK, exchange.getStatusCode());
    }

    public List<Project> listProjects(AuthToken authToken) {
        ResponseEntity<Project[]> responseEntity = restTemplate.exchange(
                urlProvider.applicationUrl() + "/projects",
                HttpMethod.GET,
                createRequestEntity(authToken),
                Project[].class);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        return Arrays.asList(responseEntity.getBody());
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AuthToken {
        @JsonProperty("access_token")
        private String accessToken;

        public AuthToken() {
        }

        public String getAccessToken() {
            return this.accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        @Override
        public boolean equals(Object o) {
            return EqualsBuilder.reflectionEquals(this, o);
        }

        @Override
        public int hashCode() {
            return HashCodeBuilder.reflectionHashCode(this);
        }

        @Override
        public String toString() {
            return ToStringBuilder.reflectionToString(this);
        }
    }
}

