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

import de.asideas.crowdsource.domain.model.UserEntity;
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

    private String title;
    private String description;
    private String videoReference;

    private IdeasCampaignEntity(){}

    public static IdeasCampaignEntity newIdeasCampaign(IdeasCampaign creationCmd, UserEntity initiator) {
        final IdeasCampaignEntity res = new IdeasCampaignEntity();
        res.setStartDate(creationCmd.getStartDate());
        res.setEndDate(creationCmd.getEndDate());
        res.setInitiator(initiator);
        res.setTitle(creationCmd.getTitle());
        res.setDescription(creationCmd.getDescription());
        res.setVideoReference(creationCmd.getVideoReference());
        return res;
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
}
