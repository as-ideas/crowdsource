package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.joda.time.DateTime;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;

public class Idea {

    private String id;
    private String creatorName;
    private IdeaStatus status;
    private DateTime creationDate;

    @NotEmpty
    @Size(min = 5, max = 255)
    private String pitch;

    private Idea() {
    }

    public Idea(IdeaEntity ideaEntity) {
        this.id = ideaEntity.getId();
        this.pitch = ideaEntity.getPitch();
        this.status = ideaEntity.getStatus();
        this.creationDate = ideaEntity.getCreatedDate();
        this.creatorName = ideaEntity.getCreator().getFirstName();
    }

    public Idea(String pitch) {
        this.pitch = pitch;
    }

    public Idea(String id, String pitch) {
        this.id = id;
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

    public String getPitch() {
        return pitch;
    }

    public void setPitch(String pitch) {
        this.pitch = pitch;
    }

    @Override
    public String toString() {
        return "Idea{" +
            "id='" + id + '\'' +
            ", creatorName='" + creatorName + '\'' +
            ", status=" + status +
            ", creationDate=" + creationDate +
            ", pitch='" + pitch + '\'' +
            '}';
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
            Objects.equals(pitch, idea.pitch);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorName, status, creationDate, pitch);
    }
}
