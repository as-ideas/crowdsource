package de.asideas.crowdsource.util.validation.financinground;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.testutil.ValidatorTestUtil;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class FinancingRoundNotCollidingValidatorTest {

    @Mock
    private FinancingRoundRepository financingRoundRepository;

    @InjectMocks
    private FinancingRoundNotCollidingValidator financingRoundNotCollidingValidator;

    @Before
    public void init() {
        FinancingRoundEntity reference = new FinancingRoundEntity();
        reference.setStartDate(new DateTime(2015, 1, 10, 0, 0, 0, 0));
        reference.setEndDate(new DateTime(2015, 1, 20, 0, 0, 0, 0));
        when(financingRoundRepository.findAll()).thenReturn(Collections.singletonList(reference));
    }

    @Test
    public void testIsValidBefore() throws Exception {
        assertTrue(financingRoundNotCollidingValidator.isValid(financingRound(1, 9), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsValidAfter() throws Exception {
        assertTrue(financingRoundNotCollidingValidator.isValid(financingRound(21, 25), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsInValidWhenTouchingAtStart() throws Exception {
        assertFalse(financingRoundNotCollidingValidator.isValid(financingRound(1, 10), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsInValidWhenTouchingAtEnd() throws Exception {
        assertFalse(financingRoundNotCollidingValidator.isValid(financingRound(20, 25), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsInValidWhenOverlappingStart() throws Exception {
        assertFalse(financingRoundNotCollidingValidator.isValid(financingRound(1, 11), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsInValidWhenOverlappingEnd() throws Exception {
        assertFalse(financingRoundNotCollidingValidator.isValid(financingRound(19, 25), ValidatorTestUtil.constraintValidatorContext()));
    }

    @Test
    public void testIsInValidWhenInBetween() throws Exception {
        assertFalse(financingRoundNotCollidingValidator.isValid(financingRound(11, 19), ValidatorTestUtil.constraintValidatorContext()));
    }

    FinancingRound financingRound(int startDay, int endDay) {
        FinancingRound financingRound = new FinancingRound();
        financingRound.setStartDate(new DateTime(2015, 1, startDay, 0, 0, 0, 0));
        financingRound.setEndDate(new DateTime(2015, 1, endDay, 0, 0, 0, 0));
        return financingRound;
    }
}