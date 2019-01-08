package de.asideas.crowdsource.presentation.user;

import de.asideas.crowdsource.domain.model.UserEntity;
import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

public class ProjectCreatorTest {

    @Test
    public void testDetermineNameFromEmail() throws Exception {
        ProjectCreator projectCreator = new ProjectCreator(new UserEntity("foo.bar@domain.com", "Foo", "Bar"));

        assertThat(projectCreator.getName(), is("Foo Bar"));
    }

    @Test
    public void testDetermineNameFromEmail_withDigits() throws Exception {
        ProjectCreator projectCreator = new ProjectCreator(new UserEntity("f12oo123.91bar2@domain.com", "Foo", "Bar"));

        assertThat(projectCreator.getName(), is("Foo Bar"));
    }

    @Test
    public void testDetermineNameFromEmail_noEmail() throws Exception {
        ProjectCreator projectCreator = new ProjectCreator(new UserEntity());

        assertThat(projectCreator.getName(), is(nullValue()));
    }

    @Test
    public void testDetermineNameFromEmail_invalidEmail() throws Exception {
        ProjectCreator projectCreator = new ProjectCreator(new UserEntity("invalid-email", "Foo", "Bar"));

        assertThat(projectCreator.getName(), is(nullValue()));
    }

    @Test
    public void testDetermineNameFromEmail_noLocalPart() throws Exception {
        ProjectCreator projectCreator = new ProjectCreator(new UserEntity("@domain.com", "Foo", "Bar"));

        assertThat(projectCreator.getName(), is(nullValue()));
    }
}