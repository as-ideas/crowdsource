package de.asideas.crowdsource.testsupport.selenium;

import cucumber.api.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebDriverUtils {

    private static final Logger LOG = LoggerFactory.getLogger(WebDriverUtils.class);

    public static void makeScreenshot(WebDriver driver, Scenario scenario) {
        LOG.debug("Capturing screenshot for scenario {}", scenario.getName());
        if (driver instanceof TakesScreenshot) {
            TakesScreenshot screenshotableDriver = (TakesScreenshot) driver;
            try {
                byte[] screenshot = screenshotableDriver.getScreenshotAs(OutputType.BYTES);
                scenario.embed(screenshot, "image/png");
            } catch (WebDriverException somePlatformsDontSupportScreenshots) {
                LOG.error(somePlatformsDontSupportScreenshots.getMessage());
            }
        } else {
            LOG.warn("This web driver implementation {} cannot create screenshots", driver.getClass().getName());
        }
    }

    public static int getPageYOffset(WebDriver webDriver) {
        Object pageYOffset = ((RemoteWebDriver) webDriver).executeScript("return window.pageYOffset;");
        return ((Long) pageYOffset).intValue();
    }
}
