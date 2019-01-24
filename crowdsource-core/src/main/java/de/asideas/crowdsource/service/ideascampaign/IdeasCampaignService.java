package de.asideas.crowdsource.service.ideascampaign;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<IdeasCampaign> allCampaigns(){
        return toIdeasCampaigns(ideasCampaignRepository.findAll());
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

    private List<IdeasCampaign> toIdeasCampaigns(List<IdeasCampaignEntity> in) {
        return in.stream().map(IdeasCampaign::new).collect(Collectors.toList());
    }

    public Optional<IdeasCampaign> getCampaign(String campaignId) {
        final IdeasCampaignEntity existingCampaign = ideasCampaignRepository.findOne(campaignId);
        return Optional.ofNullable(existingCampaign).map(IdeasCampaign::new);
    }
}
