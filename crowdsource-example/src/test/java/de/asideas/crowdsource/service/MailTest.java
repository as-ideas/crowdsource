package de.asideas.crowdsource.service;

import de.asideas.crowdsource.config.mail.MailTemplateConfig;
import de.asideas.crowdsource.domain.model.CommentEntity;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.arrayContaining;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.isA;
import static org.mockito.Mockito.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {MailTemplateConfig.class, MailTest.Config.class})
@SuppressWarnings("Duplicates")
public class MailTest {

    private static final String ADMIN_EMAIL = "some.admin@email.com";

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private AsyncTaskExecutor taskExecutorSmtp;

    @Autowired
    private UserRepository userRepository;

    @Before
    public void setUp() {
        ReflectionTestUtils.setField(userNotificationService, "applicationUrl", "https://crowd.asideas.de");

        reset(javaMailSender, taskExecutorSmtp);

        // Emulate async execution synchronously to immediately be able to verify invocations of javaMailSender
        doAnswer(invocation -> {
            final Runnable runnable = (Runnable) invocation.getArguments()[0];
            runnable.run();
            return null;
        }).when(taskExecutorSmtp).submit(isA(Runnable.class));
    }

    @Test
    public void testSendActivationMail() {
        UserEntity user = aProjectCreator();
        user.setActivationToken("activationTok3n");

        userNotificationService.sendActivationMail(user);

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(user.getEmail()));
        assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_ACTIVATION));
        assertThat(replaceLineBreaksIfWindows(mail.getText()), is(
                "Hallo firstname lastname,\n\n" +
                        "Du hast Dich gerade auf der CrowdSource Platform angemeldet.\n" +
                        "Um Deine Registrierung abzuschließen, öffne bitte diesen Link und setze Dein Passwort:\n\n" +
                        "https://crowd.asideas.de#/signup/some.creator@email.com/activation/activationTok3n\n\n" +
                        "Mit freundlichen Grüßen\nDein CrowdSource Team"));
    }

    @Test
    public void testSendPasswordRecoveryMail() {
        UserEntity user = aProjectCreator();
        user.setActivationToken("activationTok3n");

        userNotificationService.sendPasswordRecoveryMail(user);

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(user.getEmail()));
        assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_PASSWORD_FORGOTTEN));
        assertThat(replaceLineBreaksIfWindows(mail.getText()), is(
                "Hallo firstname lastname,\n\n" +
                        "Du hast soeben ein neues Passwort für Dein Konto bei der CrowdSource Plattform angefordert.\n\n" +
                        "Bitte öffne diesen Link:\n\n" +
                        "https://crowd.asideas.de#/login/password-recovery/some.creator@email.com/activation/activationTok3n\n\n" +
                        "und setze Dein neues Passwort.\n\n" +
                        "Mit freundlichen Grüßen\n" +
                        "Dein CrowdSource Team"));
    }

    @Test
    public void testSendUserNotificationMailForPublished() {
        UserEntity user = aProjectCreator();

        userNotificationService.notifyCreatorOnProjectStatusUpdate(project(123L, ProjectStatus.PUBLISHED, user, "My Super Project"));

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(user.getEmail()));
        assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_PROJECT_PUBLISHED));
        assertThat(replaceLineBreaksIfWindows(mail.getText()), is(
                "Hallo firstname lastname,\n\n" +
                        "Dein Projekt wurde erfolgreich freigegeben!\n" +
                        "Weitere Informationen hinsichtlich des Prozesses kannst Du der FAQ entnehmen.\n\n" +
                        "Zu Deinem Projekt:\n\n" +
                        "https://crowd.asideas.de#/project/123\n\n" +
                        "Mit freundlichen Grüßen\n" +
                        "Dein CrowdSource Team"));
    }

    @Test
    public void testSendUserNotificationMailForRejected() {
        UserEntity user = aProjectCreator();

        userNotificationService.notifyCreatorOnProjectStatusUpdate(project(123L, ProjectStatus.REJECTED, user, "My Super Project"));

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(user.getEmail()));
        assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_PROJECT_REJECTED));
        assertThat(replaceLineBreaksIfWindows(mail.getText()), is(
                "Hallo firstname lastname,\n\n" +
                        "Dein Projekt wurde leider abgelehnt.\n" +
                        "Das CrowdSource Team wird in Kürze mit Dir in Kontakt treten, um die nächsten Schritte zu besprechen.\n\n" +
                        "Zu Deinem Projekt:\n\n" +
                        "https://crowd.asideas.de#/project/123\n\n" +
                        "Mit freundlichen Grüßen\nDein CrowdSource Team"));
    }

    @Test
    public void testSendUserNotificationMailForFallback() {
        UserEntity user = aProjectCreator();

        userNotificationService.notifyCreatorOnProjectStatusUpdate(project(123L, ProjectStatus.PROPOSED, user, "My Super Project"));

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(user.getEmail()));
        assertThat(mail.getSubject(), is("Der Zustand des Projekts My Super Project hat sich geändert!"));
        assertThat(mail.getText(), is("Das Projekt My Super Project wurde in den Zustand PROPOSED versetzt."));
    }

    @Test
    public void testNotifyAdminOnProjectCreation() {
        UserEntity user = aProjectCreator();

        userNotificationService.notifyAdminOnProjectCreation(project(123L, ProjectStatus.PUBLISHED, user, "My Super Project"), ADMIN_EMAIL);

        SimpleMailMessage mail = getMessageFromMailSender();
        assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(mail.getTo(), arrayContaining(ADMIN_EMAIL));
        assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_PROJECT_CREATED));
        assertThat(replaceLineBreaksIfWindows(mail.getText()), is(
                "Hallo Admin,\n\n" +
                        "es liegt ein neues Projekt zur Freigabe vor:\n\n" +
                        "https://crowd.asideas.de#/project/123\n\n" +
                        "Mit freundlichen Grüßen\n" +
                        "Dein CrowdSource Team"));
    }

    @Test
    public void notifyCreatorAndAdminOnProjectModification() {
        final UserEntity creator = aProjectCreator();
        final UserEntity modifier = aUser(123L);
        final UserEntity admin = aUser(1223L, "admin.0@email.com");
        final List<UserEntity> admins = Arrays.asList(admin);
        final ProjectEntity project = project(123L, ProjectStatus.PUBLISHED, creator, "My Super Project");

        when(userRepository.findAllAdminUsers()).thenReturn(admins);
        userNotificationService.notifyCreatorAndAdminOnProjectModification(project, modifier);

        final List<SimpleMailMessage> capturedMessages = getMessagesFromMailSender();
        assertThat(capturedMessages.size(), is(3));
        assertCreatorModifierAndAdminNotifiedOfProjectEdit(creator, modifier, admin, capturedMessages);

        capturedMessages.stream().forEach(mail -> {
            assertThat(mail.getFrom(), is(UserNotificationService.FROM_ADDRESS));
            assertThat(mail.getSubject(), is(UserNotificationService.SUBJECT_PROJECT_MODIFIED));
        });

    }

    @Test
    public void notifyCreatorOnComment_mailShouldContainAbridgedCommentAndItsCreatorName() {
        final UserEntity creator = aProjectCreator();
        final UserEntity commentingUser = aUser(123L);
        final ProjectEntity project = project(123L, ProjectStatus.PUBLISHED, creator, "My Super Project");
        final String projectLink = "https://crowd.asideas.de#/project/123";
        final String testComment = aTestComment(UserNotificationService.COMMENT_EXCERPT_LENGTH + 5);
        final CommentEntity comment = new CommentEntity(project, testComment, commentingUser);

        userNotificationService.notifyCreatorOnComment(comment);

        assertCommentMessage(comment, projectLink, getMessageFromMailSender());
    }

    private void assertCommentMessage(CommentEntity comment, String projectLink, SimpleMailMessage actualMessage) {
        final String expectedMessage = "Hallo %s,\n\n" +
                "zu Deinem Projekt \"%s\" wurde ein Kommentar von %s hinzugefügt:\n\n" +
                "\"%s\"\n\n" +
                "Zu Deinem Projekt:\n\n%s\n\n" +
                "Mit freundlichen Grüßen\n" +
                "Dein CrowdSource Team";

        assertThat(actualMessage.getText(), is(String.format(expectedMessage,
                comment.getProject().getCreator().getName(), comment.getProject().getTitle(), comment.getCreator().getName(),
                comment.getComment().substring(0, UserNotificationService.COMMENT_EXCERPT_LENGTH) + " ...", projectLink)));

        assertThat(actualMessage.getFrom(), is(UserNotificationService.FROM_ADDRESS));
        assertThat(actualMessage.getSubject(), is(UserNotificationService.SUBJECT_PROJECT_COMMENTED));
    }

    private UserEntity aProjectCreator() {
        return aUser(123L, "some.creator@email.com");
    }

    private UserEntity aUser(Long userId) {
        final UserEntity res = new UserEntity("some.one@email.com", "firstname", "lastname");
        res.setId(userId);
        return res;
    }

    private UserEntity aUser(Long userId, String email) {
        final UserEntity res = new UserEntity(email, "firstname", "lastname");
        res.setId(userId);
        return res;
    }

    private void assertCreatorModifierAndAdminNotifiedOfProjectEdit(UserEntity creator, UserEntity modifier, UserEntity admin, List<SimpleMailMessage> capturedMessages) {
        final String projectLink = "https://crowd.asideas.de#/project/123";
        final String expMessage = "Hallo %s,\n\n" +
                "das folgende Projekt wurde von %s editiert.\n" +
                "Weitere Informationen hinsichtlich des Prozesses kannst Du der FAQ entnehmen.\n\n" +
                "Zum Projekt:\n\n%s\n\n" +
                "Mit freundlichen Grüßen\nDein CrowdSource Team";

        final SimpleMailMessage creatorMail = capturedMessages.stream().filter(m -> m.getTo()[0].equals(creator.getEmail())).findFirst().get();
        final SimpleMailMessage modifierMail = capturedMessages.stream().filter(m -> m.getTo()[0].equals(modifier.getEmail())).findFirst().get();
        final SimpleMailMessage adminMail = capturedMessages.stream().filter(m -> m.getTo()[0].equals(admin.getEmail())).findFirst().get();

        assertThat(creatorMail.getText(), is(String.format(expMessage, creator.getName(), modifier.getName(), projectLink)));
        assertThat(modifierMail.getText(), is(String.format(expMessage, modifier.getName(), modifier.getName(), projectLink)));
        assertThat(adminMail.getText(), is(String.format(expMessage, admin.getName(), modifier.getName(), projectLink)));
    }

    private SimpleMailMessage getMessageFromMailSender() {
        final List<SimpleMailMessage> messagesFromMailSender = getMessagesFromMailSender();
        if (messagesFromMailSender.isEmpty()) {
            return null;
        }
        return messagesFromMailSender.get(messagesFromMailSender.size() - 1);
    }

    private List<SimpleMailMessage> getMessagesFromMailSender() {
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, atLeastOnce()).send(messageCaptor.capture());

        return messageCaptor.getAllValues();
    }

    private ProjectEntity project(Long id, ProjectStatus status, UserEntity user, String title) {
        final ProjectEntity project = new ProjectEntity();
        project.setId(id);
        project.setCreator(user);
        project.setTitle(title);
        project.setStatus(status);
        return project;
    }

    private String replaceLineBreaksIfWindows(String message) {

        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            return message.replace("\r\n", "\n");
        }
        return message;
    }

    private String aTestComment(int length){
        StringBuilder res = new StringBuilder();
        IntStream.range(0, length).forEach(i-> res.append(i % 10));
        return res.toString();
    }

    @Configuration
    static class Config {

        @Bean
        public UserNotificationService userNotificationService() {
            return new UserNotificationService();
        }

        @Bean
        public JavaMailSender javaMailSender() {
            return mock(JavaMailSender.class);
        }

        @Bean
        public AsyncTaskExecutor taskExecutorSmtp() {
            return mock(AsyncTaskExecutor.class);
        }

        @Bean
        public UserRepository userRepository() {
            return mock(UserRepository.class);
        }

    }
}
