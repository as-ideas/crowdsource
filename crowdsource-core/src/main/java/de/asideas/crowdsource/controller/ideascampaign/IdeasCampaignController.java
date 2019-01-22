package de.asideas.crowdsource.controller.ideascampaign;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

import static org.slf4j.LoggerFactory.getLogger;

@RestController
public class IdeasCampaignController {

    private static final Logger log = getLogger(IdeasCampaignController.class);

    @PostMapping(value = "/ideas_campaigns", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void createIdeasCampaign(@Valid @RequestBody IdeasCampaign cmd) {

        log.info("Going to create ideas campaign by cmd: {}", cmd);


    }
}
