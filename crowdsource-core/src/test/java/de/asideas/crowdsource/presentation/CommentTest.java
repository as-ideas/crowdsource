package de.asideas.crowdsource.presentation;

import org.junit.Test;

import javax.validation.Validation;
import javax.validation.Validator;

import de.asideas.crowdsource.presentation.prototypecampaign.Comment;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class CommentTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    public void testAllFine() {
        Comment comment = new Comment();
        comment.setComment("foo");

        assertThat(validator.validate(comment).size(), is(0));
    }

    @Test
    public void testWithEmptyComment() {
        Comment comment = new Comment();
        comment.setComment("");

        assertThat(validator.validate(comment).size(), is(1));
    }

    @Test
    public void testWithNullComment() {
        Comment comment = new Comment();

        assertThat(validator.validate(comment).size(), is(1));
    }

}
