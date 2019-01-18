package de.asideas.crowdsource.util.validation.financinground;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.repository.FinancingRoundRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class FinancingRoundNotCollidingValidator implements ConstraintValidator<FinancingRoundNotColliding, FinancingRound> {

    @Autowired
    private FinancingRoundRepository financingRoundRepository;

    @Override
    public void initialize(FinancingRoundNotColliding constraintAnnotation) {
    }

    @Override
    public boolean isValid(final FinancingRound financingRound, ConstraintValidatorContext context) {

        for (FinancingRoundEntity financingRoundEntity : financingRoundRepository.findAll()) {

            // if the other financing round is not starting after financingrounds end
            // AND it is not ending before financingrounds start we have a collision
            if (!financingRoundEntity.getStartDate().isAfter(financingRound.getEndDate())
                    && !financingRoundEntity.getEndDate().isBefore(financingRound.getStartDate())) {
                context.buildConstraintViolationWithTemplate("non-colliding").addConstraintViolation();
                return false;
            }
        }

        return true;
    }
}
