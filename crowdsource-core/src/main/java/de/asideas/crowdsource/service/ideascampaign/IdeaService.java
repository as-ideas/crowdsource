package de.asideas.crowdsource.service.ideascampaign;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.security.Roles;

/**
 * Application service, provding use cases around {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity}ies of
 * {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity}ies.
 */
@Service
public class IdeaService {

    private static final int DEFAULT_PAGE_SIZE = 500;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationService userNotificationService;


    public Idea createNewIdea(String campaignId, Idea cmd, UserEntity creator) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.notNull(campaignId, "CampaignId must not be null.");
        Assert.notNull(creator, "Creator must not be null.");

        validateCampaignExists(campaignId);

        final IdeaEntity result = IdeaEntity.createIdeaEntity(cmd, campaignId, creator);

        notifyAdminsOnNewIdea(result);
        return new Idea(ideaRepository.save(result));
    }

    public Idea modifyIdea(String ideaId, Idea cmd, UserEntity requestingUser) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.notNull(requestingUser, "user must not be null.");

        validateIdeaExists(ideaId);

        final IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        checkRequestorIsOwner(requestingUser, existingIdea);

        return new Idea(ideaRepository.save(existingIdea.modifyIdeaPitch(cmd.getPitch())));
    }

    public void approveIdea(String ideaId, UserEntity approvingAdmin) {
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null.");

        checkRequestorIsAdmin(approvingAdmin);
        validateIdeaExists(ideaId);

        final IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        existingIdea.approveIdea(approvingAdmin);

        userNotificationService.notifyCreatorOnIdeaAccepted(existingIdea);

        ideaRepository.save(existingIdea);
    }

    public void rejectIdea(String ideaId, String rejectionComment, UserEntity approvingAdmin) {
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.hasText(rejectionComment, "rejectionComment must not be null");
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null.");

        checkRequestorIsAdmin(approvingAdmin);
        validateIdeaExists(ideaId);

        final IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        existingIdea.rejectIdea(approvingAdmin, rejectionComment);

        userNotificationService.notifyCreatorOnIdeaRejected(existingIdea, rejectionComment);

        ideaRepository.save(existingIdea);
    }

    public Page<Idea> fetchIdeasByStatus(String campaignId, Set<IdeaStatus> statusSet, Integer page, Integer pageSize) {
        Assert.notNull(campaignId, "campaignId must not be null");

        final PageRequest pReq;
        if (page != null && pageSize != null) {
            pReq = new PageRequest(page, pageSize > DEFAULT_PAGE_SIZE ? DEFAULT_PAGE_SIZE : pageSize);
        }else {
            pReq= new PageRequest(0, DEFAULT_PAGE_SIZE);
        }

        final Page<IdeaEntity> dbRes = ideaRepository.findByCampaignIdAndStatusIn(
            campaignId,
            statusSet,
            pReq
        );
        return new PageImpl<>(toIdeas(dbRes.getContent()), pReq, dbRes.getTotalElements());
    }

    public List<Idea> fetchIdeasByCampaignAndUser(String campaignId, UserEntity creator) {
        Assert.notNull(campaignId, "campaignId must not be null");
        Assert.notNull(creator, "creator must not be null");
        return toIdeas(ideaRepository.findByCampaignIdAndCreator(campaignId, creator));
    }


    private void notifyAdminsOnNewIdea(final IdeaEntity ideaEntity) {
        userRepository.findAllAdminUsers().stream()
                .map(UserEntity::getEmail)
                .forEach(emailAddress -> userNotificationService.notifyAdminOnIdeaCreation(ideaEntity, emailAddress));
    }

    private List<Idea> toIdeas(List<IdeaEntity> res) {
        return res.stream().map(Idea::new).collect(Collectors.toList());
    }

    private void checkRequestorIsOwner(UserEntity requestingUser, IdeaEntity existingIdea) {
        if (!existingIdea.getCreator().equals(requestingUser)) {
            throw new AuthorizationServiceException("User is not owner of this idea");
        }
    }

    private void checkRequestorIsAdmin(UserEntity requestingUser) {
        if ( !requestingUser.getRoles().contains(Roles.ROLE_ADMIN) ) {
            throw new AuthorizationServiceException("Requested functionality rquires admin access");
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


}
