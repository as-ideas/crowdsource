package de.asideas.crowdsource.domain.service.user;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.MessageFormat;
import java.util.*;
import java.util.stream.Collectors;

@SuppressWarnings("Duplicates")
@Service
public class UserNotificationService {

    public static final Integer COMMENT_EXCERPT_LENGTH = 160;
    public static final String FROM_ADDRESS = "noreply@crowd.asideas.de";

    public static final String PROJECT_LINK_PATTERN = "/project/{id}";
    public static final String ACTIVATION_LINK_PATTERN = "/signup/{emailAddress}/activation/{activationToken}";
    public static final String PASSWORD_RECOVERY_LINK_PATTERN = "/login/password-recovery/{emailAddress}/activation/{activationToken}";
    public static final String IDEA_CAMPAIGN_LINK_PATTERN = "/ideas/{campaign}";
    public static final String IDEA_CAMPAIGN_LINK_ADMIN_PATTERN = "/ideas/{campaign}/admin";
    public static final String IDEA_CAMPAIGN_YOUR_IDEAS_LINK_PATTERN = "/ideas/{campaign}/own";

    public static final String SUBJECT_ACTIVATION = "Please set a password for your account on AS.Crowd // Bitte vergib ein Passwort für Dein Konto auf AS.Crowd";
    public static final String SUBJECT_PASSWORD_FORGOTTEN = "Please set a password for your account on AS.Crowd // Bitte vergib ein Passwort für Dein Konto auf AS.Crowd";
    public static final String SUBJECT_IDEA_CREATED = "A new idea for campaign \"{0}\" has been submitted // Neue Idee wurde für die Kampagne \"{0}\" eingereicht";
    public static final String SUBJECT_IDEA_ACCEPTED = "Your idea \"{0}\" for campaign \"{1}\" has been accepted // Deine Idee \"{0}\" für die Kampagne \"{1}\" wurde freigegeben";
    public static final String SUBJECT_IDEA_REJECTED = "Your idea \"{0}\" for campaign \"{1}\" has been rejected // Deine Idee \"{0}\" für die Kampagne \"{1}\" wurde leider abgelehnt";
    public static final String SUBJECT_PROJECT_MODIFIED = "Ein Projekt wurde editiert";
    public static final String SUBJECT_PROJECT_CREATED = "Neues Projekt erstellt";
    public static final String SUBJECT_PROJECT_PUBLISHED = "Freigabe Deines Projektes";
    public static final String SUBJECT_PROJECT_REJECTED = "Freigabe Deines Projektes";
    public static final String SUBJECT_PROJECT_DEFERRED = "Dein Projekt setzt in der nächsten Finanzierungsrunde aus.";
    public static final String SUBJECT_PROJECT_COMMENTED = "Ein neuer Kommentar in Deinem Projekt";

    private static final Logger LOG = LoggerFactory.getLogger(UserNotificationService.class);

    @Value("${de.asideas.crowdsource.mail.subjectprefix:}")
    private String subjectPrefix;

    @Value("${de.asideas.crowdsource.baseUrl:http://localhost:8080}")
    private String applicationUrl;

    @Autowired
    private Expression activationEmailTemplate;

    @Autowired
    private Expression newProjectEmailTemplate;

    @Autowired
    private Expression ideaCreatedEmailTemplate;

    @Autowired
    private Expression ideaAcceptedEmailTemplate;

    @Autowired
    private Expression ideaRejectedEmailTemplate;

    @Autowired
    private Expression passwordForgottenEmailTemplate;

    @Autowired
    private Expression projectPublishedEmailTemplate;

    @Autowired
    private Expression projectRejectedEmailTemplate;

    @Autowired
    private Expression projectDeferredEmailTemplate;

    @Autowired
    private Expression projectModifiedEmailTemplate;

    @Autowired
    private Expression projectCommentedEmailTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AsyncTaskExecutor taskExecutorSmtp;

    public void sendActivationMail(UserEntity user) {

        String activationLink = buildLink(ACTIVATION_LINK_PATTERN, user.getEmail(), user.getActivationToken());
        LOG.debug("Sending activation link {} to {}", activationLink, user.getEmail());

        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("link", activationLink);
        context.setVariable("firstName", user.getFirstName());
        final String mailContent = activationEmailTemplate.getValue(context, String.class);

        sendMail(user.getEmail(), SUBJECT_ACTIVATION, mailContent);
    }

    public void sendPasswordRecoveryMail(UserEntity user) {

        String passwordRecoveryLink = buildLink(PASSWORD_RECOVERY_LINK_PATTERN, user.getEmail(), user.getActivationToken());
        LOG.debug("Sending password recovery link {} to {}", passwordRecoveryLink, user.getEmail());

        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("link", passwordRecoveryLink);
        context.setVariable("firstName", user.getFirstName());
        final String mailContent = passwordForgottenEmailTemplate.getValue(context, String.class);

        sendMail(user.getEmail(), SUBJECT_PASSWORD_FORGOTTEN, mailContent);
    }

