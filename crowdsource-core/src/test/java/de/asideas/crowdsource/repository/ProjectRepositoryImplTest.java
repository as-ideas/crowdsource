package de.asideas.crowdsource.repository;

import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.repository.ProjectRepositoryImpl.ProjectPerStatusResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProjectRepositoryImplTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private ProjectRepositoryImpl projectRepository;

    @Test
    public void sumProjectsGroupedByStatus_return_empty_list_on_empty_results() {

        ArgumentCaptor<TypedAggregation> aggregationParamCaptor = ArgumentCaptor.forClass(TypedAggregation.class);

        AggregationResults resultMock = mock(AggregationResults.class);
        when(resultMock.getMappedResults()).thenReturn(Collections.emptyList());

        when(mongoTemplate.aggregate(aggregationParamCaptor.capture(), eq(ProjectPerStatusResult.class))).thenReturn(resultMock);

        List<BarChartStatisticsResult> results = projectRepository.sumProjectsGroupedByStatus();

        TypedAggregation aggregationParam = aggregationParamCaptor.getValue();
        assertThat("Aggregation input type should be a ProjectEntity", aggregationParam.getInputType() == ProjectEntity.class);

        assertThat(results.size(), is(0));
    }

    @Test
    public void sumProjectsGroupedByStatus_return_mapped_results_on_aggregation_results() {

        ArgumentCaptor<TypedAggregation> aggregationParamCaptor = ArgumentCaptor.forClass(TypedAggregation.class);

        AggregationResults resultMock = mock(AggregationResults.class);
        when(resultMock.getMappedResults()).thenReturn(Arrays.asList (
            new ProjectRepositoryImpl.ProjectPerStatusResult(ProjectStatus.PUBLISHED, 3L)
        ));

        when(mongoTemplate.aggregate(aggregationParamCaptor.capture(), eq(ProjectPerStatusResult.class))).thenReturn(resultMock);

        List<BarChartStatisticsResult> results = projectRepository.sumProjectsGroupedByStatus();

        TypedAggregation aggregationParam = aggregationParamCaptor.getValue();
        assertThat("Aggregation input type should be a ProjectEntity", aggregationParam.getInputType() == ProjectEntity.class);

        assertThat(results.size(), is(1));

        assertThat(results.get(0).getId(), is(ProjectStatus.PUBLISHED.name()));
        assertThat(results.get(0).getName(), is(ProjectStatus.PUBLISHED.getDisplayName()));
        assertThat(results.get(0).getCount(), is(3L));
    }
}