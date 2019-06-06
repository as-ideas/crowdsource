package de.asideas.crowdsource.service.ideascampaign;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.service.ideascampaign.VotingService;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaIn;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaOut;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.repository.UserRepository;

import de.asideas.crowdsource.service.translation.TranslationService;
import org.slf4j.Logger;
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
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;
import de.asideas.crowdsource.security.Roles;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * Application service, provding use cases around {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity}ies of
 * {@link de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity}ies.
 */
@Service
public class IdeaService {

    private static final Logger log = getLogger(IdeaService.class);

    static final int DEFAULT_PAGE_SIZE = 20;
    static final int MAX_PAGE_SIZE = 200;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private VotingService votingService;

    @Autowired
    private VoteRepository voteRepository;

    public IdeaOut fetchIdea(String ideaId, UserEntity requestor) {
        Assert.notNull(ideaId, "ideaId must not be null");
        validateIdeaExists(ideaId);

        return toIdea(ideaRepository.findOne(ideaId), requestor);
    }

    public Page<IdeaOut> fetchIdeasByStatus(String campaignId, Set<IdeaStatus> statusSet, Integer page, Integer pageSize, UserEntity requestor) {
        Assert.notNull(campaignId, "campaignId must not be null");

        final Page<IdeaEntity> dbRes = ideaRepository.findByCampaignIdAndStatusIn(
                campaignId,
                statusSet,
                calcPageRequest(page, pageSize)
        );
        return new PageImpl<>(toIdeas(dbRes.getContent(), requestor), calcPageRequest(page, pageSize), dbRes.getTotalElements());
    }

    public Page<IdeaOut> fetchIdeasByRequestorHasVoted(String campaignId, boolean hasVoted, Integer page, Integer pageSize, UserEntity requestor) {
        Assert.notNull(campaignId, "campaignId must not be null");

        final Set<String> ideaIds = voteRepository.findIdsByVoterId(requestor.getId()).stream().map(el -> el.getId().getIdeaId()).collect(Collectors.toSet());

        final Page<IdeaEntity> dbRes;
        if (hasVoted) {
            dbRes = ideaRepository.findByCampaignIdAndStatusAndIdIn(
                    campaignId,
                    IdeaStatus.PUBLISHED,
                    ideaIds,
                    calcPageRequest(page, pageSize)
            );
        } else {
            dbRes = ideaRepository.findByCampaignIdAndStatusAndIdNotIn(
                    campaignId,
                    IdeaStatus.PUBLISHED,
                    ideaIds,
                    calcPageRequest(page, pageSize)
            );
        }
        return new PageImpl<>(toIdeas(dbRes.getContent(), requestor), calcPageRequest(page, pageSize), dbRes.getTotalElements());
    }

    public List<IdeaOut> fetchIdeasByCampaignAndCreator(String campaignId, UserEntity creator, UserEntity requestor) {
        Assert.notNull(campaignId, "campaignId must not be null");
        Assert.notNull(creator, "creator must not be null");
        return toIdeas(ideaRepository.findByCampaignIdAndCreator(campaignId, creator), requestor);
    }

    public IdeaOut createNewIdea(String campaignId, IdeaIn cmd, UserEntity creator) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.notNull(campaignId, "CampaignId must not be null.");
        Assert.notNull(creator, "Creator must not be null.");

        validateCampaignExists(campaignId);
        final IdeasCampaignEntity campaign = ideasCampaignRepository.findOne(campaignId);
        final IdeaEntity result = campaign.createIdea(cmd, creator);

