package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.service.statistics.CommentCountPerProjectAction;
import de.asideas.crowdsource.service.statistics.CreatedProjectSumAction;
import de.asideas.crowdsource.service.statistics.ProjectPerStatusSumAction;
import de.asideas.crowdsource.service.statistics.RegisteredUserSumAction;
import de.asideas.crowdsource.service.statistics.StatisticsService;

import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.scheduling.annotation.AsyncResult;

import java.util.Collections;
import java.util.concurrent.Future;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class StatisticsServiceTest {

    @InjectMocks
    private StatisticsService instance;

    @Mock
    private CreatedProjectSumAction createdProjectSumAction;

    @Mock
    private RegisteredUserSumAction registeredUserSumAction;

    @Mock
    private ProjectPerStatusSumAction projectPerStatusSumAction;

    @Mock
    private CommentCountPerProjectAction commentCountPerProjectAction;

    @Test
    public void getCurrentStatistics_should_callBothActionsToRetrieveData() throws Exception {
        final DateTime startDate = new DateTime();
        final DateTime endDate = new DateTime();
        TimeRangedStatisticsRequest timeRangedStatisticsRequest = new TimeRangedStatisticsRequest(startDate, endDate);

        Future<LineChartStatisticsResult> asyncResult = new AsyncResult<>(new LineChartStatisticsResult("name", Collections.emptyMap()));
        when(createdProjectSumAction.getCreatedProjectSumByTimeRange(eq(timeRangedStatisticsRequest))).thenReturn(asyncResult);
        when(registeredUserSumAction.getCountOfRegisteredUsersByTimeRange(eq(timeRangedStatisticsRequest))).thenReturn(asyncResult);

        instance.getCurrentStatistics(timeRangedStatisticsRequest);

        verify(createdProjectSumAction).getCreatedProjectSumByTimeRange(timeRangedStatisticsRequest);
        verify(registeredUserSumAction).getCountOfRegisteredUsersByTimeRange(timeRangedStatisticsRequest);
    }

    @Test
    public void getProjectsPerStatus_should_delegateToProperActionToRetrieveData() throws Exception {
        instance.getProjectsPerStatus();

        verify(projectPerStatusSumAction).getProjectsPerStatus();
    }

    @Test
    public void getCommentsCountPerProject_should_call_action() throws Exception {
        instance.getCommentsCountPerProject(5);

        verify(commentCountPerProjectAction).getCommentCountPerProjectStatistic(5);
    }
}