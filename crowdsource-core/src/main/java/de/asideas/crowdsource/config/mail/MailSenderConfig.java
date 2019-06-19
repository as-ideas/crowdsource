package de.asideas.crowdsource.config.mail;

import de.asideas.crowdsource.security.awssecretsmanager.CrowdAWSSecretsManager;
import de.asideas.crowdsource.service.translation.TranslationService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.Properties;

import static org.slf4j.LoggerFactory.getLogger;

@Configuration
public class MailSenderConfig {

    private static final Logger log = getLogger(MailSenderConfig.class);

    @Value("${de.asideas.crowdsource.mail.host:localhost}")
    private String host;

    @Value("${de.asideas.crowdsource.mail.port:1025}")
    private Integer port;

    @Value("${de.asideas.crowdsource.mail.starttls:false}")
    private boolean useStartTls;

    @Value("${de.asideas.crowdsource.mail.connectionTimeout:3000}")
    private int smtpConnectionTimeout;

    @Value("${de.asideas.crowdsource.mail.readTimeout:5000}")
    private int smtpReadTimeout;

    @Value("${taskExecutor.email.corePoolsize:10}")
    private int corePoolsize;

    @Value("${taskExecutor.email.maxPoolsize:30}")
    private int maxPoolsize;

    @Value("${taskExecutor.email.queueCapacity:50}")
    private int queueCapacity;

    @Value("${taskExecutor.email.keepAliveSeconds:60}")
    private int keepAliveSeconds;

    @Autowired
    private CrowdAWSSecretsManager crowdAWSSecretsManager;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setDefaultEncoding("UTF-8");
        javaMailSender.setHost(host);
        javaMailSender.setPort(port);

        Properties properties = new Properties();
        properties.setProperty("mail.smtp.starttls.enable", Boolean.toString(useStartTls));
        properties.setProperty("mail.smtp.connectiontimeout", Integer.toString(smtpConnectionTimeout));
        properties.setProperty("mail.smtp.timeout", Integer.toString(smtpReadTimeout));

        try {
            final String username = crowdAWSSecretsManager.getMailGunUser();
            final String password = crowdAWSSecretsManager.getMailGunPassword();

            properties.setProperty("mail.smtp.auth", "true");

            javaMailSender.setUsername(username);
            javaMailSender.setPassword(password);
        } catch (Exception e) {
            log.error("An error occurred while reading the Mailgun credentials from secret-manager.");
        }

        javaMailSender.setJavaMailProperties(properties);

        return javaMailSender;
    }

    @Bean
    public AsyncTaskExecutor taskExecutorSmtp(){
        ThreadPoolTaskExecutor res = new ThreadPoolTaskExecutor();
        res.setCorePoolSize(corePoolsize);
        res.setMaxPoolSize(maxPoolsize);
        res.setQueueCapacity(queueCapacity);
        res.setKeepAliveSeconds(keepAliveSeconds);
        res.setThreadNamePrefix("crowd-smtp-");
        return res;
    }
}
