package de.asideas.crowdsource.domain.model.ideascampaign;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

public class IdeaContent implements Serializable {


    @NotEmpty
    @Size(min = 5, max = 30)
    private String title;

    @NotEmpty
    @Size(min = 5, max = 255)
    private String pitch;

    private IdeaContent() {
    }

    public IdeaContent(String title, String pitch) {
        this.title = title;
        this.pitch = pitch;
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
        IdeaContent that = (IdeaContent) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(pitch, that.pitch);
    }

    @Override
    public int hashCode() {

        return Objects.hash(title, pitch);
    }

    @Override
    public String toString() {
        return "IdeaContent{" +
                ", title='" + title + '\'' +
                ", pitch='" + pitch + '\'' +
                '}';
    }

}
