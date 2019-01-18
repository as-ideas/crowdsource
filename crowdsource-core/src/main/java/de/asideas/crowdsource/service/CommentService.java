package de.asideas.crowdsource.service;

import de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.Comment;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private CommentRepository commentRepository;
    private ProjectService projectService;
    private UserService userService;
    private UserNotificationService userNotificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository, ProjectService projectService, UserService userService, UserNotificationService userNotificationService) {
        this.commentRepository = commentRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.userNotificationService = userNotificationService;
    }

    public void addComment(Comment comment, String projectId, String commentingUserEmail) {
        final ProjectEntity project = projectService.loadProjectEntity(projectId);
        final UserEntity commentingUser = userService.getUserByEmail(commentingUserEmail);
        CommentEntity commentEntity = new CommentEntity(project, commentingUser, comment.getComment());
        commentRepository.save(commentEntity);

        userNotificationService.notifyCreatorOnComment(commentEntity);
    }

    public List<Comment> loadCommentsByProject(String projectId) {
        final ProjectEntity project = projectService.loadProjectEntity(projectId);
        return commentRepository.findByProject(project).stream().map(Comment::new).collect(Collectors.toList());
    }
}
