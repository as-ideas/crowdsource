package de.asideas.crowdsource.repository;

import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FinancingRoundRepository extends JpaRepository<FinancingRoundEntity, Long> {

    @Query("select f from FinancingRoundEntity f where f.startDate < :forDate and f.endDate > :forDate ")
    FinancingRoundEntity findActive(@Param("forDate") DateTime forDate);
}
