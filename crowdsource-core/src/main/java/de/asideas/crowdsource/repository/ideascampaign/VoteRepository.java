package de.asideas.crowdsource.repository.ideascampaign;

import org.springframework.data.mongodb.repository.MongoRepository;

import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;

public interface VoteRepository extends MongoRepository<VoteEntity, VoteId> {

}
