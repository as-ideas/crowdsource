package de.asideas.crowdsource.testsupport.pageobjects.project;

import de.asideas.crowdsource.domain.shared.LikeStatus;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProjectListPage {

    @Autowired
    private WebDriverProvider webDriverProvider;

    @Autowired
    private SeleniumWait wait;

    public void waitForPageLoad() {
        wait.until(driver -> {
            if (driver.findElements(By.className("project__tile")).size() > 0) {
                return true;
            }

            List<WebElement> noProjectDiv = driver.findElements(By.className("no-projects"));
            return noProjectDiv.size() > 0 && noProjectDiv.get(0).isDisplayed();
        });
    }

    public void clickProjectTileWithTitle(String title) {
        RemoteWebDriver webDriver = webDriverProvider.provideDriver();
        final WebElement projectTile = webDriver.findElement(By.xpath("//h3[text()='" + title + "']"));
        projectTile.click();
    }

    public boolean containsProject(String projectTitlePrefix, String projectShortDescriptionPrefix) {
        return findProjectWebElement(projectTitlePrefix, projectShortDescriptionPrefix) != null;
    }

    public WebElement findProjectWebElement(String titlePrefix, String shortDescriptionPrefix) {

        for (WebElement projectElement : projectTiles()) {

            final Project project = project(projectElement);
            if (project.getTitle().startsWith(titlePrefix)
                    && project.getTitle().endsWith("\u2026")
                    && project.getShortDescription().startsWith(shortDescriptionPrefix)
                    && project.getShortDescription().endsWith("…")) {
                return projectElement;
            }
        }
        return null;
    }

    public void clickLikeWidget(String projectTitle) {
        final WebElement project = findProjectWebElement(projectTitle);
        if(project == null){
            throw new IllegalStateException("Project tile with title '" + projectTitle + "' couldn't be found");
        }
        getLikeWidgetFromProjectTile(project).click();
    }

    public Project findProject(String projectTitle){
        return project(findProjectWebElement(projectTitle));
    }

    public WebElement findProjectWebElement(String titlePrefix) {
        for (WebElement projectElement : projectTiles()) {
            final Project project = project(projectElement);
            if (project.getTitle().startsWith(titlePrefix) ) {
                return projectElement;
            }
        }
        return null;
    }

    private List<WebElement> projectTiles() {
        RemoteWebDriver webDriver = webDriverProvider.provideDriver();
        return webDriver.findElements(By.cssSelector(".project__tile"));
    }

    private Project project(WebElement projectElement) {
        WebElement clickableLikeWidget = getLikeWidgetFromProjectTile(projectElement);
        WebElement likeCount = projectElement.findElement(By.cssSelector(".project_likes_list_count"));
        LikeStatus like = clickableLikeWidget.getAttribute("class").contains("liked") ? LikeStatus.LIKE : LikeStatus.UNLIKE;

        Project project = new Project();
        project.setTitle(projectElement.findElement(By.cssSelector("h3")).getText());
        project.setShortDescription(projectElement.findElement(By.cssSelector("p")).getText());
        project.setLikeStatusOfRequestUser(like);
        project.setLikeCount(Integer.parseInt(likeCount.getText()));

        return project;
    }

    private WebElement getLikeWidgetFromProjectTile(WebElement projectElement) {
        return projectElement.findElement(By.cssSelector(".project_likes_list"));
    }
}
