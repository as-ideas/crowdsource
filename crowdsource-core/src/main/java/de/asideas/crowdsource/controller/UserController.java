package de.asideas.crowdsource.controller;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.user.User;
import de.asideas.crowdsource.presentation.user.UserActivation;
import de.asideas.crowdsource.presentation.user.UserRegistration;
import de.asideas.crowdsource.repository.FinancingRoundRepository;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.UserService;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

import static org.apache.commons.lang3.StringUtils.isBlank;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private FinancingRoundRepository financingRoundRepository;

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void registerUser(@RequestBody @Valid UserRegistration userRegistration) {

        final String email = userRegistration.getEmail().toLowerCase();
        final String firstName = userRegistration.getFirstName();
        final String lastName = userRegistration.getLastName();

        UserEntity userEntity = userRepository.findByEmail(email);

        if (userEntity == null) {
            userEntity = new UserEntity(email, firstName, lastName);
        } else {
            LOG.debug("A user with the address {} already exists, assigning a new activation token", email);
        }

        userService.assignActivationTokenForRegistration(userEntity);
    }

    @RequestMapping(value = "/{email}/activation", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void activateUser(
            @PathVariable String email,
            @RequestBody @Valid UserActivation userActivation) {

        email = email.toLowerCase();

        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            LOG.debug("userentity with id {} does not exist and can therefore not be activated.", email);
            throw new ResourceNotFoundException();
        }

        // The activation token may be set to non blank when using password recovery.
        // In this case, the user is still activated but has a token set.
        if (isBlank(userEntity.getActivationToken()) && userEntity.isActivated()) {
            LOG.debug("user {} is already activated", userEntity);
            throw InvalidRequestException.userAlreadyActivated();
        }

        if (isBlank(userEntity.getActivationToken())
                || !userEntity.getActivationToken().equals(userActivation.getActivationToken())) {
            LOG.debug("token mismatch on activation request for user with email: {} (was {}, expected: {})",
                    email, userActivation.getActivationToken(), userEntity.getActivationToken());

            throw InvalidRequestException.activationTokenInvalid();
        }

        userEntity.setActivated(true);
        userEntity.setActivationToken("");
        userEntity.setPassword(passwordEncoder.encode(userActivation.getPassword()));

        userRepository.save(userEntity);
        LOG.debug("User activated: {}", userEntity);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/{email}/password-recovery", method = RequestMethod.GET)
    public void recoverPassword(@PathVariable String email) {

        email = email.toLowerCase();

        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            LOG.debug("userentity with id {} does not exist and a password can therefore not be recovered.", email);
            throw new ResourceNotFoundException();
        }

        userService.assignActivationTokenForPasswordRecovery(userEntity);
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/current", method = RequestMethod.GET)
    public User getCurrentUser(Principal principal) {

        UserEntity userEntity = userService.getUserByEmail(principal.getName());

        FinancingRoundEntity currentFinancingRound = financingRoundRepository.findActive(DateTime.now());
        if (currentFinancingRound == null) {
            // if there is no active financing round, the budget of the user should be 0
            // but we have no scheduler that resets the budget of every user to 0 when the financing round ends
            userEntity.setBudget(0);
        }

        return new User(userEntity);
    }
}
