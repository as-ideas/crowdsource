package de.asideas.crowdsource.testsupport.cucumber;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.asideas.crowdsource.presentation.prototypecampaign.Comment;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.pageobjects.project.ProjectDetailPage;
import de.asideas.crowdsource.testsupport.util.CrowdSourceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@ContextConfiguration(classes = CrowdSourceTestConfig.class)
public class CommentSteps {

    @Autowired
    private ProjectDetailPage projectDetailPage;

    @Autowired
    private CrowdSourceClient crowdSourceClient;

    @Autowired
    private ProjectDetailSteps projectDetailSteps;

    private String testComment;

    @And("^a comment for the project was submitted in the meantime$")
    public void a_comment_for_the_project_was_submitted_in_the_meantime() throws Throwable {

        final CrowdSourceClient.AuthToken token = crowdSourceClient.authorizeWithDefaultUser();
        crowdSourceClient.comment(projectDetailSteps.getCreatedProject(), "some valid comment is a good thing for a test", token);
    }

    @And("^(\\d) comments are visible$")
    public void a_comment_is_visible(int commentCount) throws Throwable {

        assertTrue(projectDetailPage.comments().size() == commentCount);
    }

    @When("^the user submits a comment$")
    public void the_user_submits_a_comment() throws Throwable {

        testComment = "this is a test comment and was created at: " + System.currentTimeMillis();
        projectDetailPage.submitComment(testComment);
        projectDetailPage.waitForDetailsToBeLoaded();
    }

    @Then("^The comment is visible as the last in the comments-list$")
    public void The_comment_is_visible_as_the_last_in_the_comments_list() throws Throwable {

        final List<Comment> comments = projectDetailPage.comments();
        final Comment lastComment = comments.get(comments.size() - 1);
        assertEquals(testComment, lastComment.getComment());
    }
}
