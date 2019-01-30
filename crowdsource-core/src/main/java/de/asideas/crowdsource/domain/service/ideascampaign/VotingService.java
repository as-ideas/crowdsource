package de.asideas.crowdsource.domain.service.ideascampaign;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteId;
import de.asideas.crowdsource.repository.ideascampaign.VoteRepository;

@Service
public class VotingService {

    @Autowired
    private VoteRepository voteRepository;

    public void voteForIdea(IdeaEntity idea, IdeasCampaignEntity campaign, UserEntity voter, int vote) {
        Assert.isTrue(idea.getCampaignId().equals(campaign.getId()), "Idea must belong to the campaign.");

        if (DateTime.now().isBefore(campaign.getStartDate()) || DateTime.now().isAfter(campaign.getEndDate())) {
            throw InvalidRequestException.campaignNotActive();
        }

        if (vote == 0) {
            voteRepository.delete(new VoteId(voter.getId(), idea.getId()));
        } else {
            final VoteEntity voteRes = idea.vote(voter, vote);
            voteRepository.save(voteRes);
        }

    }

}
