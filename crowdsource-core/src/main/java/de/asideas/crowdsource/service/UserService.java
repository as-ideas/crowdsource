package de.asideas.crowdsource.service;

import de.asideas.crowdsource.exceptions.NotAuthorizedException;
import de.asideas.crowdsource.model.persistence.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public final static int ACTIVATION_TOKEN_LENGTH = 32;

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationService userNotificationService;

    public UserEntity getUserByEmail(String email) {

        email = email.toLowerCase();

        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            throw new NotAuthorizedException("No user found with email " + email);
        }
        return userEntity;
    }

    public void assignActivationTokenForRegistration(UserEntity userEntity) {

        userEntity.setActivationToken(generateActivationToken());
        userNotificationService.sendActivationMail(userEntity);
        saveUser(userEntity);
    }

    public void assignActivationTokenForPasswordRecovery(UserEntity userEntity) {

        userEntity.setActivationToken(generateActivationToken());
        userNotificationService.sendPasswordRecoveryMail(userEntity);
        saveUser(userEntity);
    }


    private String generateActivationToken() {
        return RandomStringUtils.randomAlphanumeric(ACTIVATION_TOKEN_LENGTH);
    }

    private void saveUser(UserEntity userEntity) {
        userRepository.save(userEntity);
        LOG.debug("User saved: {}", userEntity);
    }
}