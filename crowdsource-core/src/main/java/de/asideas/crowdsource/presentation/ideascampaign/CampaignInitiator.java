package de.asideas.crowdsource.presentation.ideascampaign;

import de.asideas.crowdsource.domain.model.UserEntity;

public class CampaignInitiator {

    private String id;
    private String name;

    private CampaignInitiator(){
    }
    public CampaignInitiator(UserEntity initiatior){
        this.id = initiatior.getId();
        this.name = initiatior.getFullName();
    }

    public CampaignInitiator(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
