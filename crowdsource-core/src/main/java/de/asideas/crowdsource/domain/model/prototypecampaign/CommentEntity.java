package de.asideas.crowdsource.domain.model.prototypecampaign;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import de.asideas.crowdsource.domain.model.UserEntity;

// needed for serialization
@Document(collection = "comments")
public class CommentEntity {

    public static final String COLLECTION_NAME = "comments";

    @Id
    private String id;

    @DBRef
    private ProjectEntity project;

    @DBRef
    private UserEntity user;

    private String comment;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    public CommentEntity(ProjectEntity projectEntity, UserEntity commentingUser, String comment) {
        this.project = projectEntity;
        this.user = commentingUser;
        this.comment = comment;
    }

    public CommentEntity() {
    }

    public String getId() {
        return this.id;
    }

    public ProjectEntity getProject() {
        return this.project;
    }

    public UserEntity getUser() {
        return this.user;
    }

    public String getComment() {
        return this.comment;
    }

    public DateTime getCreatedDate() {
        return this.createdDate;
    }

    public DateTime getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    @Override
    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
