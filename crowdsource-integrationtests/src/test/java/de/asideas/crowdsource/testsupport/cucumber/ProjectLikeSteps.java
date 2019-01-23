package de.asideas.crowdsource.testsupport.cucumber;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.asideas.crowdsource.domain.shared.LikeStatus;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.pageobjects.project.ProjectDetailPage;
import de.asideas.crowdsource.testsupport.pageobjects.project.ProjectListPage;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import de.asideas.crowdsource.testsupport.util.CrowdSourceClient;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

@ContextConfiguration(classes = CrowdSourceTestConfig.class)
public class ProjectLikeSteps {

    @Autowired
    private WebDriverProvider webDriverProvider;

    @Autowired
    private ProjectListPage projectListPage;

    @Autowired
    private ProjectDetailPage projectDetailPage;

    @Autowired
    private ProjectDetailSteps projectDetailSteps;

    @Autowired
    private CrowdSourceClient crowdSourceClient;

    private WebDriver webDriver;

    @Before
    public void init() {
        webDriver = webDriverProvider.provideDriver();
    }

    @After
    public void after() {
        WebDriverProvider.closeWebDriver();
    }


    @When("^the user clicks on the like button of this project on the (list|detail) page.*$")
    public void the_user_clicks_on_the_like_button_of_the_project(String page) throws Throwable {
        final Project createdProject = projectDetailSteps.getCreatedProject();

        if ("list".equals(page)) {
            projectListPage.clickLikeWidget(createdProject.getTitle());
        }
        if ("detail".equals(page)){
            projectDetailPage.getProjectStatusWidget().clickLikeWidget();
        }
    }

    @Then("^the user sees that he (liked|didn't liked) the project on the (list|detail) page.*$")
    public void the_User_Sees_That_He_Likes_The_Project(String likeOrDoesntLike, String page) throws Throwable {
        LikeStatus expLikeStatus = likeOrDoesntLike.equals("liked") ? LikeStatus.LIKE : LikeStatus.UNLIKE;
        final Project createdProject = projectDetailSteps.getCreatedProject();
        LikeStatus actualLikeStatus = null;

        if ("list".equals(page)) {
            final Project displayedProject = projectListPage.findProject(createdProject.getTitle());
            actualLikeStatus = displayedProject.getLikeStatusOfRequestUser();
        }
        if ("detail".equals(page)){
            actualLikeStatus = projectDetailPage.getProjectStatusWidget().likedByUser();
        }

        assertThat(actualLikeStatus, is(expLikeStatus));
    }

    @Then("^the user sees that the project on the (list|detail) page has (\\d+) likes.*$")
    public void the_User_Sees_That_The_Project_Has_Likes(String page, long expectedLikes) throws Throwable {
        final Project createdProject = projectDetailSteps.getCreatedProject();
        Long actualLikeCount = null;

        if ("list".equals(page)) {
            actualLikeCount = projectListPage.findProject(createdProject.getTitle()).getLikeCount();
        }
        if ("detail".equals(page)){
            actualLikeCount = projectDetailPage.getProjectStatusWidget().getLikeCount();
        }

        assertThat(actualLikeCount, is(expectedLikes));
    }

    @When("^(the|another) user liked the project.*$")
    public void another_user_liked_the_project(String kindOfUser) throws Throwable {
        boolean asAdmin = kindOfUser.equals("another");
        final Project createdProject = projectDetailSteps.getCreatedProject();

        final CrowdSourceClient.AuthToken authToken =
                asAdmin ?
                crowdSourceClient.authorizeWithAdminUser() :
                crowdSourceClient.authorizeWithDefaultUser();

        crowdSourceClient.likeProject(createdProject, authToken);
    }


}