        // TODO: Fix according to translation concept
        log.info("Create new idea: campaign: " + campaign.toString());
        notifyAdminsOnNewIdea(result, campaign.getContent().getDe().getTitle());
        return new IdeaOut(ideaRepository.save(result));
    }

    public IdeaOut modifyIdea(String ideaId, IdeaIn cmd, UserEntity requestingUser) {
        Assert.notNull(cmd, "cmd must not be null.");
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.notNull(requestingUser, "user must not be null.");

        validateIdeaExists(ideaId);

        final IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        checkRequestorIsOwner(requestingUser, existingIdea);
        existingIdea.getContent().getOriginal().setPitch(cmd.getPitch());

        return new IdeaOut(ideaRepository.save(existingIdea));
    }

    public void approveIdea(String campaignId, String ideaId, UserEntity approvingAdmin) {
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null.");

        checkRequestorIsAdmin(approvingAdmin);
        validateCampaignExists(campaignId);
        validateIdeaExists(ideaId);

        final IdeasCampaignEntity campaign = ideasCampaignRepository.findOne(campaignId);
        final IdeaEntity existingIdea = ideaRepository.findOne(ideaId);
        campaign.approveIdea(existingIdea, approvingAdmin);

        userNotificationService.notifyCreatorOnIdeaAccepted(existingIdea, campaign.getContent().getDe().getTitle());

        // try to translate incoming idea
        translationService.translateIdea(existingIdea);

        ideaRepository.save(existingIdea);
    }

    public void rejectIdea(String campaignId, String ideaId, String rejectionComment, UserEntity approvingAdmin) {
        Assert.hasText(ideaId, "ideaId must not be null.");
        Assert.hasText(rejectionComment, "rejectionComment must not be null");
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null.");

        checkRequestorIsAdmin(approvingAdmin);
        validateIdeaExists(ideaId);
        validateCampaignExists(campaignId);

        final IdeasCampaignEntity campaign = ideasCampaignRepository.findOne(campaignId);
        final IdeaEntity ideaToReject = ideaRepository.findOne(ideaId);
        campaign.rejectIdea(ideaToReject, approvingAdmin, rejectionComment);

        userNotificationService.notifyCreatorOnIdeaRejected(ideaToReject, rejectionComment, campaign.getContent().getDe().getTitle());
        ideaRepository.save(ideaToReject);
    }

    public void voteForIdea(VoteCmd voteCmd, UserEntity voter) {
        Assert.notNull(voteCmd.getIdeaId(), "ideaId must not be null");
        Assert.notNull(voter, "voter must not be null");

        validateIdeaExists(voteCmd.getIdeaId());
        final IdeaEntity idea = ideaRepository.findOne(voteCmd.getIdeaId());

        votingService.voteForIdea(idea, ideasCampaignRepository.findOne(idea.getCampaignId()), voter, voteCmd.getVote());
    }


    private void notifyAdminsOnNewIdea(final IdeaEntity ideaEntity, String campaignTitle) {
        userRepository.findAllAdminUsers().stream()
                .map(UserEntity::getEmail)
                .forEach(emailAddress -> userNotificationService.notifyAdminOnIdeaCreation(ideaEntity, emailAddress, campaignTitle));
    }

    private List<IdeaOut> toIdeas(List<IdeaEntity> res, UserEntity requestor) {
        return res.stream().map(idea -> toIdea(idea, requestor)).collect(Collectors.toList());
    }

    private IdeaOut toIdea(IdeaEntity res, UserEntity requestor) {
        List<VoteEntity> votes = voteRepository.findByIdIdeaId(res.getId());
        return new IdeaOut(res, votes, requestor);
    }

    private void checkRequestorIsOwner(UserEntity requestingUser, IdeaEntity existingIdea) {
        if (!existingIdea.getCreator().equals(requestingUser)) {
            throw new AuthorizationServiceException("User is not owner of this idea");
        }
    }

    private void checkRequestorIsAdmin(UserEntity requestingUser) {
        if (!requestingUser.getRoles().contains(Roles.ROLE_ADMIN)) {
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

    private PageRequest calcPageRequest(Integer page, Integer pageSize) {
        PageRequest pReq;
        if (page != null && pageSize != null) {
            pReq = new PageRequest(page, pageSize > MAX_PAGE_SIZE ? DEFAULT_PAGE_SIZE : pageSize);
        } else {
            pReq = new PageRequest(0, DEFAULT_PAGE_SIZE);
        }
        return pReq;
    }
}
