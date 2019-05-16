package de.asideas.crowdsource.service.translation;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.domain.service.ideascampaign.VotingService;
import de.asideas.crowdsource.domain.service.user.UserNotificationService;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.Rating;
import de.asideas.crowdsource.presentation.ideascampaign.VoteCmd;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;
import de.asideas.crowdsource.security.CrowdAWSSecretsManager;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;
import de.asideas.crowdsource.testutil.Fixtures;
import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AuthorizationServiceException;

import java.text.MessageFormat;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus.PUBLISHED;
import static de.asideas.crowdsource.testutil.Fixtures.givenIdeaEntity;
import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

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