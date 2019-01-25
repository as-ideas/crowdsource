package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.statistics.requests.TimeRangedStatisticsRequest;
import de.asideas.crowdsource.presentation.statistics.results.LineChartStatisticsResult;
import de.asideas.crowdsource.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

import static de.asideas.crowdsource.domain.shared.prototypecampaign.StatisticsTypes.SUM_REGISTERED_USER;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.fillMap;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.formatDate;
import static de.asideas.crowdsource.service.statistics.StatisticsActionUtil.getDefaultMap;

@Async
@Service
public class RegisteredUserSumAction {

    private final UserRepository userRepository;

    @Autowired
    public RegisteredUserSumAction(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Future<LineChartStatisticsResult> getCountOfRegisteredUsersByTimeRange(TimeRangedStatisticsRequest request) {

        final List<UserEntity> userEntityList = userRepository.findByCreatedDateBetween(request.getStartDate(), request.getEndDate());

        final Map<String, Long> map = userEntityList.stream().collect(Collectors.groupingBy(
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

        final LineChartStatisticsResult result = new LineChartStatisticsResult(SUM_REGISTERED_USER.getDisplayName(), resultMap);

        return new AsyncResult<>(result);
    }
}
