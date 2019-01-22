package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import org.joda.time.DateTime;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;


public class IdeasCampaign {

    private String id;

    private DateTime startDate = new DateTime();

    @NotNull
    @Future(message = "end-date-in-future")
    private DateTime endDate;

    private CampaignInitiator campaignInitiator;

    @NotNull
    private String title;

    @NotNull
    private String description;

    private String videoReference;

    private IdeasCampaign() {
    }
    public IdeasCampaign(IdeasCampaignEntity input) {
        this.id = input.getId();
        this.startDate = input.getStartDate();
        this.endDate = input.getEndDate();
        this.campaignInitiator = new CampaignInitiator(input.getInitiator());
        this.title = input.getTitle();
        this.description = input.getDescription();
        this.videoReference = input.getVideoReference();

    }
    public IdeasCampaign(DateTime startDate, DateTime endDate, CampaignInitiator campaignInitiator, String title, String description, String videoReference) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.campaignInitiator = campaignInitiator;
        this.title = title;
        this.description = description;
        this.videoReference = videoReference;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public DateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(DateTime startDate) {
        this.startDate = startDate;
    }

    public DateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(DateTime endDate) {
        this.endDate = endDate;
    }

    public CampaignInitiator getCampaignInitiator() {
        return campaignInitiator;
    }

    public void setCampaignInitiator(CampaignInitiator campaignInitiator) {
        this.campaignInitiator = campaignInitiator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideoReference() {
        return videoReference;
    }

    public void setVideoReference(String videoReference) {
        this.videoReference = videoReference;
    }

    @Override
    public String toString() {
        return "IdeasCampaign{" +
            "startDate=" + startDate +
            ", endDate=" + endDate +
            ", campaignInitiator=" + campaignInitiator +
            ", title='" + title + '\'' +
            ", description='" + description + '\'' +
            ", videoReference='" + videoReference + '\'' +
            '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeasCampaign that = (IdeasCampaign) o;
        return Objects.equals(startDate, that.startDate) &&
            Objects.equals(endDate, that.endDate) &&
            Objects.equals(campaignInitiator, that.campaignInitiator) &&
            Objects.equals(title, that.title) &&
            Objects.equals(description, that.description) &&
            Objects.equals(videoReference, that.videoReference);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDate, endDate, campaignInitiator, title, description, videoReference);
    }
}
