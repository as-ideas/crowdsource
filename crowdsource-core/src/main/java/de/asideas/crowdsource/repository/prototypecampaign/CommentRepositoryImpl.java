package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.service.statistics.StatisticsActionUtil;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity.COLLECTION_NAME;

public class CommentRepositoryImpl implements CommentRepositoryCustom {

    static final String CHART_NAME_SUM_COMMENTS = "Summe Kommentare";
    private final MongoTemplate mongoTemplate;

    @Autowired
    public CommentRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<BarChartStatisticsResult> countCommentsGroupByProject(int projectCount) {

        final String map = "function(){ emit(this.project.$id , 1 ); } ";
        final String reduce = "function(key,values){ return values.length;}";

        MapReduceResults<KeyValuePair> results = mongoTemplate.mapReduce(COLLECTION_NAME, map, reduce, KeyValuePair.class);

        final List<KeyValuePair> sortedList = new ArrayList<>();
        for (KeyValuePair result : results) {
            sortedList.add(result);
        }

        Collections.sort(sortedList);

        List<BarChartStatisticsResult> res = new ArrayList<>(projectCount);
        for (KeyValuePair kv : sortedList) {
            ProjectEntity project = mongoTemplate.findOne(new Query(Criteria.where("id").is(kv.getId())), ProjectEntity.class);

            if (project != null) {
                res.add(new BarChartStatisticsResult(kv.getId(), project.getTitle(), kv.getValue()));
            }
            if (res.size() >= projectCount) {
                break;
            }
        }

        return res;
    }

    @Override
    public LineChartStatisticsResult sumCommentsGroupByCreatedDate(TimeRangedStatisticsRequest request) {
        // Emit UTC millis (only year, month, week and day are taken into account) of createdDate as key
        // Value is set to 1 to sum up later (reduce)
        String map = "function () {  " +
                "   var day = Date.UTC(this.createdDate.getFullYear(), this.createdDate.getMonth(), this.createdDate.getDate()); " +
                "   emit(day.toString(), 1); " +
                "}";
        // Reduce all the values for one "key" (for details about key, see above) by summing up each value.
        final String reduce = "function(key,values){ return values.length;}";

        Query filter = Query.query(Criteria.where("createdDate").gte(request.getStartDate()).lte(request.getEndDate()));

        MapReduceResults<KeyValuePair> sumResults = mongoTemplate.mapReduce(
                filter,
                COLLECTION_NAME,
                map,
                reduce,
                KeyValuePair.class
        );

        return toLineChartStatisticsResult(sumResults, request);
    }

    private LineChartStatisticsResult toLineChartStatisticsResult(MapReduceResults<KeyValuePair> sumResults, TimeRangedStatisticsRequest request) {
        Map<String, Long> results = new LinkedHashMap<>();

        for (KeyValuePair vo : sumResults) {
            DateTime dateFromDbId;
            try {
                dateFromDbId = new DateTime(Long.parseLong(vo.getId()), DateTimeZone.UTC);
            } catch (NumberFormatException nfe) {
                throw new IllegalStateException("MapReduce emitted wrong format for id / key field. Expected UTC millis.", nfe);
            }

            results.put(StatisticsActionUtil.formatDate(dateFromDbId), vo.getValue());
        }

        return new LineChartStatisticsResult(
                CHART_NAME_SUM_COMMENTS,
                StatisticsActionUtil.fillMap(StatisticsActionUtil.getDefaultMap(request), results)
        );
    }

    public static class KeyValuePair implements Comparable<KeyValuePair> {
        String id;
        Long value;

        public KeyValuePair(String id, Long value) {
            this.id = id;
            this.value = value;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public Long getValue() {
            return value;
        }

        public void setValue(Long value) {
            this.value = value;
        }

        @Override
        public int compareTo(KeyValuePair o) {
            if (this.value < o.value) {
                return 1;
            } else if (this.value > o.value) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}
