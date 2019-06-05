package de.asideas.crowdsource.domain.model.ideascampaign;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Objects;

public class IdeasCampaignContentList {

    @Valid
    @NotNull
    private IdeasCampaignContent de;

    @Valid
    @NotNull
    private IdeasCampaignContent en;

    private IdeasCampaignContentList() {
    }

    public IdeasCampaignContentList(IdeasCampaignContent de, IdeasCampaignContent en) {
        this.de = de;
        this.en = en;
    }

    public IdeasCampaignContent getDe() {
        return de;
    }
    public void setDe(IdeasCampaignContent de) { this.de = de; }

    public IdeasCampaignContent getEn() {
        return en;
    }
    public void setEn(IdeasCampaignContent en) { this.en = en; }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeasCampaignContentList that = (IdeasCampaignContentList) o;
        return Objects.equals(de, that.de) &&
                Objects.equals(en, that.en);
    }

    @Override
    public int hashCode() {
        return Objects.hash(de, en);
    }


    @Override
    public String toString() {
        return "IdeasCampaignContentList{" +
                "de=" + de +
                ", en=" + en +
                '}';
    }
}
