package de.asideas.crowdsource.util.validation.email;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * Validator for {@link NotActivated}
 */
@Service
public class NotActivatedValidator implements ConstraintValidator<NotActivated, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void initialize(NotActivated constraintAnnotation) {
        // no-op
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {

        final UserEntity user = userRepository.findByEmail(email.toLowerCase());

        if (user == null || !user.isActivated()) {
            return true;
        }

        context.buildConstraintViolationWithTemplate("not_activated").addConstraintViolation();

        return false;
    }
}
