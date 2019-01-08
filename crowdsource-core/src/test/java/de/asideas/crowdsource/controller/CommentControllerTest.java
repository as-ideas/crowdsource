package de.asideas.crowdsource.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.domain.exception.NotAuthorizedException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.Comment;
import de.asideas.crowdsource.service.CommentService;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.Resource;
import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = CommentControllerTest.Config.class)
public class CommentControllerTest {

    public static final String EXISTING_USER_MAIL = "test.name@test.de";
    public static final String NON_EXISTING_USER_MAIL = "i_dont_exist@test.de";
    private final static String EXISTING_PROJECT_ID = "TEST_PROJECT_ID";
    private final static String NON_EXISTING_PROJECT_ID = "I_DONT_EXIST";
    private final ObjectMapper mapper = new ObjectMapper();

    private Comment aComment;

    @Autowired
    private CommentService commentService;

    @Resource
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Before
    public void init() {

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        reset(commentService);

        final UserEntity userEntity = new UserEntity("test.name@test.de", "password", "Franz", "Ferdinant");

        aComment = new Comment(new DateTime(), userEntity.fullNameFromEmail(), "some comment");
        when(commentService.loadCommentsByProject(EXISTING_PROJECT_ID)).thenReturn(Collections.singletonList(aComment));
    }

    @Test
    public void comments() throws Exception {

        final MvcResult mvcResult = mockMvc.perform(get("/project/" + EXISTING_PROJECT_ID + "/comments"))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(
                mvcResult.getResponse().getContentAsString(),
                is("[{\"created\":" + aComment.getCreated().getMillis()+ ",\"userName\":\"Test Name\",\"comment\":\"some comment\"}]"));

    }

    @Test
    public void storeComment_validComment() throws Exception {

        Comment comment = new Comment();
        comment.setComment("message");
        mockMvc.perform(post("/project/" + EXISTING_PROJECT_ID + "/comment")
                .principal(new UsernamePasswordAuthenticationToken(EXISTING_USER_MAIL, "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(comment)))
                .andExpect(status().isCreated());

        verify(commentService).addComment(comment, EXISTING_PROJECT_ID, EXISTING_USER_MAIL);
    }

    @Test
    public void storeComment_returnsBadRequestOnEmptyCommentMessage() throws Exception {

        Comment comment = new Comment(null, null, "");

        final MvcResult mvcResult = mockMvc.perform(post("/project/" + EXISTING_PROJECT_ID + "/comment")
                .principal(new UsernamePasswordAuthenticationToken(EXISTING_USER_MAIL, "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(comment)))
                .andExpect(status().isBadRequest()).andReturn();

        assertThat(mvcResult.getResponse().getContentAsString(), is("{\"errorCode\":\"field_errors\",\"fieldViolations\":{\"comment\":\"may not be empty\"}}"));

        verify(commentService, never()).addComment(any(Comment.class), any(String.class), any(String.class));
    }

    @Test
    public void storeComment_shouldThrowNotFoundExceptionOnUnknownProjectId() throws Exception {

        Comment comment = new Comment();
        comment.setComment("this is an example comment that respects the length constraint");

        doThrow(new ResourceNotFoundException()).when(commentService).addComment(any(Comment.class), any(String.class), any(String.class));

        mockMvc.perform(post("/project/" + NON_EXISTING_PROJECT_ID + "/comment")
                .principal(new UsernamePasswordAuthenticationToken(EXISTING_USER_MAIL, "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(comment)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void storeComment_ShouldThrowUnauthorizedIfUserNotFound() throws Exception {

        Comment comment = new Comment();
        comment.setComment("this is an example comment that respects the length constraint");

        doThrow(new NotAuthorizedException("No user found with email " + NON_EXISTING_USER_MAIL)).when(commentService)
                .addComment(any(Comment.class), any(String.class), any(String.class));

        mockMvc.perform(post("/project/" + EXISTING_PROJECT_ID + "/comment")
                .principal(new UsernamePasswordAuthenticationToken(NON_EXISTING_USER_MAIL, "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(comment)))
                .andExpect(status().isUnauthorized());
    }

    @Configuration
    @EnableWebMvc
    static class Config {

        @Bean
        public ControllerExceptionAdvice controllerExceptionAdvice() {
            return new ControllerExceptionAdvice();
        }

        @Bean
        public CommentController commentController() {
            return new CommentController();
        }

        @Bean
        public CommentService commentService(){
            return mock(CommentService.class);
        }
    }
}