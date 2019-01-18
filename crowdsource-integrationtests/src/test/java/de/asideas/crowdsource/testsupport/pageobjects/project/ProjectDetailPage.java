package de.asideas.crowdsource.testsupport.pageobjects.project;

import de.asideas.crowdsource.presentation.prototypecampaign.Comment;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import de.asideas.crowdsource.testsupport.util.UrlProvider;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

import static de.asideas.crowdsource.testsupport.selenium.AngularJsUtils.interpolationCompletedOfElementLocated;

@Component
public class ProjectDetailPage {

    @Autowired
    private WebDriverProvider webDriverProvider;

    @Autowired
    private UrlProvider urlProvider;

    @Autowired
    private SeleniumWait wait;

    @FindBy(css = ".project-details h1")
    private WebElement title;

    @FindBy(className = "project-short-description")
    private WebElement shortDescription;

    @FindBy(css = ".project-details .project-description .ng-binding")
    private WebElement description;

    @FindBy(className = "comments")
    private WebElement comments;

    @FindBy(className = "newcomment-comment")
    private WebElement newCommentField;

    @FindBy(className = "newcomment-submit")
    private WebElement newCommentSubmitButton;

    @FindBy(className = "to-edit-form-button")
    private WebElement editProjectButton;

    @Autowired
    private ProjectStatusWidget projectStatusWidget;

    public void openWithoutWaiting(String projectId) {
        webDriverProvider.provideDriver().get(urlProvider.applicationUrl() + "#/project/" + projectId);
    }

    public void open(String projectId) {
        openWithoutWaiting(projectId);
        waitForDetailsToBeLoaded();
    }

    public void waitForDetailsToBeLoaded() {
        RemoteWebDriver webDriver = webDriverProvider.provideDriver();
        wait.until(interpolationCompletedOfElementLocated(By.cssSelector(".project-details h1")));
        PageFactory.initElements(webDriver, this);
        projectStatusWidget.waitForDetailsToBeLoaded();
    }

    public String getTitle() {
        return title.getText();
    }

    public String getDescription() {
        return description.getText();
    }
    public String getDescriptionAsHtml() {
        return description.getAttribute("innerHTML").replaceAll("\\r|\\n", "").trim();
    }

    public String getShortDescription() {
        return shortDescription.getText();
    }

    public ProjectStatusWidget getProjectStatusWidget() {
        return projectStatusWidget;
    }

    public List<Comment> comments() {

        final org.joda.time.format.DateTimeFormatter formatter = DateTimeFormat.forPattern("dd.MM.yy HH:mm");
        return comments.findElements(By.className("comment")).stream().map(commentElement -> {
            final String userName = commentElement.findElement(By.className("comment-user")).getText();
            final String commentText = commentElement.findElement(By.className("comment-comment")).getText();
            final DateTime createdDate = DateTime.parse(commentElement.findElement(By.className("comment-date")).getText(), formatter);
            return new Comment(createdDate, userName, commentText);
        }).collect(Collectors.toList());
    }

    public void submitComment(String comment) {

        newCommentField.clear();
        newCommentField.sendKeys(comment);
        newCommentSubmitButton.click();
        // TODO: replace this sleep with something more senseful. problem here: an element will be created but right afterwards the comments get reloaded
        // and then its gone
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void clickEditButton(){
        editProjectButton.click();
    }

    public WebElement getEditProjectButton(){
        return editProjectButton;
    }

}
