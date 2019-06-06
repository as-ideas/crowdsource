package de.asideas.crowdsource.testutil;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignContent;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignContentList;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaIn;
import org.joda.time.DateTime;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.presentation.ideascampaign.CampaignInitiator;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import org.slf4j.Logger;
import static org.slf4j.LoggerFactory.getLogger;

public class Fixtures {

    private static final Logger log = getLogger(Fixtures.class);


    private static IdeasCampaignContent createTestIdeasCampaignContentEntity() {
        return new IdeasCampaignContent("amazing title", "longer description", "tuuuut", "tuuuutImg", "videoImageRef");
    }

    private static IdeasCampaignContentList createTestIdeasCampaignContentEntityList() {
        return new IdeasCampaignContentList(
                createTestIdeasCampaignContentEntity(),
                createTestIdeasCampaignContentEntity()
        );
    }

    public static UserEntity givenUserEntity(String userId) {
        final UserEntity initiator = new UserEntity("test_mail", "test_firstname", "test_lastname");
        initiator.setId(userId);
        return initiator;
    }

    public static IdeaEntity givenIdeaEntity(IdeaIn idea) {
        return givenIdeaEntity(idea, "test_campaignId");
    }

    public static IdeaEntity givenIdeaEntity(IdeaIn idea, String campaignId) {
        return IdeaEntity.createIdeaEntity(idea, campaignId, givenUserEntity("test_userId"));
    }

    public static IdeaEntity givenIdeaEntity() {
        return givenIdeaEntity(new IdeaIn("test_title", "test_pitch"));
    }

    public static IdeaEntity givenIdeaEntity(String ideaId) {
        final IdeaEntity res = givenIdeaEntity(new IdeaIn("test_title", "test_pitch"));
        res.setId(ideaId);
        return res;
    }

    public static IdeasCampaign givenIdeasCampaign(String initiatorUserId) {
        return new IdeasCampaign(
                DateTime.now().minusDays(10),
                DateTime.now().plusDays(2),
                new CampaignInitiator(initiatorUserId, "new username"),
                "better sponsor",
                createTestIdeasCampaignContentEntityList());
    }

    public static IdeasCampaignEntity givenIdeasCampaignEntity(String initiatorUserId) {
        IdeasCampaign campaign = givenIdeasCampaign(initiatorUserId);
        return IdeasCampaignEntity.newIdeasCampaign(campaign, givenUserEntity(initiatorUserId));
    }
}