    public void notifyCreatorOnProjectStatusUpdate(ProjectEntity project) {

        final StandardEvaluationContext context = new StandardEvaluationContext();
        final String projectLink = buildProjectLink(project.getId());

        context.setVariable("link", projectLink);
        context.setVariable("userName", project.getCreator().getFullName());

        switch (project.getStatus()) {
            case PUBLISHED:
                final String publishMessage = projectPublishedEmailTemplate.getValue(context, String.class);
                sendMail(project.getCreator().getEmail(), SUBJECT_PROJECT_PUBLISHED, publishMessage);
                break;

            case REJECTED:
                final String rejectedMessage = projectRejectedEmailTemplate.getValue(context, String.class);
                sendMail(project.getCreator().getEmail(), SUBJECT_PROJECT_REJECTED, rejectedMessage);
                break;

            case DEFERRED:
            case PUBLISHED_DEFERRED:
                final String deferringMessage = projectDeferredEmailTemplate.getValue(context, String.class);
                sendMail(project.getCreator().getEmail(), SUBJECT_PROJECT_DEFERRED, deferringMessage);
                break;

            default:
                final String defaultMessage = "Das Projekt " + project.getTitle() + " wurde in den Zustand " + project.getStatus().name() + " versetzt.";
                final String defaultSubject = "Der Zustand des Projekts " + project.getTitle() + " hat sich geändert!";
                sendMail(project.getCreator().getEmail(), defaultSubject, defaultMessage);
                break;
        }
    }

    public void notifyCreatorOnComment(CommentEntity comment) {
        ProjectEntity project = comment.getProject();
        if (comment.getUser().equals(project.getCreator())) {
            return;
        }

        final String projectLink = buildProjectLink(project.getId());
        UserEntity recipient = project.getCreator();

        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("recipientName", recipient.getFullName());
        context.setVariable("projectName", project.getTitle());
        context.setVariable("commentingUser", comment.getUser().getFullName());
        context.setVariable("commentExcerpt", commentExcerpt(comment));
        context.setVariable("link", projectLink);
        final String mailContent = projectCommentedEmailTemplate.getValue(context, String.class);

        final SimpleMailMessage message = newMailMessage(recipient.getEmail(), SUBJECT_PROJECT_COMMENTED, mailContent);
        sendMails(Collections.singleton(message));

    }

    public void notifyCreatorOnIdeaAccepted(IdeaEntity idea, String campaignTitle) {
        StandardEvaluationContext context = new StandardEvaluationContext();

        context.setVariable("firstName", idea.getCreator().getFirstName());
        context.setVariable("link", buildIdeasCampaignLink(idea.getCampaignId()));
        context.setVariable("ideaTitle", idea.getOriginalTitle());
        context.setVariable("campaignTitle", campaignTitle);

        final String[] args = {idea.getOriginalTitle(), campaignTitle};
        final String mailSubject = MessageFormat.format(SUBJECT_IDEA_ACCEPTED, args);
        final String mailContent = ideaAcceptedEmailTemplate.getValue(context, String.class);
        final SimpleMailMessage message = newMailMessage(idea.getCreator().getEmail(), mailSubject, mailContent);

        sendMails(Collections.singleton(message));
    }

    public void notifyCreatorOnIdeaRejected(IdeaEntity idea, String rejectionComment, String campaignTitle) {
        Assert.hasText(rejectionComment, "rejection-comment must not be empty!");
        StandardEvaluationContext context = new StandardEvaluationContext();

        context.setVariable("firstName", idea.getCreator().getFirstName());
        context.setVariable("rejectionComment", rejectionComment);
        context.setVariable("link", buildYourIdeasCampaignLink(idea.getCampaignId()));
        context.setVariable("ideaTitle", idea.getOriginalTitle());
        context.setVariable("campaignTitle", campaignTitle);

        final String[] args = {idea.getOriginalTitle(), campaignTitle};
        final String mailSubject = MessageFormat.format(SUBJECT_IDEA_REJECTED, args);
        final String mailContent = ideaRejectedEmailTemplate.getValue(context, String.class);
        final SimpleMailMessage message = newMailMessage(idea.getCreator().getEmail(), mailSubject, mailContent);

        sendMails(Collections.singleton(message));
    }

