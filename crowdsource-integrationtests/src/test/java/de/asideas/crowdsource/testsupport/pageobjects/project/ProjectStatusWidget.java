package de.asideas.crowdsource.testsupport.pageobjects.project;

import de.asideas.crowdsource.domain.shared.prototypecampaign.LikeStatus;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static de.asideas.crowdsource.testsupport.selenium.AngularJsUtils.interpolationCompletedOfElementLocated;

@Component
public class ProjectStatusWidget {

    @Autowired
    private SeleniumWait wait;

    @Autowired
    private WebDriverProvider webDriverProvider;

    @FindBy(css = ".project-details progress-bar .cs-progress__meter")
    private WebElement progressBar;

    @FindBy(className = "project-status__pledged-amount")
    private WebElement pledgeAmountLabel;

    @FindBy(className = "project-status__pledge-goal")
    private WebElement pledgeGoalLabel;

    @FindBy(className = "project-status__backers")
    private WebElement backersLabel;

    @FindBy(className = "project_likes_detail_count")
    private WebElement likeCountLabel;

    @FindBy(className = "project_likes_detail")
    private WebElement likeWidget;

    @FindBy(css = ".pd-creator strong")
    private WebElement userLabel;

    @FindBy(className = "to-pledging-form-button")
    private WebElement scrollToPledgingFormButton;


    public String getProgressBarValue() {
        return progressBar.getCssValue("width");
    }

    public String getPledgedAmount() {
        return pledgeAmountLabel.getText();
    }

    public String getPledgeGoal() {
        return pledgeGoalLabel.getText();
    }

    public String getBackers() {
        return backersLabel.getText();
    }

    public String getUserName() {
        return userLabel.getText();
    }

    public Long getLikeCount(){
        return Long.parseLong(likeCountLabel.getText());
    }

    public void clickLikeWidget(){
        likeWidget.click();
    }

    public LikeStatus likedByUser(){
        return likeWidget.getAttribute("class").contains("liked")?
                LikeStatus.LIKE : LikeStatus.UNLIKE;
    }

    public void clickFundingButton() {
        scrollToPledgingFormButton.click();
    }

    public void waitForDetailsToBeLoaded() {
        RemoteWebDriver webDriver = webDriverProvider.provideDriver();
        wait.until(interpolationCompletedOfElementLocated(By.cssSelector(".project-status__backers")));
        PageFactory.initElements(webDriver, this);
    }
}
