package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectPerStatusSumAction {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectPerStatusSumAction(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<BarChartStatisticsResult> getProjectsPerStatus() {
        return projectRepository.sumProjectsGroupedByStatus();
    }
}
