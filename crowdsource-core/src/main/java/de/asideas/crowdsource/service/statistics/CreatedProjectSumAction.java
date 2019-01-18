package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

import static de.asideas.crowdsource.domain.shared.StatisticsTypes.SUM_CREATED_PROJECT;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.fillMap;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.formatDate;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.getDefaultMap;

@Async
@Service
public class CreatedProjectSumAction {

    private final ProjectRepository projectRepository;

    @Autowired
    public CreatedProjectSumAction(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Future<LineChartStatisticsResult> getCreatedProjectSumByTimeRange(TimeRangedStatisticsRequest request) {

        final List<ProjectEntity> projectEntityList = projectRepository.findByCreatedDateBetween(request.getStartDate(), request.getEndDate());

        final Map<String, Long> map = projectEntityList.stream().collect(Collectors.groupingBy(
                p -> formatDate(p.getCreatedDate()),
                Collectors.reducing(
                        0L,
                        t -> 1L,
                        Long::sum
                )
        ));

        final Map<String, Long> resultMap = fillMap(
                getDefaultMap(request),
                map
        );

        final LineChartStatisticsResult result = new LineChartStatisticsResult(SUM_CREATED_PROJECT.getDisplayName(), resultMap);

        return new AsyncResult<>(result);
    }
}
