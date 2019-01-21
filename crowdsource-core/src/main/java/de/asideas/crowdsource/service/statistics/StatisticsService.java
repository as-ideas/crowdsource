package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.service.statistics.CommentSumAction;
import de.asideas.crowdsource.service.statistics.CommentCountPerProjectAction;
import de.asideas.crowdsource.service.statistics.CreatedProjectSumAction;
import de.asideas.crowdsource.service.statistics.ProjectPerStatusSumAction;
import de.asideas.crowdsource.service.statistics.RegisteredUserSumAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class StatisticsService {

    private final CreatedProjectSumAction createdProjectSumAction;
    private final RegisteredUserSumAction registeredUserSumAction;
    private final ProjectPerStatusSumAction projectPerStatusSumAction;
    private final CommentSumAction commentSumAction;
    private final CommentCountPerProjectAction commentCountPerProjectAction;

    @Autowired
    public StatisticsService(CreatedProjectSumAction createdProjectSumAction, RegisteredUserSumAction registeredUserSumAction, ProjectPerStatusSumAction projectPerStatusSumAction, CommentSumAction commentSumAction, CommentCountPerProjectAction commentCountPerProjectAction) {
        this.createdProjectSumAction = createdProjectSumAction;
        this.registeredUserSumAction = registeredUserSumAction;
        this.projectPerStatusSumAction = projectPerStatusSumAction;
        this.commentSumAction = commentSumAction;
        this.commentCountPerProjectAction = commentCountPerProjectAction;
    }

    public List<LineChartStatisticsResult> getCurrentStatistics(TimeRangedStatisticsRequest request) {
        try {
            final Future<LineChartStatisticsResult> createdProjectSumFuture = createdProjectSumAction.getCreatedProjectSumByTimeRange(request);
            final Future<LineChartStatisticsResult> registeredUserSumFuture = registeredUserSumAction.getCountOfRegisteredUsersByTimeRange(request);
            return Arrays.asList(createdProjectSumFuture.get(), registeredUserSumFuture.get());
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to retrieve statistic data", e);
        }
    }

    public List<BarChartStatisticsResult> getProjectsPerStatus() {
        return projectPerStatusSumAction.getProjectsPerStatus();
    }

    public LineChartStatisticsResult getSumComments(TimeRangedStatisticsRequest request) {
        return commentSumAction.getSumComments(request);
    }

    public List<BarChartStatisticsResult> getCommentsCountPerProject(int projectCount) {
        return commentCountPerProjectAction.getCommentCountPerProjectStatistic(projectCount);
    }
}
