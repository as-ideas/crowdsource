package de.asideas.crowdsource.repository.ideascampaign;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;

public interface IdeaRepository extends MongoRepository<IdeaEntity, String> {

    List<IdeaEntity> findByCampaignId(String campaignId);
}

