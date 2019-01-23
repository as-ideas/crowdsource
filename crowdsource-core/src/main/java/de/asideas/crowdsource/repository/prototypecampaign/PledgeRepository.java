package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import org.joda.time.DateTime;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PledgeRepository extends MongoRepository<PledgeEntity, String> {
    List<PledgeEntity> findByProjectAndFinancingRound(ProjectEntity projectEntity, FinancingRoundEntity financingRoundEntity);
    List<PledgeEntity> findByFinancingRound(FinancingRoundEntity financingRoundEntity);
    List<PledgeEntity> findByFinancingRoundAndCreatedDateGreaterThan(FinancingRoundEntity financingRoundEntity, DateTime createdDate);
}
