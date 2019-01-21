package de.asideas.crowdsource.util.validation.email;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.validation.ConstraintValidatorContext;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class NotActivatedValidatorTest {

    private final static String EXISTING_EMAIL_NOT_ACTIVATED = "existing_email_not_activated";

    private final static String EXISTING_EMAIL_ACTIVATED = "existing_email_activated";

    private final static String NON_EXISTING_EMAIL = "non_existing_email";

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotActivatedValidator validator;

    @Mock
    private ConstraintValidatorContext validatorContext;

    @Before
    public void initMocks() {

        // mock for existing + activated
        final UserEntity existing_activated = mock(UserEntity.class);
        when(existing_activated.isActivated()).thenReturn(true);
        when(userRepository.findByEmail(EXISTING_EMAIL_ACTIVATED)).thenReturn(existing_activated);

        // mock for existing + activated
        final UserEntity existing_not_activated = mock(UserEntity.class);
        when(existing_not_activated.isActivated()).thenReturn(false);
        when(userRepository.findByEmail(EXISTING_EMAIL_NOT_ACTIVATED)).thenReturn(existing_not_activated);

        // return null for NON_EXISTING_EMAIL
        when(userRepository.findByEmail(NON_EXISTING_EMAIL)).thenReturn(null);

        // avoid NPEs
        when(validatorContext.buildConstraintViolationWithTemplate(anyString())).thenReturn(mock(ConstraintValidatorContext.ConstraintViolationBuilder.class));
    }

    @Test
    public void testIsValidNonExistingEmail() throws Exception {

        assertTrue(validator.isValid(NON_EXISTING_EMAIL, validatorContext));
    }

    @Test
    public void testIsValidExistingEmailNotActivated() throws Exception {

        assertTrue(validator.isValid(EXISTING_EMAIL_NOT_ACTIVATED, validatorContext));
    }

    @Test
    public void testIsValidExistingEmailActivated() throws Exception {

        assertFalse(validator.isValid(EXISTING_EMAIL_ACTIVATED, validatorContext));
    }
}