package de.asideas.crowdsource.service;

import de.asideas.crowdsource.domain.model.CommentEntity;
import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.Comment;
import de.asideas.crowdsource.presentation.project.Project;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.repository.CommentRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CommentServiceTest {

    public static final String EXISTING_USER_MAIL = "test.name@test.de";
    private final static String EXISTING_PROJECT_ID = "TEST_PROJECT_ID";

    private ProjectEntity projectEntity;
    private UserEntity userEntity;
    private CommentEntity aComment;

    @InjectMocks
    private CommentService commentService;

    @Mock
    private ProjectService projectService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserNotificationService userNotificationService;

    @Mock
    private UserService userService;


    @Before
    public void init(){
        reset(projectService, userService, commentRepository);
        projectEntity = new ProjectEntity(userEntity, new Project(), new FinancingRoundEntity());
        userEntity = new UserEntity("test.name@test.de", "password", "Karl", "Ranseier");
        aComment = new CommentEntity(projectEntity, userEntity, "some comment");
    }

    @Test
    public void addComment_ShouldPersistCommentAndNotifyCreator() throws Exception {
        Comment comment = new Comment(null, null, "Awesome project, dude!");

        prepareProjectServiceMock();
        prepareUserServiceMock();

        commentService.addComment(comment, EXISTING_PROJECT_ID, EXISTING_USER_MAIL);

        final CommentEntity expectedComment2BPersisted = new CommentEntity(projectEntity, userEntity, comment.getComment());
        verify(commentRepository).save(expectedComment2BPersisted);
        verify(userNotificationService).notifyCreatorOnComment(expectedComment2BPersisted);
    }

    @Test
    public void loadCommentsByProject_ShouldReturnViewRepresentation() throws Exception {
        prepareProjectServiceMock();
        prepareCommentRepositoryMock();

        final List<Comment> res = commentService.loadCommentsByProject(EXISTING_PROJECT_ID);

        assertThat(res.size(), is(1));
        assertThat(res.get(0), is(new Comment(aComment)));
    }

    private void prepareUserServiceMock() {
        when(userService.getUserByEmail(EXISTING_USER_MAIL)).thenReturn(userEntity);
    }

    private void prepareCommentRepositoryMock() {
        when(commentRepository.findByProject(projectEntity)).thenReturn(Collections.singletonList(aComment));
    }

    private void prepareProjectServiceMock() {
        when(projectService.loadProjectEntity(EXISTING_PROJECT_ID)).thenReturn(projectEntity);
    }
}