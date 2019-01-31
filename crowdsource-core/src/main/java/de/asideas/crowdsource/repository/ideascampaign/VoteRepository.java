package de.asideas.crowdsource.repository.ideascampaign;

import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;

public interface VoteRepository extends MongoRepository<VoteEntity, VoteId> {

    List<VoteEntity> findByIdIdeaId(String ideaId);

    /**
     * @param voterId
     * @return the entity object with <code>id</code> field set only
     */
    @Query( value = "{ '_id.voterId': ?0 }", fields = "{'_id': 1}")
    Set<VoteEntity> findIdsByVoterId(String voterId);

    /**
     * @param voterId
     * @return the entity object with <code>id</code> field set only
     */
    @Query( value = "{ '_id.voterId': { $ne: ?0 } }", fields = "{'_id': 1}")
    Set<VoteEntity> findIdsByExcludingVoterId(String voterId);
}
