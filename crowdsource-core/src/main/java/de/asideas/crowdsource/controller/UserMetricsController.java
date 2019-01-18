package de.asideas.crowdsource.controller;

import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.presentation.user.UserMetrics;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/metrics")
public class UserMetricsController {

    @Autowired
    private UserRepository userRepository;

    @Secured({Roles.ROLE_USER})
    @RequestMapping(method = RequestMethod.GET)
    public UserMetrics getUserMetrics() {

        List<UserEntity> users = userRepository.findAll();
        return new UserMetrics(users);
    }
}
