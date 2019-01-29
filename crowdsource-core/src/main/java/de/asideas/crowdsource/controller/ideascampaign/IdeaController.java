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
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;

import static de.asideas.crowdsource.security.Roles.ROLE_ADMIN;
import static org.slf4j.LoggerFactory.getLogger;

@RestController
public class IdeaController {

    @Autowired
    private IdeaService ideaService;

    @Autowired
    private UserService userService;

    private static final Logger log = getLogger(IdeaController.class);

    @Secured(Roles.ROLE_USER)
    @GetMapping(value = "/ideas_campaigns/{campaignId}/ideas", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Page<Idea> fetchIdeas(@PathVariable String campaignId,
                                 @RequestParam(value = "page", required = false) Integer page,
                                 @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                 @RequestParam(value = "status", required = false) IdeaStatus status,
                                 Authentication auth) {

        if (status == null) {
            return ideaService.fetchIdeasByStatus(campaignId, Collections.singleton(IdeaStatus.PUBLISHED), page, pageSize);
        }

        if (!auth.getAuthorities().contains(new SimpleGrantedAuthority(ROLE_ADMIN))) {
            throw new ForbiddenException();
        }

        return ideaService.fetchIdeasByStatus(campaignId, Collections.singleton(status), page, pageSize);
    }

    @Secured(Roles.ROLE_USER)
    @GetMapping(value = "/ideas_campaigns/{campaignId}/my_ideas", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<Idea> fetchIdeasOfCurrentUser(@PathVariable String campaignId, Principal principal) {
        return ideaService.fetchIdeasByCampaignAndUser(campaignId, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/ideas_campaigns/{campaignId}/ideas", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Idea createIdea(@Valid @RequestBody Idea cmd, @PathVariable String campaignId, Principal principal) {
        log.info("Going to create idea by cmd: {}", cmd);
        return ideaService.createNewIdea(campaignId, cmd, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @PutMapping(value = "/ideas_campaigns/{campaignId}/ideas/{ideaId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Idea modifyIdea(@Valid @RequestBody Idea cmd, @PathVariable String campaignId, @PathVariable String ideaId, Principal principal) {
        log.info("Going to modify idea by cmd: {}", cmd);
        return ideaService.modifyIdea(ideaId, cmd, userByPrincipal(principal));
    }

    @Secured(ROLE_ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(value = "/ideas_campaigns/{campaignId}/ideas/{ideaId}/approval")
    public void approveIdea(@PathVariable String campaignId, @PathVariable String ideaId, Principal principal) {
        log.info("Going to approve ideaId={}", ideaId);
        ideaService.approveIdea(ideaId, userByPrincipal(principal));
    }

    @Secured(ROLE_ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(value = "/ideas_campaigns/{campaignId}/ideas/{ideaId}/rejection", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void rejectIdea(@PathVariable String campaignId, @PathVariable String ideaId, @Valid @RequestBody IdeaRejectCmd cmd, Principal principal) {
        log.info("Going to approve ideaId={}", ideaId);
        ideaService.rejectIdea(ideaId, cmd.getRejectionComment(), userByPrincipal(principal));
    }

    private UserEntity userByPrincipal(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

}
