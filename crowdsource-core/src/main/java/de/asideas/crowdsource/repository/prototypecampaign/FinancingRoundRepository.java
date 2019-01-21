package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface FinancingRoundRepository extends MongoRepository<FinancingRoundEntity, String> {

    @Query("{ startDate: { $lte: ?0 }, endDate: { $gte: ?0 }}")
    FinancingRoundEntity findActive(DateTime forDate);

    @Query("{}")
    Page<FinancingRoundEntity> financingRounds(Pageable pageable);
}
