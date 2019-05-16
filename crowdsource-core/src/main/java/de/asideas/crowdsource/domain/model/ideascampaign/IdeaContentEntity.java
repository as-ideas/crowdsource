package de.asideas.crowdsource.domain.model.ideascampaign;

import java.io.Serializable;
import java.util.Objects;

public class IdeaContentEntity implements Serializable {

    private String language;

    private String title;

    private String pitch;

    private IdeaContentEntity() {
    }

    public IdeaContentEntity(String title, String pitch) {
        this.title = title;
        this.pitch = pitch;
    }

    public IdeaContentEntity(String language, String title, String pitch) {
        this.language = language;
        this.title = title;
        this.pitch = pitch;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IdeaContentEntity that = (IdeaContentEntity) o;
        return Objects.equals(language, that.language) &&
                Objects.equals(title, that.title) &&
                Objects.equals(pitch, that.pitch);
    }

    @Override
    public int hashCode() {

        return Objects.hash(language, title, pitch);
    }

    @Override
    public String toString() {
        return "IdeaContentEntity{" +
                "language='" + language + '\'' +
                ", title='" + title + '\'' +
                ", pitch='" + pitch + '\'' +
                '}';
    }

}
