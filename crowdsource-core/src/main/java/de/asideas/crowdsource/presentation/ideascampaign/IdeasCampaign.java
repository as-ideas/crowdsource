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

    private String sponsor;

    private String videoReference;

    private String teaserImageReference;

    private IdeasCampaign() {
    }
    public IdeasCampaign(IdeasCampaignEntity input) {
        this.id = input.getId();
        this.startDate = input.getStartDate();
        this.endDate = input.getEndDate();
        this.campaignInitiator = new CampaignInitiator(input.getInitiator());
        this.sponsor = input.getSponsor();
        this.title = input.getTitle();
        this.description = input.getDescription();
        this.videoReference = input.getVideoReference();
        this.teaserImageReference = input.getTeaserImageReference();

    }
    public IdeasCampaign(DateTime startDate, DateTime endDate, CampaignInitiator campaignInitiator, String sponsor, String title, String description, String videoReference, String teaserImageReference) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.campaignInitiator = campaignInitiator;
        this.sponsor = sponsor;
        this.title = title;
        this.description = description;
        this.videoReference = videoReference;
        this.teaserImageReference = teaserImageReference;
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

    public String getTeaserImageReference() {
        return teaserImageReference;
    }
    public void setTeaserImageReference(String teaserImageReference) {
        this.teaserImageReference = teaserImageReference;
    }

    public String getSponsor() {
        return sponsor;
    }
    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    @Override
    public String toString() {
        return "IdeasCampaign{" +
            "startDate=" + startDate +
            ", endDate=" + endDate +
            ", campaignInitiator=" + campaignInitiator +
            ", sponsor='" + sponsor + '\'' +
            ", title='" + title + '\'' +
            ", description='" + description + '\'' +
            ", videoReference='" + videoReference + '\'' +
            ", teaserImageReference='" + teaserImageReference + '\'' +
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
            Objects.equals(sponsor, that.sponsor) &&
            Objects.equals(title, that.title) &&
            Objects.equals(description, that.description) &&
            Objects.equals(videoReference, that.videoReference) &&
            Objects.equals(teaserImageReference, that.teaserImageReference);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDate, endDate, campaignInitiator, sponsor, title, description, videoReference, teaserImageReference);
    }
}
