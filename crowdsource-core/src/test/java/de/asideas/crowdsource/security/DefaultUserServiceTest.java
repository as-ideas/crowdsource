package de.asideas.crowdsource.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DefaultUserServiceTest {

    @InjectMocks
    private DefaultUsersService defaultUserService = new DefaultUsersService();

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ClassPathResource mockedInputSource;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Before
    public void init() {
        reset(userRepository, passwordEncoder, mockedInputSource);
        ReflectionTestUtils.setField(defaultUserService, "objectMapper", objectMapper);
    }

    @Test
    public void shouldChangeNothingIfFileNotFound() {
        prepareResourceMock(false, true);

        defaultUserService.loadDefaultUsers();

        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    public void shouldChangeNothingIfFileIsNotReadable() {
        prepareResourceMock(true, false);

        defaultUserService.loadDefaultUsers();

        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    public void shouldChangeNothingIfEmptyArray() throws IOException {
        prepareResourceMock("[]");

        defaultUserService.loadDefaultUsers();

        verify(userRepository, never()).findByEmail(anyString());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldChangeNothingIfEmptyFile() throws IOException {
        prepareResourceMock("");

        defaultUserService.loadDefaultUsers();

        verify(userRepository, never()).findByEmail(anyString());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    public void shouldCreateUsersIfNotExists() throws IOException {
        prepareResourceMock("[{\"email\": \"foo@bar.de\", \"password\":\"aPw\", \"activated\":\"true\",\"roles\": [\"ROLE_FOO\"]}]");
        final UserEntity expUser = createUserEntity("foo@bar.de", "anEncryptedPw", true, Collections.singletonList("ROLE_FOO"));

        when(passwordEncoder.encode(eq("aPw"))).thenReturn("anEncryptedPw");

        defaultUserService.loadDefaultUsers();

        final ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);

        verify(userRepository, times(1)).save(userCaptor.capture());
        assertSameContent(userCaptor.getValue(), expUser);
    }

    @Test
    public void shouldCreateMultipleUsers() throws IOException {
        prepareResourceMock("[{\"email\": \"foo@bar.de\", \"password\":\"aPw\", \"activated\":\"true\",\"roles\": [\"ROLE_FOO\"]}, " +
                "{\"email\": \"foo2@bar.de\", \"password\":\"aPw\", \"activated\":\"false\",\"roles\": [\"ROLE_FOO_2\"]}]");

        when(passwordEncoder.encode(eq("aPw"))).thenReturn("anEncryptedPw").thenReturn("anEncryptedPw2");

        defaultUserService.loadDefaultUsers();

        final UserEntity user1 = createUserEntity("foo@bar.de", "anEncryptedPw", true, Collections.singletonList("ROLE_FOO"));
        final UserEntity user2 = createUserEntity("foo2@bar.de", "anEncryptedPw2", false, Collections.singletonList("ROLE_FOO_2"));
        ArgumentCaptor<UserEntity> captorUser = ArgumentCaptor.forClass(UserEntity.class);

        verify(userRepository, times(2)).save(captorUser.capture());
        assertSameContent(captorUser.getAllValues().get(0), user1 );
        assertSameContent(captorUser.getAllValues().get(1), user2 );
    }

    @Test
    public void shouldUpdateExistingUsers() throws IOException {
        prepareResourceMock("[{\"email\": \"foo@bar.de\", \"password\":\"aPw\", \"activated\":\"true\",\"roles\": [\"ROLE_FOO\", \"ROLE_FOO_2\"]}]");

        when(userRepository.findByEmail(eq("foo@bar.de"))).thenReturn(createUserEntity("foo@bar.de", "oldEncryptedPw", false, Collections.singletonList("ROLE_FOO")));
        when(passwordEncoder.encode(eq("aPw"))).thenReturn("anEncryptedPw");

        defaultUserService.loadDefaultUsers();

        final UserEntity expUser = createUserEntity("foo@bar.de", "anEncryptedPw", true, Arrays.asList("ROLE_FOO", "ROLE_FOO_2"));
        final ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);

        verify(userRepository, times(1)).save(userCaptor.capture());
        assertSameContent(userCaptor.getValue(), expUser);
    }

    private UserEntity createUserEntity(String email, String password, boolean active, List<String> roles) {
        UserEntity entity = new UserEntity();
        entity.setEmail(email);
        entity.setPassword(password);
        entity.setActivated(active);
        entity.setRoles(new ArrayList<>(roles));

        return entity;
    }

    private void prepareResourceMock(boolean exists, boolean readable) {
        when(mockedInputSource.exists()).thenReturn(exists);
        when(mockedInputSource.isReadable()).thenReturn(readable);
    }

    private void prepareResourceMock(String fileContent) throws IOException {
        prepareResourceMock(true, true);
        when(mockedInputSource.getInputStream()).thenReturn(new ByteArrayInputStream(fileContent.getBytes("UTF-8")));
    }

    private void assertSameContent(UserEntity user1, UserEntity user2){
        assertThat(user1.getRoles(), is(user2.getRoles()));
        assertThat(user1.getEmail(), is(user2.getEmail()));
        assertThat(user1.getPassword(), is(user2.getPassword()));
        assertThat(user1.isActivated(), is(user2.isActivated()));
    }
}
