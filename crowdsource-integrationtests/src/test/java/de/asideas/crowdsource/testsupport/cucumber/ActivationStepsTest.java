package de.asideas.crowdsource.testsupport.cucumber;

import de.asideas.crowdsource.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Tests {@link de.asideas.crowdsource.testsupport.cucumber.ActivationSteps}
 */
public class ActivationStepsTest {

    @Test
    public void testExtractActivationToken() {

        final String activationToken = RandomStringUtils.randomAlphanumeric(UserService.ACTIVATION_TOKEN_LENGTH);
        final String testMail = "Hallo Hans Dampf, Du hast Dich gerade auf der CrowdSource Platform angemeldet. Um Deine Registrierung abzuschließen, öffne bitte diesen Link und setze Dein Passwort: http://localhost:8080#/signup/hans.dampf@crowd.source.de/activation/"
                + activationToken
                + " Bei Fragen wende dich an: crowd@asideas.de";

        assertEquals(activationToken, new ActivationSteps().extractActivationTokenFromMessage(testMail));
    }

    @Test
    public void testExtractActivationLink() {

        final String activationToken = RandomStringUtils.randomAlphanumeric(UserService.ACTIVATION_TOKEN_LENGTH);
        final String testMail = "Hallo Hans Dampf, Du hast Dich gerade auf der CrowdSource Platform angemeldet. Um Deine Registrierung abzuschließen, öffne bitte diesen Link und setze Dein Passwort: http://localhost:8080#/signup/hans.dampf@crowd.source.de/activation/"
                + activationToken
                + " Bei Fragen wende dich an: crowd@asideas.de";

        final String expectedLink = "http://localhost:8080#/signup/hans.dampf@crowd.source.de/activation/" + activationToken;
        assertEquals(expectedLink, new ActivationSteps().extractActivationLinkFromMessage(testMail));
    }
}
