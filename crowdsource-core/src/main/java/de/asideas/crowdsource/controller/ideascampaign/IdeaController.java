package de.asideas.crowdsource.controller.ideascampaign;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import de.asideas.crowdsource.domain.exception.ForbiddenException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaRejectCmd;
import de.asideas.crowdsource.presentation.ideascampaign.Rating;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;

import static de.asideas.crowdsource.security.Roles.ROLE_ADMIN;
import static de.asideas.crowdsource.security.Roles.ROLE_USER;
import static org.slf4j.LoggerFactory.getLogger;

@RestController
public class IdeaController {

    @Autowired
    private IdeaService ideaService;

    @Autowired
    private UserService userService;

    private static final Logger log = getLogger(IdeaController.class);

    @Secured(Roles.ROLE_USER)
    @GetMapping(value = Paths.IDEAS, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Page<Idea> fetchIdeas(@PathVariable String campaignId,
                                 @RequestParam(value = "page", required = false) Integer page,
                                 @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                 @RequestParam(value = "status", required = false) IdeaStatus status,
                                 Authentication auth, Principal principal ) {

        if (status == null) {
            return ideaService.fetchIdeasByStatus(campaignId, Collections.singleton(IdeaStatus.PUBLISHED), page, pageSize, userByPrincipal(principal));
        }

        if (!auth.getAuthorities().contains(new SimpleGrantedAuthority(ROLE_ADMIN))) {
            throw new ForbiddenException();
        }

        return ideaService.fetchIdeasByStatus(campaignId, Collections.singleton(status), page, pageSize, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @GetMapping(value = Paths.IDEAS_FILTERED, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Page<Idea> fetchIdeasFiltered(@PathVariable String campaignId,
                                 @RequestParam(value = "page", required = false) Integer page,
                                 @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                 @RequestParam(value = "alreadyVoted", required = true) Boolean alreadyVotedFor,
                                 Principal principal ) {

        return ideaService.fetchIdeasByRequestorHasVoted(campaignId, alreadyVotedFor, page, pageSize, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @GetMapping(value = Paths.USERS_IDEAS, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<Idea> fetchIdeasOfCurrentUser(@PathVariable String campaignId, Principal principal) {
        final UserEntity requestor = userByPrincipal(principal);
        return ideaService.fetchIdeasByCampaignAndCreator(campaignId, requestor, requestor);
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = Paths.IDEAS, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Idea createIdea(@Valid @RequestBody Idea cmd, @PathVariable String campaignId, Principal principal) {
        log.info("Going to create idea by cmd: {}", cmd);
        return ideaService.createNewIdea(campaignId, cmd, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @PutMapping(value = Paths.IDEA, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Idea modifyIdea(@Valid @RequestBody Idea cmd, @PathVariable String campaignId, @PathVariable String ideaId, Principal principal) {
        log.info("Going to modify idea by cmd: {}", cmd);
        return ideaService.modifyIdea(ideaId, cmd, userByPrincipal(principal));
    }

    @Secured(ROLE_ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(value = Paths.IDEA_APPROVAL)
    public void approveIdea(@PathVariable String campaignId, @PathVariable String ideaId, Principal principal) {
        log.info("Going to approve ideaId={}", ideaId);
        ideaService.approveIdea(campaignId, ideaId, userByPrincipal(principal));
    }

    @Secured(ROLE_ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(value = Paths.IDEA_REJECTION, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void rejectIdea(@PathVariable String campaignId, @PathVariable String ideaId, @Valid @RequestBody IdeaRejectCmd cmd, Principal principal) {
        log.info("Going to approve ideaId={}", ideaId);
        ideaService.rejectIdea(campaignId, ideaId, cmd.getRejectionComment(), userByPrincipal(principal));
    }

    @Secured(ROLE_USER)
    @PutMapping(value = Paths.IDEA_VOTES, consumes = MediaType.APPLICATION_JSON_VALUE)
    public Rating voteForIdea(@PathVariable String campaignId, @PathVariable String ideaId, @Valid @RequestBody VoteCmd cmd, Principal principal) {
        log.info("Going to vote={} on ideaId={}", cmd.getVote(), ideaId);
        cmd.setIdeaId(ideaId);
        final UserEntity voter = userByPrincipal(principal);
        ideaService.voteForIdea(cmd, voter);

        Idea idea = ideaService.fetchIdea(ideaId, voter);

        return idea.getRating();
    }


    private UserEntity userByPrincipal(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

}
