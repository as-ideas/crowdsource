package de.asideas.crowdsource.testutil;

import org.joda.time.DateTime;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

public class Fixtures {

    public static UserEntity givenUserEntity(String userId) {
        final UserEntity initiator = new UserEntity("test_mail", "test_firstname", "test_lastname");
        initiator.setId(userId);
        return initiator;
    }

    public static IdeaEntity givenIdeaEntity(Idea idea) {
        return givenIdeaEntity(idea, "test_campaignId");
    }

    public static IdeaEntity givenIdeaEntity(Idea idea, String campaignId) {
        return IdeaEntity.createIdeaEntity(idea, campaignId, givenUserEntity("test_userId"));
    }

    public static IdeaEntity givenIdeaEntity() {
        return givenIdeaEntity(new Idea("test_title", "test_pitch"));
    }

    public static IdeaEntity givenIdeaEntity(String ideaId) {
        final IdeaEntity res = givenIdeaEntity(new Idea("test_title", "test_pitch"));
        res.setId(ideaId);
        return res;
    }

    public static IdeasCampaign givenIdeasCampaign(String initiatorUserId) {
        return new IdeasCampaign(DateTime.now().minusDays(10), DateTime.now().plusDays(2),
                new CampaignInitiator(initiatorUserId, "new username"), "better sponsor", "amazing title", "longer description", "tuuuut", "usw");
    }

    public static IdeasCampaignEntity givenIdeasCampaignEntity(String initiatorUserId) {
        return IdeasCampaignEntity.newIdeasCampaign(givenIdeasCampaign(initiatorUserId), givenUserEntity(initiatorUserId));
    }
}
