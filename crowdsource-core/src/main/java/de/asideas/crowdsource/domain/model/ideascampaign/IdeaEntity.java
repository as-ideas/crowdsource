package de.asideas.crowdsource.domain.model.ideascampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ideas")
public class IdeaEntity {

    private static final Logger log = LoggerFactory.getLogger(IdeaEntity.class);

    @Id
    private String id;

    private String pitch;

    private String status;

    private String comment;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    private DateTime approvalDate;

    @DBRef
    private UserEntity creator;

    private UserEntity approvingAdmin;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPitch() {
        return pitch;
    }

    public void setPitch(String pitch) {
        this.pitch = pitch;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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

    public DateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(DateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public UserEntity getCreator() {
        return creator;
    }

    public void setCreator(UserEntity creator) {
        this.creator = creator;
    }

    public UserEntity getApprovingAdmin() {
        return approvingAdmin;
    }

    public void setApprovingAdmin(UserEntity approvingAdmin) {
        this.approvingAdmin = approvingAdmin;
    }

    private IdeaEntity() {
    }

}
