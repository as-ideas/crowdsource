package de.asideas.crowdsource.domain.service.ideascampaign;

import org.joda.time.DateTime;
import org.springframework.util.Assert;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;

public class VotingService {

    public void voteForIdea(IdeaEntity idea, IdeasCampaignEntity campaign, UserEntity voter, int vote){

        Assert.isTrue(idea.getCampaignId().equals(campaign.getId()), "Idea must belong to the campaign.");
        Assert.isTrue(vote > -1, "Vote value out of bounds: " + vote);
        Assert.isTrue(vote < 6, "Vote value out of bounds: " + vote);
        Assert.isTrue(DateTime.now().isBefore(campaign.getEndDate()), "Time of voting must be before the campaign's expiration date.");
    }

}
