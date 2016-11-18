package de.asideas.crowdsource.presentation.project;

import org.junit.Test;

import javax.validation.Validation;
import javax.validation.Validator;
import java.math.BigDecimal;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class ProjectValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    public void testAllFine() {
        Project project = new Project();
        project.setTitle("title");
        project.setShortDescription("shortDescription");
        project.setPledgeGoal(BigDecimal.ONE);
        project.setDescription("description");

        assertThat(validator.validate(project).size(), is(0));
    }

    @Test
    public void testEverythingNull() {
        Project project = new Project();
        assertThat(validator.validate(project).size(), is(4));
    }

    @Test
    public void testEverythingEmpty() {
        Project project = new Project();
        project.setTitle("");
        project.setShortDescription("");
        project.setPledgeGoal(BigDecimal.ZERO);
        project.setDescription("");
        assertThat(validator.validate(project).size(), is(4));
    }

}
