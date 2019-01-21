package de.asideas.crowdsource.repository;

import de.asideas.crowdsource.config.MongoDBConfig;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import static de.asideas.crowdsource.domain.shared.ProjectStatus.FULLY_PLEDGED;
import static de.asideas.crowdsource.domain.shared.ProjectStatus.PROPOSED;
import static de.asideas.crowdsource.domain.shared.ProjectStatus.PUBLISHED;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {MongoDBConfig.class, CrowdSourceTestConfig.class})
@IntegrationTest
public class ProjectRepositoryImplIT {

    private static final Logger log = LoggerFactory.getLogger(ProjectRepositoryImplIT.class);
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    private UserEntity projectCreator;

    @Before
    public void init() {
        if (projectCreator == null) {
            List<UserEntity> allUsers = userRepository.findAll();
            if (! allUsers.isEmpty()) {
                projectCreator = allUsers.get(0);
            } else {
                projectCreator = userRepository.save(new UserEntity("test@crowdsource.de", "Ringo", "Starr"));
            }
        }
    }

    @Test
    public void sumProjectsGroupedByStatus_aggregation_returns_uptodate_data() {
        // Actually the aggregation should return same results as simply doing a count query for each separate status.
        Map<ProjectStatus, Long> initialCountsByStatus = getProjectCountsByStatus();

        int addProposed = 30;
        int addPledged = 10;
        int addPublished = 50;

        givenProjectsWithStatus(addProposed, PROPOSED);
        givenProjectsWithStatus(addPledged, FULLY_PLEDGED);
        givenProjectsWithStatus(addPublished, PUBLISHED);

        log.info("|-- ALL PROJECTS CURRENTLY IN REPO: ");
        projectRepository.findAll().stream().forEach(e -> log.info(" -- " + e));

        List<BarChartStatisticsResult> aggregationResult = projectRepository.sumProjectsGroupedByStatus();

        expectAggregatedCount(aggregationResult, PROPOSED, initialCountsByStatus.get(PROPOSED) + addProposed);
        expectAggregatedCount(aggregationResult, PUBLISHED, initialCountsByStatus.get(PUBLISHED) + addPublished);
        expectAggregatedCount(aggregationResult, FULLY_PLEDGED, initialCountsByStatus.get(FULLY_PLEDGED) + addPledged);

    }

    @Test
    public void sumProjectsGroupedByStatus_aggregation_returns_unchanged_data() {
        // Assure at least 1 project exists in db for each status to test.
        givenProjectsWithStatus(1, PROPOSED);
        givenProjectsWithStatus(1, FULLY_PLEDGED);
        givenProjectsWithStatus(1, PUBLISHED);

        // Actually the aggregation should return same results as simply doing a count query for each separate status.
        Map<ProjectStatus, Long> initialCountsByStatus = getProjectCountsByStatus();

        List<BarChartStatisticsResult> aggregationResult = projectRepository.sumProjectsGroupedByStatus();

        expectAggregatedCount(aggregationResult, PROPOSED, initialCountsByStatus.get(PROPOSED));
        expectAggregatedCount(aggregationResult, PUBLISHED, initialCountsByStatus.get(PUBLISHED));
        expectAggregatedCount(aggregationResult, FULLY_PLEDGED, initialCountsByStatus.get(FULLY_PLEDGED));
    }

    private void expectAggregatedCount(List<BarChartStatisticsResult> aggregationResult, ProjectStatus statusToTest, long expectedCount) {
        assertThat(
                aggregationResult.stream().filter(r -> statusToTest.name().equals(r.getId())).findFirst().get().getCount(),
                is(expectedCount)
        );
    }

    private Map<ProjectStatus, Long> getProjectCountsByStatus() {
        EnumMap<ProjectStatus, Long> result = new EnumMap<>(ProjectStatus.class);

        for (ProjectStatus status : ProjectStatus.values()) {
            result.put(status, (long) projectRepository.findByStatusOrderByCreatedDateDesc(status).size());
        }
        return result;
    }

    private void givenProjectsWithStatus(int desiredProjectCount, ProjectStatus desiredStatus) {

        for (int i = 0; i < desiredProjectCount; i++) {
            ProjectEntity project = new ProjectEntity();
            project.setCreator(projectCreator);
            project.setTitle("project from ProjectRepositoryImplIT idx" + i);
            project.setDescription("project from ProjectRepositoryImplIT idx" + i);
            project.setPledgeGoal(1000);
            project.setStatus(desiredStatus);

            projectRepository.save(project);
        }
    }
}
