package de.asideas.crowdsource.repository.ideascampaign;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;

public interface IdeaRepository extends MongoRepository<IdeaEntity, String> {

    Page<IdeaEntity> findByCampaignId(String campaignId, Pageable pageable);

    List<IdeaEntity> findByCampaignIdAndCreator(String campaignId, UserEntity creator);

    Page<IdeaEntity> findByCampaignIdAndStatusIn(String campaignId, Set<IdeaStatus> status, PageRequest pReq);

    Page<IdeaEntity> findByCampaignIdAndStatusAndIdIn(String campaignId, IdeaStatus published, Set<String> ideaIds, PageRequest capture);

    Page<IdeaEntity> findByCampaignIdAndStatusAndIdNotIn(String campaignId, IdeaStatus published, Set<String> ideaIds, PageRequest calcPageRequest);
}

