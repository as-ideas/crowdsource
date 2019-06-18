package de.asideas.crowdsource.service.translation;

import de.asideas.crowdsource.security.awssecretsmanager.CrowdAWSSecretsManager;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static de.asideas.crowdsource.testutil.Fixtures.givenIdeaEntity;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.eq;

//@RunWith(MockitoJUnitRunner.class)
public class TranslationServiceTest {

    @InjectMocks
    private TranslationService translationService;

    @Mock
    private CrowdAWSSecretsManager crowdAWSSecretsManager;
/*
    @Test
    public void translateIdea_shouldTranslateIdea() {
        IdeaEntity ideaEntity = givenIdeaEntity();

        translationService.translateIdea(ideaEntity);

        Assert.assertTrue(ideaEntity.getContentEnglish() != null);
        Assert.assertTrue(ideaEntity.getContentGerman() != null);
    }
    */
/*
    @Test(expected = ResourceNotFoundException.class)
    public void createNewIdea_shouldThrowException_OnNotExistingCampaign() {
    }

    @Test(expected = ResourceNotFoundException.class)
    public void updateIdea_shouldThrowException_OnNotExistingIdea() {
    }

    @Test
    public void rejectIdea_shouldPersistRejectedIdea() {
    }

    @Test(expected = ResourceNotFoundException.class)
    public void rejectIdea_shouldThrowException_OnNotExistingIdea() {
    }

    @Test(expected = AuthorizationServiceException.class)
    public void rejectIdea_shouldThrowException_OnNonAdminRequesting() {
    }

    @Test
    public void rejectIdea_shouldThrowException_OnCampaignNotActive() {
    }


    @Test(expected = AuthorizationServiceException.class)
    public void approveIdea_shouldThrowException_OnNonAdminRequesting() {
    }

    @Test(expected = ResourceNotFoundException.class)
    public void approveIdea_shouldThrowException_OnNotExistingIdea() {
    }

    @Test
    public void approveIdea_shouldPersistApprovedIdeaAndNotifyUser() {
    }

    @Test
    public void approveIdea_shouldThrowException_OnCampaignNotActive() {
    }

    @Test
    public void voteForIdea_shouldCallVotingService() {
    }

*/
}