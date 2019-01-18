package de.asideas.crowdsource.repository;

import de.asideas.crowdsource.config.MongoDBConfig;
import de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.service.statistics.StatisticsActionUtil;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {MongoDBConfig.class, CrowdSourceTestConfig.class})
@IntegrationTest
public class CommentRepositoryIT {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    private UserEntity commentedBy;
    private ProjectEntity commentCreatedFor;

    @Before
    public void init() {
        // Setup test environment
        if (commentedBy == null) {
            List<UserEntity> allUsers = userRepository.findAll();
            if (! allUsers.isEmpty()) {
                commentedBy = allUsers.get(0);
            } else {
                commentedBy = userRepository.save(new UserEntity("test@crowdsource.de"));
            }
        }
        if (commentCreatedFor == null) {
            List<ProjectEntity> allProjects = projectRepository.findAll();
            if (! allProjects.isEmpty()) {
                commentCreatedFor = allProjects.get(0);
            } else {
                ProjectEntity projectEntity = new ProjectEntity();
                projectEntity.setCreator(commentedBy);
                projectEntity.setPledgeGoal(100);
                projectEntity.setDescription("abc");
                projectEntity.setTitle("abc");
                commentCreatedFor = projectRepository.save(projectEntity);
            }
        }
    }

    @Test
    public void sumCommentsGroupByCreatedDate_returns_same_as_count_per_day_sorted_by_day_ASC() {

        DateTime today = DateTime.now(DateTimeZone.UTC);
        DateTime dayBefore = today.minusDays(1);
        DateTime twoDaysBefore = today.minusDays(2);

        long commentsCreatedAtThisDay = getCountCommentsAtDayOf(today);
        long commentsCreatedAtTheDayBefore = getCountCommentsAtDayOf(dayBefore);
        long commentsCreatedAtTwoDaysAgo = getCountCommentsAtDayOf(twoDaysBefore);

        createComments(5, today);
        createComments(3, dayBefore);
        createComments(1, twoDaysBefore);

        LineChartStatisticsResult result = commentRepository.sumCommentsGroupByCreatedDate(
                new TimeRangedStatisticsRequest(twoDaysBefore.withTimeAtStartOfDay(),
                today.plusDays(1).withTimeAtStartOfDay()));

        LineChartStatisticsResult.LineChartEntry resultTwoDaysAgo = result.getData().get(0);
        LineChartStatisticsResult.LineChartEntry resultOneDayAgo = result.getData().get(1);
        LineChartStatisticsResult.LineChartEntry resultToday = result.getData().get(2);

        assertThat(resultTwoDaysAgo.getLabel(), is(StatisticsActionUtil.formatDate(twoDaysBefore)));
        assertThat(resultTwoDaysAgo.getData(), is(commentsCreatedAtTwoDaysAgo + 1));
        assertThat(resultOneDayAgo.getLabel(), is(StatisticsActionUtil.formatDate(dayBefore)));
        assertThat(resultOneDayAgo.getData(), is(commentsCreatedAtTheDayBefore + 3));
        assertThat(resultToday.getLabel(), is(StatisticsActionUtil.formatDate(today)));
        assertThat(resultToday.getData(), is(commentsCreatedAtThisDay + 5));
    }

    @Test
    public void sumCommentsGroupByCreatedDate_should_respect_timerange_bounds_inclusive () {

        DateTime today = DateTime.now(DateTimeZone.UTC);
        DateTime dayBefore = today.minusDays(1);
        DateTime twoDaysBefore = today.minusDays(2);
        DateTime threeDaysBefore = today.minusDays(3);

        long commentsCreatedAt1DayAgo = getCountCommentsAtDayOf(dayBefore);
        long commentsCreatedAt2DaysAgo = getCountCommentsAtDayOf(twoDaysBefore);

        createComments(5, today);
        createComments(3, dayBefore);
        createComments(1, twoDaysBefore);
        createComments(17, threeDaysBefore);

        LineChartStatisticsResult result = commentRepository.sumCommentsGroupByCreatedDate(
                new TimeRangedStatisticsRequest(twoDaysBefore.withTimeAtStartOfDay(),
                twoDaysBefore.plusDays(2).withTimeAtStartOfDay()));

        LineChartStatisticsResult.LineChartEntry resultTwoDaysAgo = result.getData().get(0);
        LineChartStatisticsResult.LineChartEntry resultOneDayAgo = result.getData().get(1);

        assertThat(resultTwoDaysAgo.getLabel(), is(StatisticsActionUtil.formatDate(twoDaysBefore)));
        assertThat(resultTwoDaysAgo.getData(), is(commentsCreatedAt2DaysAgo + 1));
        assertThat(resultOneDayAgo.getLabel(), is(StatisticsActionUtil.formatDate(dayBefore)));
        assertThat(resultOneDayAgo.getData(), is(commentsCreatedAt1DayAgo + 3));
    }

    private void createComments(int count, DateTime dateTime) {
        for (int i = 0; i < count; i++) {
            CommentEntity entity = new CommentEntity();
            entity.setComment("HELLO");
            entity.setProject(commentCreatedFor);
            entity.setUser(commentedBy);
            CommentEntity saved = commentRepository.save(entity);
            // Explicitly overcome auditing enabled for dates
            saved.setCreatedDate(dateTime);
            commentRepository.save(saved);
        }
    }

    private long getCountCommentsAtDayOf(DateTime date) {
        DateTime start = date.withTimeAtStartOfDay();
        DateTime end = date.plusDays(1).withTimeAtStartOfDay();
        Query dayCreatedQuery = Query.query(Criteria.where("createdDate").gte(start).lte(end));

        return mongoTemplate.count(dayCreatedQuery, CommentEntity.class);
    }

}