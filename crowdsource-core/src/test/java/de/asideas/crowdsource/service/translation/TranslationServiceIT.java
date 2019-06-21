package de.asideas.crowdsource.service.translation;

import de.asideas.crowdsource.AbstractCrowdIT;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18n;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.security.awssecretsmanager.CrowdAWSSecretsManager;

import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

import static de.asideas.crowdsource.testutil.Fixtures.givenIdeaEntity;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.eq;

@Ignore("Unignore for debugging!")
@TestPropertySource(properties = {
    "de.asideas.crowdsource.aws-secrets-manager.accessKeyId=SET_VALID_VALUE_HERE",
    "de.asideas.crowdsource.aws-secrets-manager.awsSecretKey=SET_VALID_VALUE_HERE"
})
public class TranslationServiceIT extends AbstractCrowdIT {

    @Autowired
    private TranslationService translationService;


    @Test
    public void translateIdea_shouldTranslateIdea_andRetainUmlauts() {
        IdeaEntity ideaEntity = givenIdeaEntityWithUmlauts();

        translationService.translateIdea(ideaEntity);

        assertThat(ideaEntity.getContentI18n().getDe(), not(nullValue()));
        assertThat(ideaEntity.getContentI18n().getDe().getTitle(), equalTo("Schöne neue Welt."));
        assertThat(ideaEntity.getContentI18n().getDe().getPitch(), equalTo("Üble Sache das."));

        assertThat(ideaEntity.getContentI18n().getEn(), not(nullValue()));
        assertThat(ideaEntity.getContentI18n().getEn().getTitle(), equalTo("Beautiful new world."));
    }


    private IdeaEntity givenIdeaEntityWithUmlauts() {
        final IdeaEntity res = givenIdeaEntity();
        res.getContentI18n().setOriginal(new IdeaContentI18n("Schöne neue Welt.", "Üble Sache das."));
        return res;
    }
}