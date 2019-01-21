package de.asideas.crowdsource.controller.prototypecampaign;

import com.fasterxml.jackson.annotation.JsonView;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.presentation.prototypecampaign.project.PublicFinancingRoundInformationView;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.prototypecampaign.FinancingRoundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class FinancingRoundController {

    @Autowired
    private FinancingRoundService financingRoundService;

    @Secured(Roles.ROLE_ADMIN)
    @RequestMapping(value = "/financingrounds", method = RequestMethod.GET)
    public List<FinancingRound> allFinancingRounds() {
        return financingRoundService.allFinancingRounds();
    }

    @JsonView(PublicFinancingRoundInformationView.class)
    @RequestMapping(value = "/financingrounds/active", method = RequestMethod.GET)
    @Secured({Roles.ROLE_USER, Roles.ROLE_ADMIN})
    public FinancingRound getActive() {
        return financingRoundService.currentlyActiveRound();
    }

    @JsonView(PublicFinancingRoundInformationView.class)
    @RequestMapping(value = "/financingrounds/mostRecent", method = RequestMethod.GET)
    @Secured({Roles.ROLE_USER, Roles.ROLE_ADMIN})
    public FinancingRound getMostRecent() {
        return financingRoundService.mostRecentRound();
    }

    @Secured(Roles.ROLE_ADMIN)
    @RequestMapping(value = "financingrounds", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public FinancingRound startFinancingRound(@Valid @RequestBody FinancingRound financingRound) {
        return financingRoundService.startNewFinancingRound(financingRound);
    }

    @Secured(Roles.ROLE_ADMIN)
    @RequestMapping(value = "financingrounds/{id}/cancel", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.OK)
    public FinancingRound stopFinancingRound(@PathVariable String id) {
        return financingRoundService.stopFinancingRound(id);
    }

}
