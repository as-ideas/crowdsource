package de.asideas.crowdsource.domain.model.prototypecampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.LikeStatus;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
public class LikeEntity {

    @Id
    private String id;
    // default status == LIKE
    private LikeStatus status = LikeStatus.LIKE;
    @DBRef
    private ProjectEntity project;
    @DBRef
    private UserEntity user;
    @CreatedDate
    private DateTime createdDate;
    @LastModifiedDate
    private DateTime lastModifiedDate;

    public LikeEntity() {
    }

    public LikeEntity(LikeStatus status, ProjectEntity project, UserEntity user) {
        this.status = status;
        this.project = project;
        this.user = user;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LikeStatus getStatus() {
        return status;
    }

    public void setStatus(LikeStatus status) {
        this.status = status;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
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
}
