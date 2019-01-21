package de.asideas.crowdsource.controller.prototypecampaign;

import de.asideas.crowdsource.presentation.prototypecampaign.Comment;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.prototypecampaign.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@Secured(Roles.ROLE_USER)
@RequestMapping("/project/{projectId}")
public class CommentController {

    @Autowired
    private CommentService commentService;


    @RequestMapping(value = "/comments", method = RequestMethod.GET)
    public List<Comment> comments(@PathVariable String projectId) {
        return commentService.loadCommentsByProject(projectId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/comment", method = RequestMethod.POST)
    public void storeComment(@PathVariable String projectId, Principal principal, @Valid @RequestBody Comment comment) {
        commentService.addComment(comment, projectId, principal.getName());
    }

}
