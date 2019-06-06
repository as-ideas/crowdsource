package de.asideas.crowdsource.presentation.ideascampaign;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;
import java.util.Objects;

public class IdeaIn {

    private String id;
    private String creatorName;

    @NotEmpty
    @Size(min = 5, max = 30)
    private String title;

    @NotEmpty
    @Size(min = 5, max = 255)
    private String pitch;

    private String rejectionComment;



    private IdeaIn() {
    }

    public IdeaIn(String title, String pitch) {
        this.title = title;
        this.pitch = pitch;
    }

    public IdeaIn(String id, String title, String pitch) {
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

    public String getRejectionComment() {
        return rejectionComment;
    }
    public void setRejectionComment(String rejectionComment) {
        this.rejectionComment = rejectionComment;
    }

    public String getTitle() { return this.title; }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getPitch() { return this.pitch; }
    public void setPitch(String pitch) { this.pitch = pitch; }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaIn idea = (IdeaIn) o;
        return Objects.equals(id, idea.id) &&
            Objects.equals(creatorName, idea.creatorName) &&
            Objects.equals(title, idea.title) &&
            Objects.equals(pitch, idea.pitch) &&
            Objects.equals(rejectionComment, idea.rejectionComment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorName, title, pitch, rejectionComment);
    }

    @Override
    public String toString() {
        return "Idea{" +
            "id='" + id + '\'' +
            ", creatorName='" + creatorName + '\'' +
            ", title=" + title +
            ", pitch='" + pitch + '\'' +
            ", rejectionComment='" + rejectionComment + '\'' +
            '}';
    }
}
