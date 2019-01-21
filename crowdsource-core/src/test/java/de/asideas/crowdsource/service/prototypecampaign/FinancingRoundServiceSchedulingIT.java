package de.asideas.crowdsource.service.prototypecampaign;

import de.asideas.crowdsource.config.SchedulerConfig;
import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.domain.service.financinground.FinancingRoundPostProcessor;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.repository.prototypecampaign.PledgeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.service.UserService;

import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@IntegrationTest
@ContextConfiguration(classes = {FinancingRoundServiceSchedulingIT.Cfg.class, SchedulerConfig.class})
public class FinancingRoundServiceSchedulingIT {

    private static final Logger log = LoggerFactory.getLogger(FinancingRoundServiceSchedulingIT.class);
    private static final int COUNT_TASKS = 10;

    @Autowired
    private FinancingRoundRepository financingRoundRepository;

    @Autowired
    private FinancingRoundPostProcessor financingRoundPostProcessor;

    @Autowired
    private FinancingRoundService financingRoundService;

    private Set<FinancingRoundEntity> roundsToProcess;

    private volatile Set<String> invocationIds = new HashSet<>();

    public FinancingRoundServiceSchedulingIT() {
    }

    @Before
    public void before() {
        reset(financingRoundPostProcessor, financingRoundRepository );
        invocationIds = new HashSet<>();
        roundsToProcess = new LinkedHashSet<>(COUNT_TASKS);
        for (int i = 0; i < COUNT_TASKS; i++) {
            roundsToProcess.add(newFinancingRound("test_roundId_" + i, i, DateTime.now()));
        }
        when(financingRoundRepository.findOne(any(String.class))).thenAnswer(i -> {
            String desiredId = (String) i.getArguments()[0];
            return roundsToProcess.stream().filter(round -> round.getId().equals(desiredId)).findFirst().get();
        });
    }

    @Test
    public void schedulePostProcessing_manyAtOnceShouldAllBeExecuted() throws InterruptedException {
        int timePerTask = 50;
        when(financingRoundPostProcessor.postProcess(any(FinancingRoundEntity.class))).thenAnswer(i -> {
            FinancingRoundEntity arg = (FinancingRoundEntity) i.getArguments()[0];
            invocationIds.add(arg.getId());
            log.info("START processing of {}", arg.getId());
            Thread.sleep(timePerTask);
            log.info("FINISHED processing of {}", arg.getId());
            return arg;
        });

        roundsToProcess.stream().forEach(financingRoundService::schedulePostProcessing);
        // Wait for tasks to be completed
        Thread.sleep(COUNT_TASKS * timePerTask + 100);

        roundsToProcess.stream().forEach( expRound -> assertTrue("Round with ID " + expRound.getId() + " has been executed", invocationIds.contains(expRound.getId())));
    }

    private FinancingRoundEntity newFinancingRound(String id, int budget, DateTime endDate) {
        final FinancingRound cmd = new FinancingRound();
        cmd.setBudget(budget);
        cmd.setEndDate(endDate);
        FinancingRoundEntity res = FinancingRoundEntity.newFinancingRound(cmd, 17);
        res.setId(id);
        return res;
    }

    @Configuration
    public static class Cfg {
        @Bean
        public UserRepository userRepository() {
            return mock(UserRepository.class);
        }

        @Bean
        public UserService userService() {
            return mock(UserService.class);
        }

        @Bean
        public FinancingRoundRepository financingRoundRepository() {
            return mock(FinancingRoundRepository.class);
        }

        @Bean
        public ProjectRepository projectRepository() {
            return mock(ProjectRepository.class);
        }

        @Bean
        public PledgeRepository opledgeRepository() {
            return mock(PledgeRepository.class);
        }

        @Bean
        public FinancingRoundPostProcessor financingRoundPostProcessor() {
            return mock(FinancingRoundPostProcessor.class);
        }

        @Bean
        public FinancingRoundService financingRoundService(TaskScheduler crowdScheduler) {
            return new FinancingRoundService(userRepository(), financingRoundRepository(),
                    projectRepository(), financingRoundPostProcessor(), crowdScheduler, opledgeRepository());
        }

        @Bean
        public PropertyPlaceholderConfigurer propertyPlaceholderConfigurer() {
            return new PropertyPlaceholderConfigurer();
        }
    }
}