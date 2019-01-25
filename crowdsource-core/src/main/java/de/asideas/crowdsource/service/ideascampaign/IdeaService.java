package de.asideas.crowdsource.service.ideascampaign;

import java.util.List;
import java.util.stream.Collectors;

import de.asideas.crowdsource.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;

/**
 * Application service, provding use cases around {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity}ies of
 * {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity}ies.
 */
@Service
public class IdeaService {

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;

    public Idea createNewIdea(String campaignId, Idea cmd, UserEntity creator) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.notNull(campaignId, "CampaignId must not be null.");
        Assert.notNull(creator, "Creator must not be null.");

        validateCampaignExists(campaignId);

        final IdeaEntity result = IdeaEntity.createIdeaEntity(cmd, campaignId, creator);
        return new Idea(ideaRepository.save(result));
    }

    public Idea modifyIdea(String ideaId, Idea cmd, UserEntity requestingUser) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.notNull(requestingUser, "user must not be null.");

        validateIdeaExists(ideaId);

        IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        checkModificationAllowed(requestingUser, existingIdea);

        return new Idea(ideaRepository.save(existingIdea.modifyIdeaPitch(cmd.getPitch())));
    }

    private void checkModificationAllowed(UserEntity requestingUser, IdeaEntity existingIdea) {
        if (!existingIdea.getCreator().equals(requestingUser)) {
            throw new AuthorizationServiceException("User is not owner of this idea");
        }
    }

    private void validateCampaignExists(String campaignId) throws ResourceNotFoundException {
        if (!ideasCampaignRepository.exists(campaignId)) {
            throw new ResourceNotFoundException();
        }
    }

    private void validateIdeaExists(String ideaId) throws ResourceNotFoundException {
        if (!ideaRepository.exists(ideaId)) {
            throw new ResourceNotFoundException();
        }
    }

    public List<Idea> fetchIdeasByCampaign(String campaignId) {
        Assert.notNull(campaignId, "campaignId must not be null");
        return ideaRepository.findByCampaignId(campaignId).stream().map(Idea::new).collect(Collectors.toList());
    }

}
