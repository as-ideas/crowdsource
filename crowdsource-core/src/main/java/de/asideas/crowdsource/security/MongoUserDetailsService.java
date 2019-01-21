package de.asideas.crowdsource.security;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

import static java.util.stream.Collectors.toList;

@Service
public class MongoUserDetailsService implements UserDetailsService {

    private static final Logger LOG = org.slf4j.LoggerFactory.getLogger(MongoUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DefaultUsersService defaultUsersService;

    @Value("${de.asideas.crowdsource.createusers:false}")
    private boolean createUsers;

    @PostConstruct
    public void createUsers() {

        if (!createUsers) {
            LOG.info("not creating or updating any users.");
            return;
        }

        defaultUsersService.loadDefaultUsers();
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
