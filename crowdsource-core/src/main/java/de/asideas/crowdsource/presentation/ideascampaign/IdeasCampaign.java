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

    private boolean active;

    private boolean expired;

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
        this.active = input.isActive();
        this.expired = input.isExpired();
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

    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isExpired() {
        return expired;
    }
    public void isExpired(boolean expired) {
        this.expired = expired;
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
        return active == that.active &&
            expired == that.expired &&
            Objects.equals(id, that.id) &&
            Objects.equals(startDate, that.startDate) &&
            Objects.equals(endDate, that.endDate) &&
            Objects.equals(campaignInitiator, that.campaignInitiator) &&
            Objects.equals(title, that.title) &&
            Objects.equals(description, that.description) &&
            Objects.equals(sponsor, that.sponsor) &&
            Objects.equals(videoReference, that.videoReference) &&
            Objects.equals(teaserImageReference, that.teaserImageReference);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startDate, endDate, campaignInitiator, title, description, sponsor, videoReference, teaserImageReference, active, expired);
    }

    @Override
    public String toString() {
        return "IdeasCampaign{" +
            "id='" + id + '\'' +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", campaignInitiator=" + campaignInitiator +
            ", title='" + title + '\'' +
            ", description='" + description + '\'' +
            ", sponsor='" + sponsor + '\'' +
            ", videoReference='" + videoReference + '\'' +
            ", teaserImageReference='" + teaserImageReference + '\'' +
            ", active=" + active +
            ", expired=" + expired +
            '}';
    }
}
