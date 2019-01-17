package de.asideas.crowdsource.controller.usercontroller;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.user.UserActivation;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.isEmptyString;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ActivateUserControllerIT extends AbstractUserControllerIT {

    @Test
    public void testActivateUser() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(existingButNotYetActivatedUser.getActivationToken());
        userActivation.setPassword("1234567!");

        final String email = existingButNotYetActivatedUser.getEmail();

        mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isOk());

        ArgumentCaptor<UserEntity> userEntityCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userEntityCaptor.capture());

        UserEntity userEntity = userEntityCaptor.getValue();
        assertThat(userEntity.isActivated(), is(true));
        assertThat(userEntity.getActivationToken(), isEmptyString());
        assertThat(userEntity.getPassword(), is(ENCODED_PASSWORD));
    }

    @Test
    public void testActivateTwice() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(existingButNotYetActivatedUser.getActivationToken());
        userActivation.setPassword("1234567!");

        final String email = existingButNotYetActivatedUser.getEmail();

        mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testActivateWrongActivationToken() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(UUID.randomUUID().toString());
        userActivation.setPassword("1234567!");

        final String email = existingButNotYetActivatedUser.getEmail();

        MvcResult mvcResult = mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertEquals("{\"errorCode\":\"activation_token_invalid\",\"fieldViolations\":{}}", mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testActivateInvalidPassword() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(UUID.randomUUID().toString());
        userActivation.setPassword("invalid");

        final String email = existingButNotYetActivatedUser.getEmail();

        MvcResult mvcResult = mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertEquals("{\"errorCode\":\"field_errors\",\"fieldViolations\":{\"password\":\"insecure_password\"}}", mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testActivateNonExistentUser() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(UUID.randomUUID().toString());
        userActivation.setPassword("1234567!");

        final String email = UUID.randomUUID().toString();

        mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testActivateAlreadyActivatedUser() throws Exception {

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken("xyz");
        userActivation.setPassword("1234567!");

        final String email = activatedUser.getEmail();

        MvcResult mvcResult = mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertEquals("{\"errorCode\":\"already_activated\",\"fieldViolations\":{}}", mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testActivateFromPasswordRecovery() throws Exception {

        activatedUser.setActivationToken("xyz");

        final UserActivation userActivation = new UserActivation();
        userActivation.setActivationToken(activatedUser.getActivationToken());
        userActivation.setPassword("1234567!");

        final String email = activatedUser.getEmail();

        mockMvc.perform(post("/user/" + email + "/activation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userActivation)))
                .andExpect(status().isOk());
    }

}
