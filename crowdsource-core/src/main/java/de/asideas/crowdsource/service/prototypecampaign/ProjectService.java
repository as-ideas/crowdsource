package de.asideas.crowdsource.service.prototypecampaign;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.prototypecampaign.AttachmentValue;
import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.LikeEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.domain.shared.LikeStatus;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Attachment;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.repository.prototypecampaign.LikeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.PledgeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectAttachmentRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.security.Roles;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import static de.asideas.crowdsource.domain.shared.LikeStatus.LIKE;
import static de.asideas.crowdsource.domain.shared.LikeStatus.UNLIKE;
import static java.util.stream.Collectors.toList;

@Service
public class ProjectService {

    private static final Logger LOG = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectAttachmentRepository projectAttachmentRepository;
    private final ProjectRepository projectRepository;
    private final PledgeRepository pledgeRepository;
    private final UserRepository userRepository;
    private final FinancingRoundRepository financingRoundRepository;
    private final UserNotificationService userNotificationService;
    private final FinancingRoundService financingRoundService;
    private final LikeRepository likeRepository;

    private final ProjectService thisInstance;

    @Autowired
    public ProjectService(ProjectRepository projectRepository,
                          PledgeRepository pledgeRepository,
                          UserRepository userRepository,
                          FinancingRoundRepository financingRoundRepository,
                          UserNotificationService userNotificationService,
                          FinancingRoundService financingRoundService,
                          LikeRepository likeRepository,
                          ProjectAttachmentRepository projectAttachmentRepository) {

        this.projectRepository = projectRepository;
        this.pledgeRepository = pledgeRepository;
        this.userRepository = userRepository;
        this.financingRoundRepository = financingRoundRepository;
        this.userNotificationService = userNotificationService;
        this.financingRoundService = financingRoundService;
        this.projectAttachmentRepository = projectAttachmentRepository;
        this.likeRepository = likeRepository;
        this.thisInstance = this;

    }

    public Project getProject(String projectId, UserEntity requestingUser) {
        return project(loadProjectEntity(projectId), requestingUser);
    }

    public List<Project> getProjects(UserEntity requestingUser) {

        final List<ProjectEntity> projects = projectRepository.findAll();
        return projects.stream().map(p -> project(p, requestingUser)).collect(toList());
    }

    public Project addProject(Project project, UserEntity creator) {
        Assert.notNull(project);
        Assert.notNull(creator);

        ProjectEntity projectEntity = new ProjectEntity(creator, project, currentFinancingRound());
        projectEntity = projectRepository.save(projectEntity);

        notifyAdminsOnNewProject(projectEntity);

        LOG.debug("Project added: {}", projectEntity);
        return project(projectEntity, creator);
    }

    public Project modifyProjectStatus(String projectId, ProjectStatus newStatusToApply, UserEntity requestingUser) {
        ProjectEntity projectEntity = loadProjectEntity(projectId);

        if (projectEntity.modifyStatus(newStatusToApply)) {
            projectEntity = projectRepository.save(projectEntity);
            userNotificationService.notifyCreatorOnProjectStatusUpdate(projectEntity);
        }

        return project(projectEntity, requestingUser);
    }

    public Project modifyProjectMasterdata(String projectId, Project modifiedProject, UserEntity requestingUser) {
        ProjectEntity projectEntity = loadProjectEntity(projectId);

        if (projectEntity.modifyMasterdata(modifiedProject, requestingUser)) {
            projectEntity = projectRepository.save(projectEntity);
            userNotificationService.notifyCreatorAndAdminOnProjectModification(projectEntity, requestingUser);
            LOG.debug("Project updated: {}", projectEntity);
        }

        return project(projectEntity, requestingUser);
    }

    public void pledge(String projectId, UserEntity userEntity, Pledge pledge) {

        ProjectEntity projectEntity = loadProjectEntity(projectId);

        FinancingRoundEntity financingRound = financingRoundService.mostRecentRoundEntity();
        if (financingRound != null &&
                financingRound.terminated() &&
                financingRound.getTerminationPostProcessingDone() &&
                userEntity.getRoles().contains(Roles.ROLE_ADMIN)) {

            if (!financingRound.idenitityEquals(projectEntity.getFinancingRound())) {
                throw InvalidRequestException.projectTookNotPartInLastFinancingRond();
            }
            thisInstance.pledgeProjectUsingPostRoundBudget(projectEntity, userEntity, pledge);
        } else {
            thisInstance.pledgeProjectInFinancingRound(projectEntity, userEntity, pledge);
        }
    }

    public Attachment addProjectAttachment(String projectId, Attachment attachment, UserEntity savingUser) {
        ProjectEntity projectEntity = loadProjectEntity(projectId);

        projectEntity.addAttachmentAllowed(savingUser);

        AttachmentValue attachmentStored = new AttachmentValue(attachment.getName(), attachment.getType());
        attachmentStored = projectAttachmentRepository.storeAttachment(attachmentStored, attachment.getPayload());
        projectEntity.addAttachment(attachmentStored);
        projectRepository.save(projectEntity);
        return Attachment.asResponseWithoutPayload(attachmentStored, projectEntity);
    }

