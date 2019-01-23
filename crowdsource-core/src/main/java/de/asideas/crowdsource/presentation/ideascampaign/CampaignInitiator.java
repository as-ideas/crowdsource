package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CampaignInitiator that = (CampaignInitiator) o;
        return Objects.equals(id, that.id) &&
            Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
