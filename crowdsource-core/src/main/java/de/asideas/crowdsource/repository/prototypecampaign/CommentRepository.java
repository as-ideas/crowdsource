package de.asideas.crowdsource.repository.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<CommentEntity, String>, CommentRepositoryCustom {

    List<CommentEntity> findByProject(ProjectEntity projectEntity);

}
