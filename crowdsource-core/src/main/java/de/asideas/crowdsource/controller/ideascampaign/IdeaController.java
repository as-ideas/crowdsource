package de.asideas.crowdsource.controller.ideascampaign;

import java.security.Principal;
import java.util.List;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;

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
    public List<Idea> fetchIdeas(@PathVariable String campaignId) {
        return ideaService.fetchIdeasByCampaign(campaignId);
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/ideas_campaigns/{campaignId}/ideas", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Idea createIdea(@Valid @RequestBody Idea cmd, @PathVariable String campaignId, Principal principal) {
        log.info("Going to create idea by cmd: {}", cmd);
        return ideaService.createNewIdea(campaignId, cmd, userByPrincipal(principal));
    }

    private UserEntity userByPrincipal(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }


}
