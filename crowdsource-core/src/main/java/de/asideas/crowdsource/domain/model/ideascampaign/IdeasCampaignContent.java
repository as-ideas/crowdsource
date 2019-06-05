package de.asideas.crowdsource.domain.model.ideascampaign;

import javax.validation.constraints.NotNull;
import java.util.Objects;

public class IdeasCampaignContent {

    @NotNull
    private String title;

    @NotNull
    private String description;

    @NotNull
    private String teaserImageReference;

    @NotNull
    private String videoReference;

    @NotNull
    private String videoImageReference;

    private IdeasCampaignContent() {
    }

    public IdeasCampaignContent(String title, String description, String teaserImageReference, String videoReference, String videoImageReference) {
        this.title = title;
        this.description = description;
        this.teaserImageReference = teaserImageReference;
        this.videoReference = videoReference;
        this.videoImageReference =  videoImageReference;
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

    public String getTeaserImageReference() {
        return teaserImageReference;
    }
    public void setTeaserImageReference(String teaserImageReference) { this.teaserImageReference = teaserImageReference; }

    public String getVideoReference() {
        return videoReference;
    }
    public void setVideoReference(String videoReference) {
        this.videoReference = videoReference;
    }

    public String getVideoImageReference() {
        return videoImageReference;
    }
    public void setVideoImageReference(String videoImageReference) {
        this.videoImageReference = videoImageReference;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeasCampaignContent that = (IdeasCampaignContent) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(description, that.description) &&
                Objects.equals(teaserImageReference, that.teaserImageReference) &&
                Objects.equals(videoImageReference, that.videoImageReference) &&
                Objects.equals(videoReference, that.videoReference);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, description, teaserImageReference, videoReference, videoImageReference);
    }

    @Override
    public String toString() {
        return "IdeasCampaignContent{" +
                "title='" + title + '\'' +
                ", description=" + description +
                ", teaserImageReference=" + teaserImageReference +
                ", videoReference=" + videoReference +
                ", videoReference=" + videoImageReference +
                '}';
    }

}
