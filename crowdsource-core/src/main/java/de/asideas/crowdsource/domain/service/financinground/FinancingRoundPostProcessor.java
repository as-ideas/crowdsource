package de.asideas.crowdsource.domain.service.financinground;

import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.repository.FinancingRoundRepository;
import de.asideas.crowdsource.repository.ProjectRepository;
import de.asideas.crowdsource.repository.UserRepository;
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
    private UserRepository userRepository;
    private ProjectRepository projectRepository;

    @Autowired
    public FinancingRoundPostProcessor(
            FinancingRoundRepository financingRoundRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.financingRoundRepository = financingRoundRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public FinancingRoundEntity postProcess(final FinancingRoundEntity financingRound) {
        Assert.notNull(financingRound);

        if (!financingRound.terminationPostProcessingRequiredNow()) {
            log.info("Skipping post processing of FinancingRound due to not required right now: {}", financingRound);
            return financingRound;
        }
        log.info("Starting post processing of FinancingRound {}", financingRound);

        projectRepository.findByFinancingRound(financingRound).stream()
                .forEach(project -> {
                    if (project.onFinancingRoundTerminated(financingRound)) {
                        projectRepository.save(project);
                    }
                });

        financingRound.setTerminationPostProcessingDone(true);
        FinancingRoundEntity res = financingRoundRepository.save(financingRound);
        log.info("Finished post processing of FinancingRound {}", res);
        return res;
    }

}
