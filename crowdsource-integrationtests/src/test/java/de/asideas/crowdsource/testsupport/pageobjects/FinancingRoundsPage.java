package de.asideas.crowdsource.testsupport.pageobjects;

import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.testsupport.selenium.ElementUtils;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import de.asideas.crowdsource.testsupport.util.UrlProvider;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.google.common.collect.Iterables.getOnlyElement;
import static org.junit.Assert.assertNotNull;
import static org.openqa.selenium.support.ui.ExpectedConditions.presenceOfAllElementsLocatedBy;
import static org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated;

@Component
public class FinancingRoundsPage {

    @Autowired
    private WebDriverProvider webDriverProvider;

    @Autowired
    private UrlProvider urlProvider;

    @Autowired
    private SeleniumWait seleniumWait;

    public void open() {
        webDriverProvider.provideDriver().get(urlProvider.applicationUrl() + "/#/financingrounds");
    }

    public void waitForPageLoad() {
        seleniumWait.until(presenceOfElementLocated(By.cssSelector(".financingrounds tbody tr")));
    }

    public void startFinancingRound(DateTime endDate, int budget) {

        final RemoteWebDriver webDriver = webDriverProvider.provideDriver();

        final WebElement newRoundBudget = webDriver.findElement(By.className("newround-budget"));
        newRoundBudget.clear();
        newRoundBudget.sendKeys(Integer.toString(budget));

        final DateTimeFormatter formatter = DateTimeFormat.forPattern("dd.MM.yyyy");
        webDriver.executeScript("$('.newround-enddate').val('" + endDate.toString(formatter) + "')");
        webDriver.executeScript("$('.newround-enddate').trigger('input')");

        webDriver.findElement(By.className("newround-start")).click();
    }

    public FinancingRound findFinancingRound(DateTime endDate, int budget) {

        return webDriverProvider.provideDriver().findElements(By.className("financinground")).stream()
                .map(this::financingRound)
                .filter(round -> sameDate(round.getEndDate(), endDate) && round.getBudget().equals(budget))
                .findFirst()
                .orElse(null);
    }

    public FinancingRound getFinancingRoundAt(int position) {

        List<WebElement> financingRounds = webDriverProvider.provideDriver().findElements(By.className("financinground"));

        if (financingRounds.size() > position) {
            return financingRound(financingRounds.get(position));
        } else {
            return null;
        }
    }

    public int getFinancingRoundsCount() {
        return webDriverProvider.provideDriver().findElements(By.className("financinground")).size();
    }

    public boolean canStartFinancingRound(boolean wait) {

        final RemoteWebDriver webDriver = webDriverProvider.provideDriver();
        if (wait) {
            seleniumWait.until(presenceOfAllElementsLocatedBy(By.className("newround-start")));
            return true;
        } else {
            return webDriver.findElements(By.className("newround-start")).size() > 0;
        }
    }

    private boolean sameDate(DateTime a, DateTime b) {
        return a.toLocalDate().isEqual(b.toLocalDate());
    }

    private FinancingRound financingRound(WebElement financingRoundElement) {

        // format: 16.01.15 13:35
        final DateTimeFormatter formatter = DateTimeFormat.forPattern("dd.MM.yy HH:mm");

        FinancingRound financingRound = new FinancingRound();
        financingRound.setId(financingRoundElement.getAttribute("fr_id"));

        final String startDateString = financingRoundElement.findElement(By.className("startdate")).getText();
        financingRound.setStartDate(DateTime.parse(startDateString, formatter));

        final String endDateString = financingRoundElement.findElement(By.className("enddate")).getText();
        financingRound.setEndDate(DateTime.parse(endDateString, formatter));

        final String budgetText = financingRoundElement.findElement(By.className("budget")).getText();
        financingRound.setBudget(ElementUtils.parseNumber(budgetText));

        boolean active = financingRoundElement.findElements(By.className("stop-button")).size() == 1;
        financingRound.setActive(active);

        return financingRound;
    }

    public String infoText() {

        seleniumWait.until(presenceOfElementLocated(By.className("info")));
        return webDriverProvider.provideDriver().findElement(By.className("info")).getText();
    }

    public String getNewRoundNotificationText() {
        List<WebElement> elements = webDriverProvider.provideDriver().findElements(By.cssSelector(".newround-form .notification"));
        if (elements.size() == 0) {
            return null;
        }

        return elements.get(0).getText();
    }

    public WebElement getStopButtonOfFinancingRound(FinancingRound financingRound) {
        WebElement financingRoundElement = webDriverProvider.provideDriver().findElementsByClassName("financinground").stream()
                .filter(roundElement -> financingRound.getId().equals(roundElement.getAttribute("fr_id")))
                .findFirst()
                .orElse(null);

        return getOnlyElement(financingRoundElement.findElements(By.cssSelector(".stop-button")), null);
    }

    public WebElement getStopButtonOfFinancingRoundAt(int pos) {
        final FinancingRound financingRound = getFinancingRoundAt(pos);
        assertNotNull(financingRound);
        return getStopButtonOfFinancingRound(financingRound);
    }
}
