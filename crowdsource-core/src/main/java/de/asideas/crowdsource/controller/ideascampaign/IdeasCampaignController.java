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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;

import static org.slf4j.LoggerFactory.getLogger;

@RestController
public class IdeasCampaignController {

    private static final Logger log = getLogger(IdeasCampaignController.class);

    @Autowired
    private IdeasCampaignService ideasCampaignService;

    @Autowired
    private UserService userService;

    @Secured(Roles.ROLE_ADMIN)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/ideas_campaigns", consumes = MediaType.APPLICATION_JSON_VALUE)
    public IdeasCampaign createIdeasCampaign(@Valid @RequestBody IdeasCampaign cmd, Principal principal) {
        log.info("Going to create ideas campaign by cmd: {}", cmd);
        return ideasCampaignService.createCampaign(cmd, userByPrincipal(principal));
    }

 /*   @Secured(Roles.ROLE_ADMIN)
    @PutMapping(value = "/ideas_campaigns", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
     public List<IdeasCampaign> loadIdeasCampaigns(){
        return ideasCampaignService.allCampaigns();
    }
*/
    @Secured(Roles.ROLE_USER)
    @GetMapping(value = "/ideas_campaigns", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<IdeasCampaign> loadIdeasCampaigns(){
        return ideasCampaignService.allCampaigns();
    }

    private UserEntity userByPrincipal(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

}
