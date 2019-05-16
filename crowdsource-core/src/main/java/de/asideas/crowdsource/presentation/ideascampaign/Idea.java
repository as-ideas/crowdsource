package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Collection;
import java.util.Objects;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.joda.time.DateTime;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;

public class Idea {

    private String id;
    private String creatorName;
    private IdeaStatus status;
    private DateTime creationDate;

    @NotEmpty
    @Size(min = 5, max = 30)
    private String title;

    @NotEmpty
    @Size(min = 5, max = 255)
    private String pitch;

    private String rejectionComment;

    private Rating rating;

    private Idea() {
    }

    public Idea(IdeaEntity ideaEntity) {
        this.id = ideaEntity.getId();
        this.title = ideaEntity.getOriginalTitle();
        this.pitch = ideaEntity.getOriginalPitch();
        this.status = ideaEntity.getStatus();
        this.creationDate = ideaEntity.getCreatedDate();
        this.creatorName = ideaEntity.getCreator().getFirstName();
        this.rejectionComment = ideaEntity.getRejectionComment();
    }

    public Idea(IdeaEntity ideaEntity, Collection<VoteEntity> votes, UserEntity requestor) {
        this(ideaEntity);
        this.rating = ideaEntity.calculateRating(votes, requestor);
    }

    public Idea(String title, String pitch) {
        this.title = title;
        this.pitch = pitch;
    }

    public Idea(String id, String title, String pitch) {
        this.id = id;
        this.title = title;
        this.pitch = pitch;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCreatorName() {
        return creatorName;
    }
    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public IdeaStatus getStatus() {
        return status;
    }
    public void setStatus(IdeaStatus status) {
        this.status = status;
    }

    public DateTime getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(DateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getPitch() {
        return pitch;
    }
    public void setPitch(String pitch) {
        this.pitch = pitch;
    }

    public String getRejectionComment() {
        return rejectionComment;
    }
    public void setRejectionComment(String rejectionComment) {
        this.rejectionComment = rejectionComment;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Idea idea = (Idea) o;
        return Objects.equals(id, idea.id) &&
            Objects.equals(creatorName, idea.creatorName) &&
            status == idea.status &&
            Objects.equals(creationDate, idea.creationDate) &&
            Objects.equals(title, idea.title) &&
            Objects.equals(pitch, idea.pitch) &&
            Objects.equals(rejectionComment, idea.rejectionComment) &&
            Objects.equals(rating, idea.rating);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorName, status, creationDate, title, pitch, rejectionComment, rating);
    }

    @Override
    public String toString() {
        return "Idea{" +
            "id='" + id + '\'' +
            ", creatorName='" + creatorName + '\'' +
            ", status=" + status +
            ", creationDate=" + creationDate +
            ", title='" + title + '\'' +
            ", pitch='" + pitch + '\'' +
            ", rejectionComment='" + rejectionComment + '\'' +
            ", rating=" + rating +
            '}';
    }
}
