package de.asideas.crowdsource.service.ideascampaign;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;

@Service
public class IdeasCampaignService {

    private IdeasCampaignRepository ideasCampaignRepository;

    @Autowired
    public IdeasCampaignService(IdeasCampaignRepository ideasCampaignRepository) {
        this.ideasCampaignRepository = ideasCampaignRepository;
    }

    public List<IdeasCampaign> activeCampaigns(){
        return toIdeasCampaigns(ideasCampaignRepository.findActive(DateTime.now()));
    }

    /**
     * @return all campaigns ordered by <code>campaign.endDate</code> ASC
     */
    public List<IdeasCampaign> allCampaigns(){
        final List<IdeasCampaign> campaigns = toIdeasCampaigns(ideasCampaignRepository.findAll(new Sort(new Sort.Order(Sort.Direction.ASC, "endDate"))));
        // This sort order yields two groupings - the active campaigns (1st) and the inactive (2nd)
        // within these groups the sort order is determined by the campaigns' end dates
        campaigns.sort((o1, o2) -> {
            if (o1.isActive() == o2.isActive()) {
                return o2.getEndDate().compareTo(o1.getEndDate());
            }
            if (o1.isActive() && !o2.isActive()) {
                return -1;
            }
            if (!o1.isActive() && o2.isActive()) {
                return +1;
            }
            return 0;
        });
        return campaigns;
    }

    public IdeasCampaign createCampaign(IdeasCampaign cmd, UserEntity requestingUser) {
        final IdeasCampaignEntity res = IdeasCampaignEntity.newIdeasCampaign(cmd, requestingUser);
        final IdeasCampaignEntity savedRes = ideasCampaignRepository.save(res);

        return new IdeasCampaign(savedRes);
    }

    public IdeasCampaign updateMasterdata(IdeasCampaign cmd) {
        final IdeasCampaignEntity storedCampaign = ideasCampaignRepository.findOne(cmd.getId());
        storedCampaign.updateMasterdata(cmd);

        return new IdeasCampaign(ideasCampaignRepository.save(storedCampaign));
    }

    public IdeasCampaign fetchCampaign(String campaignId) {
        final IdeasCampaignEntity existingCampaign = ideasCampaignRepository.findOne(campaignId);
        if (existingCampaign == null) {
            throw new ResourceNotFoundException();
        }
        return new IdeasCampaign(existingCampaign);
    }

    private List<IdeasCampaign> toIdeasCampaigns(List<IdeasCampaignEntity> in) {
        return in.stream().map(IdeasCampaign::new).collect(Collectors.toList());
    }

}
