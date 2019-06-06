package de.asideas.crowdsource.presentation.ideascampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18n;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18nMap;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.VoteEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
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
    private IdeaContentI18nMap contentI18n;


    private IdeaOut() {
    }

    public IdeaOut(IdeaEntity ideaEntity) {
        this.id = ideaEntity.getId();
        this.status = ideaEntity.getStatus();
        this.creationDate = ideaEntity.getCreatedDate();
        this.creatorName = ideaEntity.getCreator().getFirstName();
        this.rejectionComment = ideaEntity.getRejectionComment();
        this.contentI18n = ideaEntity.getContentI18n();
    }

    public IdeaOut(IdeaEntity ideaEntity, Collection<VoteEntity> votes, UserEntity requestor) {
        this(ideaEntity);
        this.rating = ideaEntity.calculateRating(votes, requestor);
    }

    public IdeaOut(String title, String pitch) {
        IdeaContentI18n original = new IdeaContentI18n(title, pitch);
        this.contentI18n = new IdeaContentI18nMap(original);
    }

    public IdeaOut(String id, String title, String pitch) {
        this.id = id;
        IdeaContentI18n original = new IdeaContentI18n(title, pitch);
        this.contentI18n = new IdeaContentI18nMap(original);
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

    public IdeaContentI18nMap getContentI18n() { return contentI18n; }
    public void setContentI18n(IdeaContentI18nMap contentI18n) { this.contentI18n = contentI18n; }

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
            Objects.equals(contentI18n, idea.contentI18n) &&
            Objects.equals(rejectionComment, idea.rejectionComment) &&
            Objects.equals(rating, idea.rating);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorName, status, creationDate, contentI18n, rejectionComment, rating);
    }

    @Override
    public String toString() {
        return "Idea{" +
            "id='" + id + '\'' +
            ", creatorName='" + creatorName + '\'' +
            ", status=" + status +
            ", creationDate=" + creationDate +
            ", content='" + contentI18n + '\'' +
            ", rejectionComment='" + rejectionComment + '\'' +
            ", rating=" + rating +
            '}';
    }
}
