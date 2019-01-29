package de.asideas.crowdsource.config.mail;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.Expression;
import org.springframework.expression.ParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class MailTemplateConfig {

    private static final Logger LOG = LoggerFactory.getLogger(MailTemplateConfig.class);

    private final SpelExpressionParser parser = new SpelExpressionParser();

    @Bean
    public Expression activationEmailTemplate() {
        return createExpressionFromFile("/email/activation.template");
    }

    @Bean
    public Expression newProjectEmailTemplate() {
        return createExpressionFromFile("/email/new-project.template");
    }

    @Bean
    public Expression ideaCreatedEmailTemplate() {
        return createExpressionFromFile("/email/new-idea.template");
    }

    @Bean
    public Expression ideaAcceptedEmailTemplate() {
        return createExpressionFromFile("/email/idea-accepted.template");
    }

    @Bean
    public Expression ideaRejectedEmailTemplate() {
        return createExpressionFromFile("/email/idea-rejected.template");
    }

    @Bean
    public Expression passwordForgottenEmailTemplate() {
        return createExpressionFromFile("/email/password-forgotten.template");
    }

    @Bean
    public Expression projectPublishedEmailTemplate() {
        return createExpressionFromFile("/email/project-published.template");
    }

    @Bean
    public Expression projectRejectedEmailTemplate() {
        return createExpressionFromFile("/email/project-rejected.template");
    }

    @Bean
    public Expression projectDeferredEmailTemplate() {
        return createExpressionFromFile("/email/project-deferred.template");
    }

    @Bean
    public Expression projectModifiedEmailTemplate() {
        return createExpressionFromFile("/email/project-modified.template");
    }

    @Bean
    public Expression projectCommentedEmailTemplate() {
        return createExpressionFromFile("/email/project-commented.template");
    }

    public String toDefaultTemplatePath(String templatePath) {
        return templatePath + ".default";
    }

    private Expression createExpressionFromFile(final String templatePath) {
        try {
            final InputStream resourceAsStream = getInputStreamForTemplateOrDefaultTemplate(templatePath);
            final String fileContent = IOUtils.toString(resourceAsStream, "UTF-8");

            return parser.parseExpression(fileContent, ParserContext.TEMPLATE_EXPRESSION);

        } catch (IOException e) {
            throw new ResourceNotFoundException();
        }
    }

    private InputStream getInputStreamForTemplateOrDefaultTemplate(String templatePath) {
        InputStream resourceAsStream = getClass().getResourceAsStream(templatePath);
        if (resourceAsStream == null) {
            LOG.warn("No template found, using default template for: " + templatePath);
            resourceAsStream = getClass().getResourceAsStream(toDefaultTemplatePath(templatePath));
        }
        return resourceAsStream;
    }
}
