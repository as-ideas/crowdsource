package de.asideas.crowdsource.config.mail;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.expression.Expression;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class MailTemplateConfigTest {

    @InjectMocks
    private MailTemplateConfig mailTemplateConfig;

    @Test
    public void toDefaultTemplatePath() throws Exception {
        String defaultTemplatePath = mailTemplateConfig.toDefaultTemplatePath("sometemplate.template");
        assertThat(defaultTemplatePath, is(equalTo("sometemplate.template.default")));
    }

    @Test
    public void activationEmailTemplate() {
        Expression expression = mailTemplateConfig.activationEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void newProjectEmailTemplate() {
        Expression expression = mailTemplateConfig.newProjectEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void ideaCreatedEmailTemplate() {
        Expression expression = mailTemplateConfig.ideaCreatedEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void passwordForgottenEmailTemplate() {
        Expression expression = mailTemplateConfig.passwordForgottenEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void projectPublishedEmailTemplate() {
        Expression expression = mailTemplateConfig.projectPublishedEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void projectRejectedEmailTemplate() {
        Expression expression = mailTemplateConfig.projectRejectedEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void projectDeferredEmailTemplate() {
        Expression expression = mailTemplateConfig.projectDeferredEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void projectModifiedEmailTemplate() {
        Expression expression = mailTemplateConfig.projectModifiedEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }

    @Test
    public void projectCommentedEmailTemplate() {
        Expression expression = mailTemplateConfig.projectCommentedEmailTemplate();
        assertThat(expression, is(not(nullValue())));
    }
}