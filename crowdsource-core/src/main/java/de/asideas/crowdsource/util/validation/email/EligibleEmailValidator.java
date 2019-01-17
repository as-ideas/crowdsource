package de.asideas.crowdsource.util.validation.email;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Validator for {@link de.asideas.crowdsource.util.validation.email.EligibleEmail}
 */
@Service
public class EligibleEmailValidator implements ConstraintValidator<EligibleEmail, String> {

    private List<String> allowedEmailDomains;

    @Value("${de.asideas.crowdsource.allowedDomains.file}")
    private String emailWhitelistFilename;

    @Value("#{'${de.asideas.crowdsource.content.email.blacklist.patterns}'.split(',')}")
    private List<String> emailBlacklistPatterns;

    @Override
    public void initialize(EligibleEmail constraintAnnotation) {
        // no-op
    }


    @PostConstruct
    void readAllowedEmailAddressList() throws IOException {
        if (emailWhitelistFilename == null) {
            return;
        }
        allowedEmailDomains = IOUtils.readLines(new ClassPathResource(emailWhitelistFilename).getInputStream()).stream()
            .filter(el -> el != null && el.length() > 0).collect(Collectors.toList());
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        email = email.toLowerCase();
        final String extractedDomain = extractDomain(email);

        if (extractedDomain != null && extractedDomainIsEligible(extractedDomain) && doesNotMatchBlacklistPatterns(email)) {
            return true;
        }

        context.buildConstraintViolationWithTemplate("eligible").addConstraintViolation();
        return false;
    }

    private boolean extractedDomainIsEligible(String extractedDomain) {
        if (allowedEmailDomains != null && allowedEmailDomains.isEmpty()) {
            return true;
        }
        return allowedEmailDomains.contains(extractedDomain);
    }

    private String extractDomain(String email) {
        if (!email.contains("@") && email.lastIndexOf("@") == email.length() - 1) {
            return null;
        }
        return email.substring(email.indexOf("@") + 1);
    }

    private boolean doesNotMatchBlacklistPatterns(String email) {
        for (String emailBlacklistPattern : emailBlacklistPatterns) {
            if (email.contains(emailBlacklistPattern)) {
                return false;
            }
        }
        return true;
    }
}
