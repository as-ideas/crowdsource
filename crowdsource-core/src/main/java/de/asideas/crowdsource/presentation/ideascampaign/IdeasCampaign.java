package de.asideas.crowdsource.presentation.ideascampaign;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignContentI18nMap;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import org.joda.time.DateTime;
import org.slf4j.Logger;

import javax.validation.Valid;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import java.util.Objects;

import static org.slf4j.LoggerFactory.getLogger;


public class IdeasCampaign {

    private String id;

    private DateTime startDate = new DateTime();

    @NotNull
    @Future(message = "end-date-in-future")
    private DateTime endDate;

    private CampaignInitiator campaignInitiator;

    private boolean active;

    private boolean expired;

    private String sponsor;

    @Valid
    @NotNull
    private IdeasCampaignContentI18nMap contentI18n;


    private static final Logger log = getLogger(IdeasCampaign.class);


    private IdeasCampaign() {
    }

    public IdeasCampaign(IdeasCampaignEntity input) {

//        log.debug(input.toString());
//        log.info(input.toString());

        this.id = input.getId();
        this.startDate = input.getStartDate();
        this.endDate = input.getEndDate();
        this.campaignInitiator = new CampaignInitiator(input.getInitiator());
        this.sponsor = input.getSponsor();
        this.active = input.isActive();
        this.expired = input.isExpired();
        this.contentI18n = input.getContent();
    }

    public IdeasCampaign(DateTime startDate, DateTime endDate, CampaignInitiator campaignInitiator, String sponsor, IdeasCampaignContentI18nMap contentI18n) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.campaignInitiator = campaignInitiator;
        this.sponsor = sponsor;
        this.contentI18n = contentI18n;
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
    public void setCampaignInitiator(CampaignInitiator campaignInitiator) { this.campaignInitiator = campaignInitiator; }

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

    public boolean isExpired() { return expired; }
    public void isExpired(boolean expired) { this.expired = expired; }

    public IdeasCampaignContentI18nMap getContentI18n() { return contentI18n; }
    public void setContentI18n(IdeasCampaignContentI18nMap contentI18n) { this.contentI18n = contentI18n; }


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
            Objects.equals(sponsor, that.sponsor) &&
            Objects.equals(contentI18n, that.contentI18n);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startDate, endDate, campaignInitiator, sponsor, active, expired, contentI18n);
    }

    @Override
    public String toString() {
        return "IdeasCampaign{" +
            "id='" + id + '\'' +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", campaignInitiator=" + campaignInitiator +
            ", active=" + active +
            ", expired=" + expired +
            ", content=" + contentI18n +
            '}';
    }
}
