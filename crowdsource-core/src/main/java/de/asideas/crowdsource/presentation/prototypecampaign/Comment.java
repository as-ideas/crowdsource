package de.asideas.crowdsource.presentation.prototypecampaign;

import de.asideas.crowdsource.domain.model.prototypecampaign.CommentEntity;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.NotEmpty;
import org.joda.time.DateTime;

public class Comment {

    private DateTime created;

    private String userName;

    @NotEmpty
    private String comment;

    public Comment(CommentEntity commentEntity) {
        this.created = commentEntity.getCreatedDate();
        this.userName = commentEntity.getUser().getFullName();
        this.comment = commentEntity.getComment();
    }

    @java.beans.ConstructorProperties({"created", "userName", "comment"})
    public Comment(DateTime created, String userName, String comment) {
        this.created = created;
        this.userName = userName;
        this.comment = comment;
    }

    public Comment() {
    }

    public DateTime getCreated() {
        return this.created;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getComment() {
        return this.comment;
    }

    public void setCreated(DateTime created) {
        this.created = created;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setComment(String comment) {
        this.comment = comment;
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
