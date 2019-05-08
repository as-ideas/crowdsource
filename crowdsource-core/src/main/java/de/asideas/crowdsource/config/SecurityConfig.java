package de.asideas.crowdsource.config;

import java.io.IOException;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.ManagementServerProperties;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;

import de.asideas.crowdsource.security.IPBasedAnonymousAuthenticationFilter;
import de.asideas.crowdsource.security.MongoUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
@Import({SecurityConfig.ResourceServer.class, SecurityConfig.OAuth2Config.class})
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER) // as of Spring Boot 1.5. the order within thef ilter chain changed - so we need to correct here
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private MongoUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/app/**");
        web.ignoring().antMatchers("/css/**");
    }

    @Bean
    public Boolean oauth2StatelessSecurityContext() {
        return Boolean.TRUE;
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }


    @DependsOn("passwordEncoder")
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Configuration
    @EnableResourceServer
    protected static class ResourceServer extends ResourceServerConfigurerAdapter {

        @Autowired
        private IPBasedAnonymousAuthenticationFilter ipBasedAnonymousAuthenticationFilter;

        @Override
        public void configure(HttpSecurity http) throws Exception {

            http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                // at least one location of the app needs to be secured here, or the app won't start up,
                // even if there are controllers secured with the help of @EnableGlobalMethodSecurity
                // -> we define some dummy value to hopefully never match a real url
                // (haven't found the right way to configure spring security yet ...)
                .and().authorizeRequests().antMatchers("/some-pattern-to-make-spring-security-happy").authenticated()
                .and().anonymous().authenticationFilter(ipBasedAnonymousAuthenticationFilter)
            ;
        }
    }

    @Configuration
    @EnableAuthorizationServer
    protected static class OAuth2Config extends AuthorizationServerConfigurerAdapter {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Bean
        public AccessTokenConverter accessTokenConverter() throws IOException {
            final JwtAccessTokenConverter jwtTokenEnhancer = new JwtAccessTokenConverter();
            jwtTokenEnhancer.setSigningKey(IOUtils.toString(getClass().getResourceAsStream("/security/tokensigningkey")));
            jwtTokenEnhancer.setVerifierKey(IOUtils.toString(getClass().getResourceAsStream("/security/tokensigningkey.pub")));
            return jwtTokenEnhancer;
        }

        @Override
        public void configure(AuthorizationServerSecurityConfigurer oauthServer) throws Exception {
            // sets up a filter that listens on /oauth/token to let clients request a token
            oauthServer.allowFormAuthenticationForClients();
        }

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints
                .authenticationManager(authenticationManager)
                .accessTokenConverter(accessTokenConverter());
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients.inMemory()
                .withClient("web")
                .authorizedGrantTypes("password", "refresh_token")
                // token valid one year (we do not use the refresh token yet)
                .accessTokenValiditySeconds(60 * 60 * 24 * 365)

                // at least one scope must be configured. A client could request authorization only for certain parts of the app.
                // We don't need it, so just define some dummy value
                .scopes("default");
        }
    }
}
