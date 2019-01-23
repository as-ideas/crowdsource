package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.presentation.statistics.results.BarChartStatisticsResult;
import de.asideas.crowdsource.repository.prototypecampaign.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentCountPerProjectAction {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentCountPerProjectAction(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<BarChartStatisticsResult> getCommentCountPerProjectStatistic(int projectCount) {
        return commentRepository.countCommentsGroupByProject(projectCount);
    }
}
