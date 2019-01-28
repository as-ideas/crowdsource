package de.asideas.crowdsource.service.ideascampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.testutil.Fixtures;

import static org.mockito.Mockito.doReturn;

@RunWith(MockitoJUnitRunner.class)
public class IdeaServiceTest {

    @InjectMocks
    private IdeaService ideaService;

    @Mock
    private IdeaRepository ideaRepository;

    @Mock
    private IdeasCampaignRepository ideasCampaignRepository;

    @Test(expected = ResourceNotFoundException.class)
    public void createNewIdea_shouldThrowException_OnNotExistingCampaign() {

        String campaignId = "testcampaignid";
        givenIdeaCampaignDoesntExist(campaignId);

        ideaService.createNewIdea(campaignId, new Idea("test_title", "Tu wat!"), Fixtures.givenUserEntity("123459"));

    }

    @Test(expected = ResourceNotFoundException.class)
    public void updateIdea_shouldThrowException_OnNotExistingIdea() {
        final String missingIdeaId = "idea27";
        givenIdeaDoesntExist(missingIdeaId);

        ideaService.modifyIdea(missingIdeaId, new Idea("test_title", "my faulty pitch"), new UserEntity());
    }

    private void givenIdeaCampaignDoesntExist(String campaignId) {
        doReturn(false).when(ideasCampaignRepository).exists(campaignId);
    }

    private void givenIdeaDoesntExist(String ideaId) {
        doReturn(false).when(ideaRepository).exists(ideaId);
    }

}