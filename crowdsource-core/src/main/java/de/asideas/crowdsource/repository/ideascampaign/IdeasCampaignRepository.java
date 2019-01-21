package de.asideas.crowdsource.repository.ideascampaign;

import java.util.List;

import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

public interface IdeasCampaignRepository extends MongoRepository<IdeasCampaignEntity, String> {

    @Query("{ startDate: { $lte: ?0 }, endDate: { $gte: ?0 }}")
    List<IdeasCampaignEntity> findActive(DateTime forDate);

    @Query("{}")
    Page<IdeasCampaignEntity> ideasCampaigns(Pageable pageable);
}
