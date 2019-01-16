package de.asideas.crowdsource.controller;

import de.asideas.crowdsource.presentation.DateTimeWrapper;
import de.asideas.crowdsource.security.Roles;
import org.joda.time.DateTime;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/datetime")
public class DateTimeController {

    @Secured({Roles.ROLE_USER})
    @RequestMapping(method = RequestMethod.GET)
    public DateTimeWrapper getDatetime() {

        return new DateTimeWrapper(DateTime.now());
    }
}
