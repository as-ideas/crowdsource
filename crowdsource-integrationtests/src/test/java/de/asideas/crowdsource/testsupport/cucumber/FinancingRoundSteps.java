package de.asideas.crowdsource.testsupport.cucumber;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.pageobjects.FinancingRoundsPage;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import org.joda.time.DateTime;
import org.openqa.selenium.WebElement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import java.util.Random;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

@ContextConfiguration(classes = CrowdSourceTestConfig.class)
public class FinancingRoundSteps {

    @Autowired
    private FinancingRoundsPage financingRoundsPage;

    @Autowired
    private SeleniumWait wait;

    /**
     * will be set by create step and read right after for the assertion
     */
    private int budget;

    /**
     * will be set by create step and read right after for the assertion
     */
    private DateTime endDate;

    /**
     * will be set by create step to identify when the list was reloaded
     */
    private int numberOfFinancingRoundsBeforeStart;


    @And("^he visits the financingrounds-page$")
    public void he_visits_the_financingrounds_page() throws Throwable {
        financingRoundsPage.open();
        financingRoundsPage.waitForPageLoad();
    }

    @Then("^he sees a list of financing rounds$")
    public void he_sees_a_list_of_financing_rounds() throws Throwable {
        financingRoundsPage.waitForPageLoad();
    }

    @And("^he starts a new financing round$")
    public void he_starts_a_new_financing_round() throws Throwable {

        // set budget some value between 10 and 1000
        budget = new Random().nextInt(990) + 10;

        // set end date some value between tomorrow and next year
        endDate = new DateTime().plusDays(new Random().nextInt(364) + 1);

        numberOfFinancingRoundsBeforeStart = financingRoundsPage.getFinancingRoundsCount();

        // start round
        financingRoundsPage.startFinancingRound(endDate, budget);
    }

    @And("^he sees the new financing round as the first item in the list of financing rounds$")
    public void he_sees_the_new_financing_round_as_the_first_item_in_the_list_of_financing_rounds() throws Throwable {
        wait.until(driver -> numberOfFinancingRoundsBeforeStart < financingRoundsPage.getFinancingRoundsCount());

        FinancingRound financingRound = financingRoundsPage.getFinancingRoundAt(0);
        assertThat(financingRound, is(notNullValue()));
        assertThat(financingRound.getBudget(), is(budget));
        assertThat(financingRound.getEndDate().toLocalDate(), is(endDate.toLocalDate()));
        // FIXME assertThat(financingRound.getEndDate().getHourOfDay(), is(hourInBerlinToLocalHour(23)));
        assertThat(financingRound.getEndDate().getMinuteOfHour(), is(59));
        assertThat(financingRound.getEndDate().getSecondOfMinute(), is(0));
    }
//
//    /**
//     * helper that finds out which hour in local time a given hour in berlin would be
//     */
//    private int hourInBerlinToLocalHour(int hour) {
//        return new DateTime(2000, 12, 1, hour, 59, 0, DateTimeZone.forID("Europe/Berlin")).withZone(DateTimeZone.getDefault()).getHourOfDay();
//    }

    @And("^the new financing round can be stopped$")
    public void the_new_financing_round_can_be_stopped() throws Throwable {
        FinancingRound financingRound = financingRoundsPage.findFinancingRound(endDate, budget);
        assertTrue(financingRound.isActive());

        the_stop_button_is_displayed();
    }

    @When("^he clicks the stop button of the financing round$")
    public void he_clicks_the_stop_button_of_the_financing_round() throws Throwable {
        WebElement button = financingRoundsPage.getStopButtonOfFinancingRoundAt(0);
        assertNotNull(button);
        button.click();
    }

    @Then("^the stop button is displayed again$")
    public void the_stop_button_is_displayed() throws Throwable {
        WebElement stopButton = financingRoundsPage.getStopButtonOfFinancingRoundAt(0);
        assertNotNull(stopButton);
        assertThat(stopButton.getText(), is("BEENDEN"));
    }

    @Then("^the financing round is not marked active any more$")
    public void the_financing_round_is_not_marked_active_any_more() throws Throwable {

        final FinancingRound financingRound = financingRoundsPage.getFinancingRoundAt(0);
        assertNotNull(financingRound);
        assertFalse(financingRound.isActive());
    }

    @And("^the option to start a new financing round is not available$")
    public void the_option_to_start_a_new_financing_round_is_not_available() throws Throwable {

        assertFalse(financingRoundsPage.canStartFinancingRound(false));
    }

    @And("^the option to start a new financing round is available$")
    public void the_option_to_start_a_new_financing_round_is_available() throws Throwable {

        assertTrue(financingRoundsPage.canStartFinancingRound(true));
    }

    @Then("^he gets displayed the message \"([^\"]*)\"$")
    public void he_gets_displayed_the_message(String message) throws Throwable {
        assertThat(financingRoundsPage.infoText(), containsString(message));
    }

    @And("^no notification message is displayed in the start financeround form$")
    public void no_notification_message_is_displayed_in_the_start_financeround_form() throws Throwable {
        assertThat(financingRoundsPage.getNewRoundNotificationText(), is(nullValue()));
    }

    @And("^the notification message \"([^\"]*)\" is displayed in the start financeround form$")
    public void the_notification_message_is_displayed_in_the_start_financeround_form(String expectedMessage) throws Throwable {
        assertEquals(expectedMessage, financingRoundsPage.getNewRoundNotificationText());
    }
}
