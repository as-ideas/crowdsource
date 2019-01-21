package de.asideas.crowdsource.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * Service whichs solely purpose is to create default users.
 */
@Component
public class DefaultUsersService {
    private static final Logger LOG = LoggerFactory.getLogger(DefaultUsersService.class);

    @Value("${de.asideas.crowdsource.createusers.fixtures.path}")
    private ClassPathResource defaultUserFixtures;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    public void loadDefaultUsers() {

        if (!defaultUserFixtures.exists() || !defaultUserFixtures.isReadable()) {
            LOG.warn("Fixtures file at {} does not exists or is not accessible. Skipping creation of default users.", defaultUserFixtures.getPath());
            return;
        }

        try {
            List<UserEntity> users = objectMapper.readValue(defaultUserFixtures.getInputStream(), new TypeReference<List<UserEntity>>() {
            });

            users.stream().forEach(this::createUser);

            LOG.info("Finished creating or updating {} users without errors.", users.size());

        } catch (IOException e) {
            LOG.error("IO Exception occured while parsing fixtures file from classpath location {}", defaultUserFixtures.getPath(), e);
            throw new IllegalStateException(e);
        }
    }

    private void createUser(UserEntity inputUser) {
        LOG.info("Creating or updating user: {}", inputUser);

        // default user
        UserEntity user = userRepository.findByEmail(inputUser.getEmail());
        if (user == null) {
            user = inputUser;
        }
        user.setPassword(passwordEncoder.encode(inputUser.getPassword()));
        user.setActivated(inputUser.isActivated());
        user.setRoles(inputUser.getRoles());
        userRepository.save(user);
    }

}
