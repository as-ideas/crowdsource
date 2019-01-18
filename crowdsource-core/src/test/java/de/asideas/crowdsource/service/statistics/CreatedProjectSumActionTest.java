package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.repository.ProjectRepository;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.*;
import java.util.concurrent.Future;

import static de.asideas.crowdsource.domain.shared.StatisticsTypes.SUM_CREATED_PROJECT;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CreatedProjectSumActionTest {

    @InjectMocks
    private CreatedProjectSumAction instance;

    @Mock
    private ProjectRepository projectRepository;

    private List<ProjectEntity> projectEntityList;

    @Before
    public void setUp() throws Exception {

        projectEntityList = new ArrayList<>();
        for(int i = 0; i < 10; i++) {
            ProjectEntity entity = new ProjectEntity();
            entity.setCreatedDate(DateTime.now().minusDays(i));
            projectEntityList.add(entity);
        }

        when(projectRepository.findByCreatedDateBetween(any(DateTime.class), any(DateTime.class))).thenReturn(projectEntityList);
    }

    @Test
    public void getCreatedProjectSumByTimeRange_provide_correct_name_of_statistic() throws Exception {
        final DateTime startDate = DateTime.now().minusDays(10);
        final DateTime endDate = DateTime.now();

        Future<LineChartStatisticsResult> result = instance.getCreatedProjectSumByTimeRange(new TimeRangedStatisticsRequest(startDate, endDate));

        verify(projectRepository).findByCreatedDateBetween(startDate.withTimeAtStartOfDay(), endDate.plusDays(1).withTimeAtStartOfDay());

        assertThat(result.get().getName(), is(SUM_CREATED_PROJECT.getDisplayName()));
    }

    @Test
    public void getCreatedProjectSumByTimeRange_provide_correct_sum_all() throws Exception {
        final DateTime startDate = DateTime.now().minusDays(9);
        final DateTime endDate = DateTime.now();

        Future<LineChartStatisticsResult> result = instance.getCreatedProjectSumByTimeRange(new TimeRangedStatisticsRequest(startDate, endDate));

        verify(projectRepository).findByCreatedDateBetween(startDate.withTimeAtStartOfDay(), endDate.plusDays(1).withTimeAtStartOfDay());

        assertThat(result.get().getData().size(), is(10));
        assertThat(result.get().getData().stream().map(e -> e.getData()).reduce(0L, Long::sum), is(10L));
    }

    @Test
    public void getCreatedProjectSumByTimeRange_provide_correct_sum_empty() throws Exception {
        final DateTime startDate = DateTime.now().minusDays(20);
        final DateTime endDate = DateTime.now().minusDays(11);

        when(projectRepository.findByCreatedDateBetween(eq(startDate.withTimeAtStartOfDay()), eq(endDate.plusDays(1).withTimeAtStartOfDay()))).thenReturn(Collections.emptyList());

        Future<LineChartStatisticsResult> result = instance.getCreatedProjectSumByTimeRange(new TimeRangedStatisticsRequest(startDate, endDate));

        verify(projectRepository).findByCreatedDateBetween(startDate.withTimeAtStartOfDay(), endDate.plusDays(1).withTimeAtStartOfDay());

        assertThat(result.get().getData().stream().map(e -> e.getData()).reduce(0L, Long::sum), is(0L));
    }

    @Test
    public void getCreatedProjectSumByTimeRange_provide_correct_sum_on_same_day() throws Exception {
        final DateTime startDate = DateTime.now().minusDays(1);

        ProjectEntity entity = new ProjectEntity();
        entity.setCreatedDate(DateTime.now().minusDays(1));

        when(projectRepository.findByCreatedDateBetween(eq(startDate.withTimeAtStartOfDay()), any(DateTime.class))).thenReturn(Arrays.asList(entity, entity, entity));

        Future<LineChartStatisticsResult> result = instance.getCreatedProjectSumByTimeRange(new TimeRangedStatisticsRequest(startDate, startDate));

        verify(projectRepository).findByCreatedDateBetween(startDate.withTimeAtStartOfDay(), startDate.plusDays(1).withTimeAtStartOfDay());

        assertThat(result.get().getData().size(), is(1));
        assertThat(result.get().getData().stream().map(e -> e.getData()).findFirst().get(), is(3L));
    }
}