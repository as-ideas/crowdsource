package de.asideas.crowdsource.presentation.ideascampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContent;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentList;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.joda.time.DateTime;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Objects;

public class IdeaOut {

    private String id;
    private String creatorName;
    private IdeaStatus status;
    private DateTime creationDate;
    private String rejectionComment;
    private Rating rating;

    @Valid
    @NotNull
    private IdeaContentList content;


    private IdeaOut() {
    }

    public IdeaOut(IdeaEntity ideaEntity) {
        this.id = ideaEntity.getId();
        this.status = ideaEntity.getStatus();
        this.creationDate = ideaEntity.getCreatedDate();
        this.creatorName = ideaEntity.getCreator().getFirstName();
        this.rejectionComment = ideaEntity.getRejectionComment();
        this.content = ideaEntity.getContent();
    }

    public IdeaOut(IdeaEntity ideaEntity, Collection<VoteEntity> votes, UserEntity requestor) {
        this(ideaEntity);
        this.rating = ideaEntity.calculateRating(votes, requestor);
    }

    public IdeaOut(String title, String pitch) {
        IdeaContent original = new IdeaContent(title, pitch);
        this.content = new IdeaContentList(original);
    }

    public IdeaOut(String id, String title, String pitch) {
        this.id = id;
        IdeaContent original = new IdeaContent(title, pitch);
        this.content = new IdeaContentList(original);
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

    public IdeaContentList getContent() { return content; }
    public void setContent(IdeaContentList content) { this.content = content; }

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

    // public String getOriginalTitle() { return this.content.getOriginal().getTitle(); }
    // public String getOriginalPitch() { return this.content.getOriginal().getPitch(); }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaOut idea = (IdeaOut) o;
        return Objects.equals(id, idea.id) &&
            Objects.equals(creatorName, idea.creatorName) &&
            status == idea.status &&
            Objects.equals(creationDate, idea.creationDate) &&
            Objects.equals(content, idea.content) &&
            Objects.equals(rejectionComment, idea.rejectionComment) &&
            Objects.equals(rating, idea.rating);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorName, status, creationDate, content, rejectionComment, rating);
    }

    @Override
    public String toString() {
        return "Idea{" +
            "id='" + id + '\'' +
            ", creatorName='" + creatorName + '\'' +
            ", status=" + status +
            ", creationDate=" + creationDate +
            ", content='" + content + '\'' +
            ", rejectionComment='" + rejectionComment + '\'' +
            ", rating=" + rating +
            '}';
    }
}
