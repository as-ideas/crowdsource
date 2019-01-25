package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.shared.prototypecampaign.ProjectStatus;
import org.joda.time.DateTime;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<ProjectEntity, String>, ProjectRepositoryCustom {

    List<ProjectEntity> findByStatusOrderByCreatedDateDesc(ProjectStatus projectStatus);

    List<ProjectEntity> findByFinancingRound(FinancingRoundEntity financingRound);

    List<ProjectEntity> findByCreatedDateBetween(DateTime startDate, DateTime endDate);


}