    public void notifyCreatorAndAdminOnProjectModification(ProjectEntity project, UserEntity modifier) {

        final String projectLink = buildProjectLink(project.getId());
        final Set<UserEntity> users2Notify = new HashSet<>(userRepository.findAllAdminUsers());
        users2Notify.add(modifier);
        users2Notify.add(project.getCreator());

        final List<SimpleMailMessage> mails = users2Notify.stream().map(recipient -> {

            StandardEvaluationContext context = new StandardEvaluationContext();
            context.setVariable("link", projectLink);
            context.setVariable("recipientName", recipient.getFullName());
            context.setVariable("modifierName", modifier.getFullName());

            final String mailContent = projectModifiedEmailTemplate.getValue(context, String.class);

            return newMailMessage(recipient.getEmail(), SUBJECT_PROJECT_MODIFIED, mailContent);
        }).collect(Collectors.toList());

        sendMails(mails);
    }

    public void notifyAdminOnProjectCreation(ProjectEntity project, String emailAddress) {

        final String projectLink = buildProjectLink(project.getId());

        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("link", projectLink);

        final String mailContent = newProjectEmailTemplate.getValue(context, String.class);
        sendMail(emailAddress, SUBJECT_PROJECT_CREATED, mailContent);
    }

    public void notifyAdminOnIdeaCreation(IdeaEntity idea, String emailAddress, String campaignTitle) {

        StandardEvaluationContext context = new StandardEvaluationContext();

        context.setVariable("fullName", idea.getCreator().getFullName());
        context.setVariable("ideaTitle", idea.getOriginalTitle());
        context.setVariable("ideaPitch", idea.getOriginalPitch());
        context.setVariable("link", buildIdeasCampaignAdminLink(idea.getCampaignId()));
        context.setVariable("campaignTitle", campaignTitle);

        final String mailSubject = MessageFormat.format(SUBJECT_IDEA_CREATED, campaignTitle);
        final String mailContent = ideaCreatedEmailTemplate.getValue(context, String.class);

        sendMail(emailAddress, mailSubject, mailContent);
    }

    private String buildProjectLink(String projectId) {

        UriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromUriString(getApplicationUrl());
        uriBuilder.fragment(PROJECT_LINK_PATTERN);

        return uriBuilder.buildAndExpand(projectId).toUriString();
    }

    private String buildIdeasCampaignLink(String campaignId) {

        UriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromUriString(getApplicationUrl());
        uriBuilder.fragment(IDEA_CAMPAIGN_LINK_PATTERN);

        return uriBuilder.buildAndExpand(campaignId).toUriString();
    }

    private String buildIdeasCampaignAdminLink(String campaignId) {

        UriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromUriString(getApplicationUrl());
        uriBuilder.fragment(IDEA_CAMPAIGN_LINK_ADMIN_PATTERN);

        return uriBuilder.buildAndExpand(campaignId).toUriString();
    }

    private String buildYourIdeasCampaignLink(String campaignId) {

        UriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromUriString(getApplicationUrl());
        uriBuilder.fragment(IDEA_CAMPAIGN_YOUR_IDEAS_LINK_PATTERN);

        return uriBuilder.buildAndExpand(campaignId).toUriString();
    }

    private String buildLink(String urlPattern, String emailAddress, String activationToken) {

        UriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromUriString(getApplicationUrl());
        uriBuilder.fragment(urlPattern);

        return uriBuilder.buildAndExpand(emailAddress, activationToken).toUriString();
    }

    private String commentExcerpt(CommentEntity comment) {
        final String commentString = comment.getComment();
        if (commentString.length() <= COMMENT_EXCERPT_LENGTH) {
            return commentString;
        }
        return commentString.substring(0, COMMENT_EXCERPT_LENGTH) + " ...";
    }

    private String getApplicationUrl() {

        // The "/" is for the one before # http://server.com:port/#/. It would be nicer to add it dynamically where the # is added. Did not find it though.
        return applicationUrl + "/";
    }

    private String addPrefixToSubjectLine(String subject) {
        return ("".equals(subjectPrefix) ? "" : "[" + subjectPrefix + "] ") + subject;
    }

    private void sendMail(String email, String subject, String messageText) {

        final SimpleMailMessage mailMessage = newMailMessage(email, subject, messageText);

        taskExecutorSmtp.submit(() -> {
            try {
                LOG.info("Sending mail with subject: " + mailMessage.getSubject());
                mailSender.send(mailMessage);
            } catch (Exception e) {
                LOG.error("Error on E-Mail Send. Message was: " + mailMessage, e);
            }
        });
    }

    private void sendMails(final Collection<SimpleMailMessage> messages) {
        taskExecutorSmtp.submit(() -> {
            for (SimpleMailMessage message : messages) {
                try {
                    LOG.info("Sending mail with subject: " + message.getSubject());
                    mailSender.send(message);
                } catch (Exception e) {
                    LOG.error("Error on E-Mail Send. Message was: " + message, e);
                }
            }
        });
    }

    private SimpleMailMessage newMailMessage(String recipientEmail, String subject, String messageText) {
        final SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setFrom(FROM_ADDRESS);
        mailMessage.setSubject(addPrefixToSubjectLine(subject));
        mailMessage.setText(messageText);
        return mailMessage;
    }
}
