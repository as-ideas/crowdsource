package de.asideas.crowdsource.repository.ideascampaign;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;

public interface VoteRepository extends MongoRepository<VoteEntity, VoteId> {

    List<VoteEntity> findByIdIdeaId(String ideaId);
}
