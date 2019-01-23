package de.asideas.crowdsource.service.prototypecampaign;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.domain.service.financinground.FinancingRoundPostProcessor;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.repository.prototypecampaign.PledgeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import de.asideas.crowdsource.repository.UserRepository;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinancingRoundService implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(FinancingRoundService.class);

    private UserRepository userRepository;
    private FinancingRoundRepository financingRoundRepository;
    private ProjectRepository projectRepository;
    private FinancingRoundPostProcessor financingRoundPostProcessor;
    private TaskScheduler crowdScheduler;
    private PledgeRepository pledgeRepository;


    @Autowired
    public FinancingRoundService(UserRepository userRepository,
                                 FinancingRoundRepository financingRoundRepository,
                                 ProjectRepository projectRepository,
                                 FinancingRoundPostProcessor financingRoundPostProcessor,
                                 TaskScheduler crowdScheduler,
                                 PledgeRepository pledgeRepository) {

        this.userRepository = userRepository;
        this.financingRoundRepository = financingRoundRepository;
        this.projectRepository = projectRepository;
        this.financingRoundPostProcessor = financingRoundPostProcessor;
        this.crowdScheduler = crowdScheduler;
        this.pledgeRepository = pledgeRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        this.reschedulePostProcessingOfFinancingRounds();
    }

    public List<FinancingRound> allFinancingRounds() {
        final List<FinancingRoundEntity> all = financingRoundRepository.findAll();

        if (all.isEmpty()) {
            return Collections.emptyList();
        }

        return all.stream()
                .map(this::financingRound)
                .collect(Collectors.toList());
    }

    public FinancingRound currentlyActiveRound() {
        final FinancingRoundEntity financingRoundEntity = financingRoundRepository.findActive(DateTime.now());
        if (financingRoundEntity == null) {
            throw new ResourceNotFoundException();
        }

        return financingRound(financingRoundEntity);
    }

    /**
     * @return The financing round that is currently active or has been active most recently.
     */
    public FinancingRound mostRecentRound() {
        return financingRound(mostRecentRoundEntity());
    }

    public FinancingRoundEntity mostRecentRoundEntity() {
        final Page<FinancingRoundEntity> pageMostRecent = financingRoundRepository.financingRounds(new PageRequest(0, 1, Sort.Direction.DESC, "createdDate"));
        if (pageMostRecent.getNumberOfElements() < 1) {
            throw new ResourceNotFoundException();
        }
        return pageMostRecent.getContent().get(0);
    }

    public FinancingRound startNewFinancingRound(FinancingRound creationCommand) {

        final List<UserEntity> userEntities = findAllNotDeletedUsers();

        // create round
        final FinancingRoundEntity financingRoundEntity = FinancingRoundEntity
                .newFinancingRound(creationCommand, userEntities.size());

        // flush user budget and set new budget
        final int budgetPerUser = financingRoundEntity.getBudgetPerUser();
        userEntities.forEach(userEntity -> {
            userEntity.setBudget(budgetPerUser);
            userRepository.save(userEntity);
        });

        final FinancingRoundEntity res = financingRoundRepository.save(financingRoundEntity);

        projectRepository.findAll().stream()
                .filter(res::projectEligibleForRound)
                .forEach(project -> {
                    project.setFinancingRound(res);
                    projectRepository.save(project);
                });

        schedulePostProcessing(res);

        return financingRound(res);
    }

    private List<UserEntity> findAllNotDeletedUsers() {
        return userRepository.findAll().stream().filter(user -> !user.isDeleted()).collect(Collectors.toList());
    }

    public FinancingRound stopFinancingRound(String financingRoundId) throws ResourceNotFoundException, InvalidRequestException {
        FinancingRoundEntity financingRoundEntity = financingRoundRepository.findOne(financingRoundId);

        if (financingRoundEntity == null) {
            throw new ResourceNotFoundException();
        }
        if (financingRoundEntity.getEndDate().isBeforeNow()) {
            throw InvalidRequestException.financingRoundAlreadyStopped();
        }

        financingRoundEntity.stopFinancingRound();
        financingRoundRepository.save(financingRoundEntity);

        financingRoundEntity = financingRoundPostProcessor.postProcess(financingRoundEntity);

        return financingRound(financingRoundEntity);
    }

    /**
     * Post processes a financing round upon its termination according to domain logic implemented
     * in {@link FinancingRoundPostProcessor}
     *
     * @param financingRound the round to be processed after termination
     */
    void schedulePostProcessing(FinancingRoundEntity financingRound) {
        Assert.hasText(financingRound.getId());
        final String financingRoundId = financingRound.getId();

        crowdScheduler.schedule(() -> {
            FinancingRoundEntity entity2Process = financingRoundRepository.findOne(financingRoundId);
            if (entity2Process == null) {
                log.warn("The FinancingRoundEntity having ID {}, scheduled for post processing doesn't exist (anymore).", financingRoundId);
                return;
            }
            financingRoundPostProcessor.postProcess(entity2Process);
        }, financingRound.getEndDate().toDate());
        log.info("|-- Scheduled post processing of financing round targeted at: {} for financing round {}.", financingRound.getEndDate().toDate(), financingRound);
    }

    /**
     * Re-Schedules the post processing of active financing rounds as well as actually executes
     * post processing of financing rounds already terminated in case the application was not active
     * at point in time when triggering of post processing should have occurred.
     */
    void reschedulePostProcessingOfFinancingRounds() {
        log.info("Going to (re-) schedule post processing of still active or not already processed inactive financing rounds.");
        financingRoundRepository.findAll().stream()
                .filter(fr -> !fr.getTerminationPostProcessingDone())
                .forEach(this::schedulePostProcessing);
    }

    FinancingRound financingRound(FinancingRoundEntity financingRoundEntity) {
        List<PledgeEntity> postRoundPledges = null;
        if (financingRoundEntity.getTerminationPostProcessingDone()) {
            postRoundPledges = pledgeRepository.findByFinancingRoundAndCreatedDateGreaterThan(financingRoundEntity, financingRoundEntity.getEndDate());
        }
        return new FinancingRound(financingRoundEntity, postRoundPledges);
    }

}
