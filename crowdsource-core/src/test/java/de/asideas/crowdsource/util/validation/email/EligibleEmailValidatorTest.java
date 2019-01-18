package de.asideas.crowdsource.util.validation.email;

import de.asideas.crowdsource.testutil.ValidatorTestUtil;
import org.junit.Before;
import org.junit.Test;
import org.mockito.internal.util.reflection.Whitebox;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.spy;

public class EligibleEmailValidatorTest {

    private EligibleEmailValidator eligibleEmailValidator;

    @Before
    public void beforeMethod() throws Exception {
        eligibleEmailValidator = spy(new EligibleEmailValidator());
        Whitebox.setInternalState(eligibleEmailValidator, "emailBlacklistPatterns", Arrays.asList("_extern"));
        Whitebox.setInternalState(eligibleEmailValidator, "allowedEmailDomains", Arrays.asList("allowed.de", "asideas.de"));

    }

    @Test
    public void isValid_shouldReturnTrueOnValidEmailAddress() {

        assertTrue(eligibleEmailValidator.isValid("test@asideas.de", ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void isValid_shouldReturnFalseOnNotWhitelistedEmailAddress() {

        assertFalse(eligibleEmailValidator.isValid("test@someHost.de", ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void isValid_shouldReturnFalseOnBlacklistedAddressPattern() {

        assertFalse(eligibleEmailValidator.isValid("test_extern@asideas.de", ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void isValid_shouldReturnTrueForAnyMailAddressOnEmptyWhiteList() {
        Whitebox.setInternalState(eligibleEmailValidator, "allowedEmailDomains", new ArrayList());

        assertTrue(eligibleEmailValidator.isValid("test@someHost.de", ValidatorTestUtil.constraintValidatorContext()));
    }


}