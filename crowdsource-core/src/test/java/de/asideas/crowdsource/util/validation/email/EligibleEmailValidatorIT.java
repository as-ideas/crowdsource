package de.asideas.crowdsource.util.validation.email;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.boot.test.context.ConfigFileApplicationContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RunWith(SpringRunner.class)
@TestPropertySource("classpath:application-test.properties")
@ContextConfiguration(classes = EligibleEmailValidatorIT.TestConfig.class)
public class EligibleEmailValidatorIT {

    @Autowired
    private EligibleEmailValidator eligibleEmailValidator;

    @Test
    public void shouldHaveLoadedAllowedEmailDomains() {
        final List<String> actualResult = (List) ReflectionTestUtils.getField(
            eligibleEmailValidator, EligibleEmailValidator.class, "allowedEmailDomains");

        assertThat(actualResult.size(), equalTo(10));
    }

    @Import(EligibleEmailValidator.class)
    public static class TestConfig {}

}
