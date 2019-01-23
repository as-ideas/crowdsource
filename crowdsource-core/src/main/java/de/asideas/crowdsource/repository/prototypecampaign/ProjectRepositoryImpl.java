package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

public class ProjectRepositoryImpl implements ProjectRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public ProjectRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<BarChartStatisticsResult> sumProjectsGroupedByStatus() {
        AggregationResults<ProjectPerStatusResult> aggregationResults = mongoTemplate.aggregate(
                newAggregation(
                        ProjectEntity.class,
                        group("status").count().as("count")
                ), ProjectPerStatusResult.class);

        return aggregationResults.getMappedResults().stream()
                .map(res -> new BarChartStatisticsResult(res.getId().name(), res.getId().getDisplayName(), res.getCount()))
                .collect(Collectors.toList());
    }

    static class ProjectPerStatusResult {

        private ProjectStatus id;
        private Long count;

        private ProjectPerStatusResult() {
        }

        public ProjectPerStatusResult(ProjectStatus id, Long count) {
            this.id = id;
            this.count = count;
        }

        public ProjectStatus getId() {
            return id;
        }

        public Long getCount() {
            return count;
        }
    }

}
