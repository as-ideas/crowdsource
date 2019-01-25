package de.asideas.crowdsource.testsupport.cucumber;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.presentation.user.ProjectCreator;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.domain.shared.prototypecampaign.ProjectStatus;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.util.CrowdSourceClient;
import de.asideas.crowdsource.testsupport.util.MailServerClient;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;

import static de.asideas.crowdsource.testsupport.util.CrowdSourceClient.*;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.text.IsEqualIgnoringCase.equalToIgnoringCase;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

@ContextConfiguration(classes = CrowdSourceTestConfig.class)
public class MailSteps {

    public static final String TEST_COMMENT = "Hot project, dude!";

    @Autowired
    private CrowdSourceClient crowdSourceClient;

    @Autowired
    private MailServerClient mailServerClient;

    @Value("${de.asideas.crowdsource.content.allowed.email.domain}")
    private String allowedEmailDomain;

    private String userEmail;
    private Project createdProject;

    @When("^a new user registers$")
    public void a_new_user_registers() throws Throwable {

        userEmail = "registrationTest+" + RandomStringUtils.randomAlphanumeric(10);
        crowdSourceClient.registerUser(userEmail);
    }

    @Then("^he receives an activation email$")
    public void he_receives_an_activation_email() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();

        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertThat(receivedMessage.to, is(equalToIgnoringCase(userEmail + "@" + allowedEmailDomain)));
        assertEquals(UserNotificationService.SUBJECT_ACTIVATION, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("Du hast Dich gerade auf der CrowdSource Platform angemeldet."));
        assertThat(receivedMessage.message, containsString("Um Deine Registrierung abzuschließen, öffne bitte diesen Link und setze Dein Passwort:"));
    }

    @When("^the user claims to have forgotten his password$")
    public void the_user_claims_to_have_forgotten_his_password() throws Throwable {

        crowdSourceClient.recoverPassword(DEFAULT_USER_EMAIL);
    }

    @Then("^he receives a 'password forgotten' email$")
    public void he_receives_a_password_forgotten_email() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();
        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertEquals(DEFAULT_USER_EMAIL, receivedMessage.to);
        assertEquals(UserNotificationService.SUBJECT_PASSWORD_FORGOTTEN, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("Du hast soeben ein neues Passwort für Dein Konto bei der CrowdSource Plattform angefordert."));
        assertThat(receivedMessage.message, containsString("Bitte öffne diesen Link:"));
    }

    @When("^a new project is submitted via the HTTP-Endpoint$")
    public void a_new_project_is_submitted_via_the_HTTP_Endpoint() throws Throwable {

        final CrowdSourceClient.AuthToken authToken = crowdSourceClient.authorizeWithDefaultUser();
        final Project project = new Project();
        project.setCreator(new ProjectCreator(new UserEntity(DEFAULT_USER_EMAIL, DEFAULT_USER_FIRSTNAME, DEFAULT_USER_LASTNAME)));
        project.setStatus(ProjectStatus.PUBLISHED);
        project.setPledgeGoal(1000);
        project.setShortDescription("short description");
        project.setDescription("my cool description");
        project.setTitle("wow!");
        this.createdProject = crowdSourceClient.createProject(project, authToken).getBody();
    }

    @Then("^an email notification is sent to the administrator$")
    public void an_email_notification_is_sent_to_the_administrator() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();
        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertEquals(DEFAULT_ADMIN_EMAIL, receivedMessage.to);
        assertEquals(UserNotificationService.SUBJECT_PROJECT_CREATED, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("es liegt ein neues Projekt zur Freigabe vor:"));
    }

    @And("^an administrator rejects the project$")
    public void an_administrator_rejects_the_project() throws Throwable {

        createdProject.setStatus(ProjectStatus.REJECTED);
        crowdSourceClient.reject(createdProject, crowdSourceClient.authorizeWithAdminUser());
    }

    @And("^an administrator publishes the project$")
    public void an_administrator_publishes_the_project() throws Throwable {
        crowdSourceClient.publish(createdProject, crowdSourceClient.authorizeWithAdminUser());
        createdProject.setStatus(ProjectStatus.PUBLISHED);
    }

    @And("^an administrator defers the project$")
    public void an_administrator_defers_the_project() throws Throwable {
        createdProject.setStatus(ProjectStatus.DEFERRED);
        crowdSourceClient.defer(createdProject, crowdSourceClient.authorizeWithAdminUser());
    }

    @And("^an administrator comments the project.*$")
    public void an_Administrator_Comments_The_Project() throws Throwable {
        crowdSourceClient.comment(createdProject, TEST_COMMENT, crowdSourceClient.authorizeWithAdminUser());
    }

    @Then("^an email notification about the rejected project is sent to the user$")
    public void an_email_notification_about_the_rejected_project_is_sent_to_the_user() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();
        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertEquals(DEFAULT_USER_EMAIL, receivedMessage.to);
        assertEquals(UserNotificationService.SUBJECT_PROJECT_REJECTED, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("Dein Projekt wurde leider abgelehnt."));
    }

    @Then("^an email notification about the published project is sent to the user$")
    public void an_email_notification_about_the_published_project_is_sent_to_the_user() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();
        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertEquals(DEFAULT_USER_EMAIL, receivedMessage.to);
        assertEquals(UserNotificationService.SUBJECT_PROJECT_PUBLISHED, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("Dein Projekt wurde erfolgreich freigegeben!"));
    }

    @Then("^an email notification about the deferred project is sent to the user$")
    public void an_email_notification_about_the_deferred_project_is_sent_to_the_user() throws Throwable {

        final MailServerClient.Message receivedMessage = grabMessage();
        assertEquals(UserNotificationService.FROM_ADDRESS, receivedMessage.from);
        assertEquals(DEFAULT_USER_EMAIL, receivedMessage.to);
        assertEquals(UserNotificationService.SUBJECT_PROJECT_DEFERRED, receivedMessage.subject);
        assertThat(receivedMessage.message, containsString("Dein Projekt wurde leider zurückgestellt"));
    }

    @Then("^an email notification about that comment is sent to the project creator$")
    public void an_Email_Notification_About_That_Comment_Is_Sent_To_The_Project_Creator() throws Throwable {
        final MailServerClient.Message receivedMessage = grabMessage();
        
        assertThat(receivedMessage.from, is(UserNotificationService.FROM_ADDRESS) );
        assertThat(receivedMessage.to, is(DEFAULT_USER_EMAIL));
        assertThat(receivedMessage.subject, is(UserNotificationService.SUBJECT_PROJECT_COMMENTED));
        assertThat(receivedMessage.message, containsString(TEST_COMMENT));
        assertThat(receivedMessage.message, containsString("zu Deinem Projekt \"" + createdProject.getTitle() + "\" wurde ein Kommentar von"));
    }

    @And("^the sent mail is cleared$")
    public void the_sent_mail_is_cleared() throws Throwable {
        grabMessage();
        mailServerClient.clearMails();
    }

    private MailServerClient.Message grabMessage() {

        mailServerClient.waitForMails(1, 5000);
        final List<MailServerClient.Message> messages = mailServerClient.messages();
        assertEquals(1, messages.size());

        return messages.get(0);
    }
}
