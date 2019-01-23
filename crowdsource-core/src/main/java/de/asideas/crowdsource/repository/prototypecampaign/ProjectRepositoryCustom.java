package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;

import java.util.List;

public interface ProjectRepositoryCustom {

    List<BarChartStatisticsResult> sumProjectsGroupedByStatus();
}
