package de.asideas.crowdsource.controller.usercontroller;

import de.asideas.crowdsource.domain.model.UserEntity;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class RecoverPasswordUserControllerIT extends AbstractUserControllerIT {

    @Test
    public void happyPath() throws Exception {
        String oldActivationToken = activatedUser.getActivationToken();

        recoverPasswordAndExpect(ACTIVATED_USER_MAIL_ADDRESS, status().isNoContent());

        assertThat(activatedUser.getActivationToken(), is(not(oldActivationToken)));
        verify(userRepository).findByEmail(any());
        verify(userNotificationService).sendPasswordRecoveryMail(any());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    public void expect404IfUserNotFound() throws Exception {
        recoverPasswordAndExpect(NEW_USER_MAIL_ADDRESS, status().isNotFound());
        verify(userRepository).findByEmail(any());
        verify(userNotificationService, never()).sendPasswordRecoveryMail(any());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    private MvcResult recoverPasswordAndExpect(String emailAddress, ResultMatcher expectedResponseStatus) throws Exception {
        return mockMvc.perform(get("/user/{email}/password-recovery", emailAddress))
                .andExpect(expectedResponseStatus)
                .andReturn();
    }

}
