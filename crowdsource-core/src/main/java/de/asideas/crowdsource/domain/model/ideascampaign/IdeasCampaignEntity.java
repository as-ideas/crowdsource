package de.asideas.crowdsource.domain.model.ideascampaign;

import java.util.Objects;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;

@Document(collection = "ideascampaigns")
public class IdeasCampaignEntity {

    private static final Logger log = LoggerFactory.getLogger(IdeasCampaignEntity.class);

    @Id
    private String id;

    private DateTime startDate;

    private DateTime endDate;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    @DBRef
    private UserEntity initiator;

    private String sponsor;

    private IdeasCampaignContentList content;


    private IdeasCampaignEntity() {
    }

    public static IdeasCampaignEntity newIdeasCampaign(IdeasCampaign creationCmd, UserEntity initiator) {

        log.info(creationCmd.toString());
        log.debug(creationCmd.toString());
        verifyActiveTimeSpan(creationCmd);

        final IdeasCampaignEntity res = new IdeasCampaignEntity();
        res.setStartDate(creationCmd.getStartDate());
        res.setEndDate(creationCmd.getEndDate());
        res.setInitiator(initiator);
        res.setSponsor(creationCmd.getSponsor());
        res.setContent(creationCmd.getContent());

        return res;
    }

    private static void verifyActiveTimeSpan(IdeasCampaign creationCmd) {
        if (creationCmd.getStartDate() == null || creationCmd.getEndDate() == null) {
            throw new IllegalArgumentException("startDate and endDate must not be null.");
        }
        if (creationCmd.getEndDate().isBefore(creationCmd.getStartDate())) {
            throw new IllegalArgumentException("endDate must be after startDate.");
        }
    }

    public void updateMasterdata(IdeasCampaign cmd) {
        verifyActiveTimeSpan(cmd);

        this.setStartDate(cmd.getStartDate());
        this.setEndDate(cmd.getEndDate());
        this.setSponsor(cmd.getSponsor());
        this.setContent(cmd.getContent());

    }

    public boolean isActive() {
        return this.startDate.isBeforeNow() && this.endDate.isAfterNow();
    }

    public boolean isExpired() {
        return this.endDate.isBeforeNow();
    }

    public IdeaEntity createIdea(Idea cmd, UserEntity creator) {
        if (!this.isActive()) {
            throw InvalidRequestException.campaignNotActive();
        }
        return IdeaEntity.createIdeaEntity(cmd, this.getId(), creator);
    }

    public IdeaEntity approveIdea(IdeaEntity ideaToApprove, UserEntity approvingAdmin) {
        if (!this.isActive()) {
            throw InvalidRequestException.campaignNotActive();
        }
        ideaToApprove.approveIdea(approvingAdmin);
        return ideaToApprove;
    }

    public IdeaEntity rejectIdea(IdeaEntity ideaToReject, UserEntity approvingAdmin, String rejectionComment) {
        if (!this.isActive()) {
            throw InvalidRequestException.campaignNotActive();
        }
        ideaToReject.rejectIdea(approvingAdmin, rejectionComment);
        return ideaToReject;
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

    public DateTime getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public DateTime getLastModifiedDate() {
        return lastModifiedDate;
    }
    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public UserEntity getInitiator() {
        return initiator;
    }
    public void setInitiator(UserEntity initiator) {
        this.initiator = initiator;
    }

    public String getSponsor() {
        return sponsor;
    }
    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    public IdeasCampaignContentList getContent() {
        return content;
    }
    public void setContent(IdeasCampaignContentList content) {
        this.content = content;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeasCampaignEntity that = (IdeasCampaignEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "IdeasCampaignEntity{" +
                "id='" + id + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", active=" + createdDate +
                ", expired=" + lastModifiedDate +
                ", initiator=" + initiator +
                ", content=" + content +
                '}';
    }

}
