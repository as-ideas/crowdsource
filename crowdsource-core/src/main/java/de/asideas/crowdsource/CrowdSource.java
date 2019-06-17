package de.asideas.crowdsource;

import de.asideas.crowdsource.config.MongoDBConfig;
import de.asideas.crowdsource.config.SchedulerConfig;
import de.asideas.crowdsource.config.SecurityConfig;
import de.asideas.crowdsource.config.mail.MailSenderConfig;
import de.asideas.crowdsource.config.mail.MailTemplateConfig;

import de.asideas.crowdsource.security.awssecretsmanager.AWSCrowdSecretsManagerCredentials;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import java.util.ArrayList;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

@Configuration
@Import({ThymeleafAutoConfiguration.class, MongoDBConfig.class, SecurityConfig.class, MailSenderConfig.class, MailTemplateConfig.class, SchedulerConfig.class})
@ComponentScan(basePackages = "de.asideas.crowdsource", excludeFilters = @ComponentScan.Filter(Configuration.class))
@PropertySources({
    @PropertySource(value = "build.properties", ignoreResourceNotFound = true),
    @PropertySource(value = "build.core.properties", ignoreResourceNotFound = true)
})
@EnableConfigurationProperties(AWSCrowdSecretsManagerCredentials.class)
public class CrowdSource extends WebMvcConfigurerAdapter {

    private static final Logger log = getLogger(CrowdSource.class);

    @Autowired(required = false)
    private List<HandlerInterceptorAdapter> handlerInterceptorAdapters = new ArrayList<>();

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        log.info("Init Interceptors");
        handlerInterceptorAdapters.forEach(registry::addInterceptor);
        super.addInterceptors(registry);
    }

    // Pulled out of Security config in order to prevent spring circular dependency issue
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
