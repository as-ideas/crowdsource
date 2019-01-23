package de.asideas.crowdsource.domain.service.financinground;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.repository.prototypecampaign.PledgeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 * A post processing domain service that executes any action necessary to
 * synchronize depending entities upon termination of a {@link FinancingRoundEntity}.
 * <p>
 * It is supposed to be exectued directly as well as in a scheduled manner.
 * <p>
 * As long as there is no reliable mechanism of concurrent scheduled task execution this
 * service should be kept idempotent.
 */
@Service
public class FinancingRoundPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(FinancingRoundPostProcessor.class);
    private FinancingRoundRepository financingRoundRepository;
    private ProjectRepository projectRepository;
    private PledgeRepository pledgeRepository;

    @Autowired
    public FinancingRoundPostProcessor(
            FinancingRoundRepository financingRoundRepository,
            ProjectRepository projectRepository,
            PledgeRepository pledgeRepository) {

        this.financingRoundRepository = financingRoundRepository;
        this.projectRepository = projectRepository;
        this.pledgeRepository = pledgeRepository;
    }

    public FinancingRoundEntity postProcess(FinancingRoundEntity financingRound) {
        Assert.notNull(financingRound);

        if (!financingRound.terminationPostProcessingRequiredNow()) {
            log.info("Skipping post processing of FinancingRound due to not required right now: {}", financingRound);
            return financingRound;
        }
        log.info("Starting post processing of FinancingRound {}", financingRound);

        assignUnpledgedBudgetToFinancingRound(financingRound);
        notifyProjectsOfTerminatedFinancingRound(financingRound);

        financingRound.setTerminationPostProcessingDone(true);
        FinancingRoundEntity res = financingRoundRepository.save(financingRound);
        log.info("Finished post processing of FinancingRound {}", res);
        return res;
    }

    void notifyProjectsOfTerminatedFinancingRound(final FinancingRoundEntity financingRound) {
        projectRepository.findByFinancingRound(financingRound).stream()
                .forEach(project -> {
                    if (project.onFinancingRoundTerminated(financingRound)) {
                        projectRepository.save(project);
                    }
                });
    }

    /**
     * Determines the amount of money that was not pledged by any user to any project during the <code>financingRound</code> given and
     * assigns it to that round.
     *
     * @param financingRound
     * @return the <code>financingRound</code> provided
     */
    void assignUnpledgedBudgetToFinancingRound(final FinancingRoundEntity financingRound) {
        final int pledgedTotalOfRound = pledgeRepository.findByFinancingRound(financingRound).stream()
                .mapToInt(PledgeEntity::getAmount)
                .sum();
        financingRound.initPostRoundBudget(pledgedTotalOfRound);
    }


}
