package de.asideas.crowdsource.repository.prototypecampaign;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.repository.prototypecampaign.CommentRepositoryImpl;
import de.asideas.crowdsource.service.statistics.StatisticsActionUtil;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.data.mongodb.core.query.Query;

import java.util.Iterator;
import java.util.List;

import static de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity.COLLECTION_NAME;
import static de.asideas.crowdsource.repository.prototypecampaign.CommentRepositoryImpl.CHART_NAME_SUM_COMMENTS;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CommentRepositoryImplTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private MapReduceResults<CommentRepositoryImpl.KeyValuePair> mockedMapReduceResult;

    @Mock
    private Iterator mockIterator;

    @InjectMocks
    private CommentRepositoryImpl commentRepository;

    private DateTime startDate;
    private DateTime endDate;

    @Before
    public void setUp() {
        when(mongoTemplate.mapReduce(any(Query.class), eq(COLLECTION_NAME), anyString(), anyString(), eq(CommentRepositoryImpl.KeyValuePair.class)))
                .thenReturn(mockedMapReduceResult);
        when(mongoTemplate.mapReduce(eq(COLLECTION_NAME), anyString(), anyString(), eq(CommentRepositoryImpl.KeyValuePair.class)))
                .thenReturn(mockedMapReduceResult);

        when(mockedMapReduceResult.iterator()).thenReturn(mockIterator);
    }

    @Test
    public void sumCommentsGroupByCreatedDate_no_data_from_DB_should_return_linechart_instance_with_dates_of_timespan_and_zeros() throws Exception {
        DateTime startDate = DateTime.now(DateTimeZone.UTC).minusDays(1);
        DateTime endDate = DateTime.now(DateTimeZone.UTC);

        LineChartStatisticsResult result = commentRepository.sumCommentsGroupByCreatedDate(
                new TimeRangedStatisticsRequest(startDate, endDate));

        // Verify empty result generation for empty data from db.
        verify(mockIterator).hasNext();

        assertThat(result.getName(), is(CHART_NAME_SUM_COMMENTS));
        assertThat(result.getData().size(), is(2));
        assertThat(result.getData().get(0).getLabel(), is(StatisticsActionUtil.formatDate(startDate)));
        assertThat(result.getData().get(0).getData(), is(0L));
        assertThat(result.getData().get(1).getLabel(), is(StatisticsActionUtil.formatDate(endDate)));
        assertThat(result.getData().get(1).getData(), is(0L));
    }

    @Test
    public void sumCommentsGroupByCreatedDate_should_call_mongo_with_timerange_query() throws Exception {
        DateTime startDate = DateTime.now(DateTimeZone.UTC).minusDays(1);
        DateTime endDate = DateTime.now(DateTimeZone.UTC);

        ArgumentCaptor<Query> captor = ArgumentCaptor.forClass(Query.class);

        when(mongoTemplate.mapReduce(captor.capture(), eq(COLLECTION_NAME), anyString(), anyString(), eq(CommentRepositoryImpl.KeyValuePair.class)))
                .thenReturn(mockedMapReduceResult);

        commentRepository.sumCommentsGroupByCreatedDate(new TimeRangedStatisticsRequest(startDate, endDate));

        Query capturedTimeFilterParam = captor.getValue();

        DBObject capturedQuery = capturedTimeFilterParam.getQueryObject();
        assertThat(capturedQuery.get("createdDate"), instanceOf(BasicDBObject.class));
        BasicDBObject createdDateFromQuery = (BasicDBObject) capturedQuery.get("createdDate");
        assertThat(createdDateFromQuery.get("$gte"), instanceOf(DateTime.class));
        assertThat(createdDateFromQuery.get("$lte"), instanceOf(DateTime.class));
        assertThat( ((DateTime) createdDateFromQuery.get("$gte")).getMillis(), is(startDate.withTimeAtStartOfDay().getMillis()));
        assertThat( ((DateTime) createdDateFromQuery.get("$lte")).getMillis(), is(endDate.withTimeAtStartOfDay().plusDays(1).getMillis()));
    }

    @Test
    public void sumCommentsGroupByCreatedDate_should_map_results_into_linechart_representation_and_fillNonDefinedDays() {
        // GIVEN
        DateTime startDate = DateTime.now(DateTimeZone.UTC).minusDays(5);
        DateTime existingResDate_0 = startDate.plusDays(1);
        DateTime existingResDate_1 = startDate.plusDays(3);
        DateTime endDate = DateTime.now(DateTimeZone.UTC);

        CommentRepositoryImpl.KeyValuePair mockResult1 = new CommentRepositoryImpl.KeyValuePair("" + existingResDate_0.getMillis(), 3L);
        CommentRepositoryImpl.KeyValuePair mockResult2 = new CommentRepositoryImpl.KeyValuePair("" + existingResDate_1.getMillis(), 1L);

        // WHEN
        when(mockIterator.hasNext()).thenReturn(true, true, false);
        when(mockIterator.next()).thenReturn(mockResult1, mockResult2);
        LineChartStatisticsResult result = commentRepository.sumCommentsGroupByCreatedDate(new TimeRangedStatisticsRequest(startDate, endDate));

        // THEN
        verify(mockIterator, times(3)).hasNext();
        verify(mockIterator, times(2)).next();

        assertThat(result.getName(), is(CHART_NAME_SUM_COMMENTS));
        assertThat(result.getData().size(), is(6));

        // Verify all intermediate dates set in result
        assertThat(result.getData().get(0).getLabel(), is(StatisticsActionUtil.formatDate(startDate)));
        assertThat(result.getData().get(1).getLabel(), is(StatisticsActionUtil.formatDate(existingResDate_0)));
        assertThat(result.getData().get(2).getLabel(), is(StatisticsActionUtil.formatDate(existingResDate_0.plusDays(1))));
        assertThat(result.getData().get(3).getLabel(), is(StatisticsActionUtil.formatDate(existingResDate_1)));
        assertThat(result.getData().get(4).getLabel(), is(StatisticsActionUtil.formatDate(existingResDate_1.plusDays(1))));
        assertThat(result.getData().get(5).getLabel(), is(StatisticsActionUtil.formatDate(endDate)));

        // Verify expected, existing results
        assertThat(result.getData().get(1).getData(), is(mockResult1.getValue()));
        assertThat(result.getData().get(3).getData(), is(mockResult2.getValue()));
        // Verify expected, filled results
        assertThat(result.getData().get(0).getData(), is(0L));
        assertThat(result.getData().get(2).getData(), is(0L));
        assertThat(result.getData().get(4).getData(), is(0L));
        assertThat(result.getData().get(5).getData(), is(0L));

    }

    @Test(expected = IllegalStateException.class)
    public void sumCommentsGroupByCreatedDate_should_throw_exception_on_unparseable_data_from_db() {
        startDate = DateTime.now().minusDays(1);
        endDate = DateTime.now();

        CommentRepositoryImpl.KeyValuePair mockResult = new CommentRepositoryImpl.KeyValuePair("test_abc", 1L);

        when(mockIterator.hasNext()).thenReturn(true, false);
        when(mockIterator.next()).thenReturn(mockResult);

        commentRepository.sumCommentsGroupByCreatedDate(new TimeRangedStatisticsRequest(startDate, endDate));
    }

    @Test
    public void countCommentsGroupByProject_should_sort_result() {

        CommentRepositoryImpl.KeyValuePair mockResult1 = new CommentRepositoryImpl.KeyValuePair("test_a", 1L);
        CommentRepositoryImpl.KeyValuePair mockResult2 = new CommentRepositoryImpl.KeyValuePair("test_b", 100L);
        CommentRepositoryImpl.KeyValuePair mockResult3 = new CommentRepositoryImpl.KeyValuePair("test_c", 10L);

        when(mockIterator.hasNext()).thenReturn(true, true, true, false);
        when(mockIterator.next()).thenReturn(mockResult1, mockResult2,mockResult3);

        when(mongoTemplate.findOne(any(Query.class), eq(ProjectEntity.class))).thenReturn(new ProjectEntity());

        List<BarChartStatisticsResult> result = commentRepository.countCommentsGroupByProject(5);

        assertThat(result.get(0).getCount(), is(100L));
        assertThat(result.get(1).getCount(), is(10L));
        assertThat(result.get(2).getCount(), is(1L));
    }

    @Test
    public void countCommentsGroupByProject_should_limit_result() {
        CommentRepositoryImpl.KeyValuePair mockResult1 = new CommentRepositoryImpl.KeyValuePair("test_a", 1L);
        CommentRepositoryImpl.KeyValuePair mockResult2 = new CommentRepositoryImpl.KeyValuePair("test_b", 100L);
        CommentRepositoryImpl.KeyValuePair mockResult3 = new CommentRepositoryImpl.KeyValuePair("test_c", 10L);
        CommentRepositoryImpl.KeyValuePair mockResult4 = new CommentRepositoryImpl.KeyValuePair("test_e", 18L);
        CommentRepositoryImpl.KeyValuePair mockResult5 = new CommentRepositoryImpl.KeyValuePair("test_f", 17L);
        CommentRepositoryImpl.KeyValuePair mockResult6 = new CommentRepositoryImpl.KeyValuePair("test_g", 21L);

        when(mockIterator.hasNext()).thenReturn(true, true, true, true, true, true, false);
        when(mockIterator.next()).thenReturn(mockResult1, mockResult2,mockResult3, mockResult4, mockResult5, mockResult6);

        when(mongoTemplate.findOne(any(Query.class), eq(ProjectEntity.class))).thenReturn(new ProjectEntity());

        List<BarChartStatisticsResult> result = commentRepository.countCommentsGroupByProject(5);

        assertThat(result.size(), is(5));
        assertThat(result.get(0).getCount(), is(100L));
        assertThat(result.get(1).getCount(), is(21L));
        assertThat(result.get(2).getCount(), is(18L));
        assertThat(result.get(3).getCount(), is(17L));
        assertThat(result.get(4).getCount(), is(10L));
    }
}