    public Attachment loadProjectAttachment(String projectId, Attachment attachmentRequest) {
        final ProjectEntity project = loadProjectEntity(projectId);

        final AttachmentValue attachment2Serve = project.findAttachmentByReference(attachmentRequest);
        final InputStream payload = projectAttachmentRepository.loadAttachment(attachment2Serve);

        if (payload == null) {
            LOG.error("A project's attachment file entry's actual binary data couldn't be found: " +
                    "projectId:{}; fileAttachmentMissing: {}", projectId, attachment2Serve);
            throw new ResourceNotFoundException();
        }

        return Attachment.asResponse(attachment2Serve, project, payload);
    }

    public void deleteProjectAttachment(String projectId, Attachment attachmentRequest, UserEntity deletingUser) {
        final ProjectEntity project = loadProjectEntity(projectId);
        final AttachmentValue attachment2Delete = project.findAttachmentByReference(attachmentRequest);

        project.deleteAttachmentAllowed(deletingUser);

        projectAttachmentRepository.deleteAttachment(attachment2Delete);
        project.deleteAttachment(attachment2Delete);
        projectRepository.save(project);
    }

    public void likeProject(String projectId, UserEntity user) {
        final ProjectEntity project = projectRepository.findOne(projectId);
        toggleStatus(project, user, LIKE);
    }

    public void unlikeProject(String projectId, UserEntity user) {
        final ProjectEntity project = projectRepository.findOne(projectId);
        toggleStatus(project, user, UNLIKE);
    }

    void pledgeProjectInFinancingRound(ProjectEntity projectEntity, UserEntity userEntity, Pledge pledge) {
        List<PledgeEntity> pledgesSoFar = pledgeRepository.findByProjectAndFinancingRound(
                projectEntity, projectEntity.getFinancingRound());

        // potential problem: race condition. Two simultaneous requests could lead to "over-pledging"
        PledgeEntity pledgeEntity = projectEntity.pledge(
                pledge, userEntity, pledgesSoFar);

        // potential problem: no transaction -> no rollback -- Possible Solution -> sort of mini event sourcing?
        if (projectEntity.pledgeGoalAchieved()) {
            projectRepository.save(projectEntity);
        }
        userRepository.save(userEntity);
        pledgeRepository.save(pledgeEntity);

        LOG.debug("Project pledged: {}", pledgeEntity);
    }

    void pledgeProjectUsingPostRoundBudget(ProjectEntity projectEntity, UserEntity userEntity, Pledge pledge) {
        FinancingRoundEntity financingRound = projectEntity.getFinancingRound();

        List<PledgeEntity> postRoundPledges = pledgeRepository.findByFinancingRoundAndCreatedDateGreaterThan(
                financingRound, financingRound.getEndDate());

        int postRoundPledgableBudget = financingRound.postRoundPledgableBudgetRemaining(postRoundPledges);

        List<PledgeEntity> pledgesSoFar = pledgeRepository.findByProjectAndFinancingRound(
                projectEntity, projectEntity.getFinancingRound());

        PledgeEntity pledgeResult = projectEntity.pledgeUsingPostRoundBudget(
                pledge, userEntity, pledgesSoFar, postRoundPledgableBudget);

        if (projectEntity.pledgeGoalAchieved()) {
            projectRepository.save(projectEntity);
        }
        userRepository.save(userEntity);
        pledgeRepository.save(pledgeResult);

        LOG.debug("Project pledged using post round budget: {}", pledgeResult);
    }

    protected ProjectEntity loadProjectEntity(String projectId) {
        ProjectEntity projectEntity = projectRepository.findOne(projectId);
        if (projectEntity == null) {
            throw new ResourceNotFoundException();
        }
        return projectEntity;
    }

    private Project project(ProjectEntity projectEntity, UserEntity requestingUser) {
        List<PledgeEntity> pledges = pledgeRepository.findByProjectAndFinancingRound(projectEntity, projectEntity.getFinancingRound());
        final Optional<LikeEntity> likeEntity = likeRepository.findOneByProjectAndUser(projectEntity, requestingUser);
        final long likeCount = likeRepository.countByProjectAndStatus(projectEntity, LIKE);
        return new Project(projectEntity, pledges, requestingUser, likeCount, likeEntity.map(LikeEntity::getStatus).orElse(UNLIKE));
    }

    private FinancingRoundEntity currentFinancingRound() {
        return financingRoundRepository.findActive(DateTime.now());
    }

    private void notifyAdminsOnNewProject(final ProjectEntity projectEntity) {
        userRepository.findAllAdminUsers().stream()
                .map(UserEntity::getEmail)
                .forEach(emailAddress -> userNotificationService.notifyAdminOnProjectCreation(projectEntity, emailAddress));
    }

    private void toggleStatus(ProjectEntity project, UserEntity user, LikeStatus status) {
        final Optional<LikeEntity> likeEntityOptional = likeRepository.findOneByProjectAndUser(project, user);
        if (likeEntityOptional.isPresent()) {
            final LikeEntity likeEntity = likeEntityOptional.get();
            likeEntity.setStatus(status);
            likeRepository.save(likeEntity);
        } else {
            final LikeEntity likeEntity = new LikeEntity(status, project, user);
            likeRepository.save(likeEntity);
        }
    }
}
