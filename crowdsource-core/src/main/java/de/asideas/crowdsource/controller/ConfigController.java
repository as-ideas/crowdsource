package de.asideas.crowdsource.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ConfigController {

    private List<String> emailBlacklistPatterns;

    @Autowired
    public ConfigController(
            @Value("#{'${de.asideas.crowdsource.content.email.blacklist.patterns}'.split(',')}") List<String> emailBlacklistPatterns) {

        this.emailBlacklistPatterns = emailBlacklistPatterns;
    }

    private ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping("/config.js")
    public String config() throws JsonProcessingException {
        return "angular.module('crowdsource')"
                + ".value('emailBlacklistPatterns', " + objectMapper.writeValueAsString(emailBlacklistPatterns) + ")";
    }

}
