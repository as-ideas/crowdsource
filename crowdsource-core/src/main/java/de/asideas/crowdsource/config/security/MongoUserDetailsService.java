package de.asideas.crowdsource.config.security;

import de.asideas.crowdsource.model.persistence.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Collections;

import static java.util.stream.Collectors.toList;

@Service
public class MongoUserDetailsService implements UserDetailsService {

    public final static String DEFAULT_USER_EMAIL = "crowdsource@crowd.source.de";
    public final static String DEFAULT_USER_PASS = "einEselGehtZumBaecker!";

    public final static String DEFAULT_ADMIN_EMAIL = "cs_admin@crowd.source.de";
    public final static String DEFAULT_ADMIN_PASS = "einAdminGehtZumBaecker!";
    private static final Logger LOG = org.slf4j.LoggerFactory.getLogger(MongoUserDetailsService.class);

    @Value("${de.asideas.crowdsource.createusers:false}")
    private boolean createUsers;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createUsers() {

        if (!createUsers) {
            LOG.info("not creating or updating any users.");
            return;
        }

        LOG.info("creating or updating users: {}:{} and {}:{}", DEFAULT_USER_EMAIL, DEFAULT_USER_PASS, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS);

        // default user
        UserEntity defaultUser = userRepository.findByEmail(DEFAULT_USER_EMAIL);
        if (defaultUser == null) {
            defaultUser = new UserEntity(DEFAULT_USER_EMAIL);
        }
        defaultUser.setPassword(passwordEncoder.encode(DEFAULT_USER_PASS));
        defaultUser.setActivated(true);
        defaultUser.setRoles(Collections.singletonList(Roles.ROLE_USER));
        userRepository.save(defaultUser);

        // admin
        UserEntity admin = userRepository.findByEmail(DEFAULT_ADMIN_EMAIL);
        if (admin == null) {
            admin = new UserEntity(DEFAULT_ADMIN_EMAIL);
        }
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASS));
        admin.setActivated(true);
        admin.setRoles(Arrays.asList(Roles.ROLE_USER, Roles.ROLE_ADMIN));
        userRepository.save(admin);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        username = username.toLowerCase();

        UserEntity user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user with username [" + username + "] found");
        }

        if (!user.isActivated()) {
            throw new UsernameNotFoundException("User with username [" + username + "] is not activated yet");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream().map(SimpleGrantedAuthority::new).collect(toList())
        );
    }
}