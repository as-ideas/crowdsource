package de.asideas.crowdsource.presentation.ideascampaign;

import org.hibernate.validator.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Objects;

public class IdeaContent {

    @NotEmpty
    @Size(min = 5, max = 30)
    private String title;

    @NotEmpty
    @Size(min = 5, max = 255)
    private String pitch;

    // TODO: Refactor tests and test data.
    // This constructor should not be needed? Or is it always needed for deserialization?
    public IdeaContent() {
        this.title = "Only for compability with IT tests";
        this.pitch = "Only for compability with IT tests";
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
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaContent idea = (IdeaContent) o;
        return Objects.equals(title, idea.title) &&
            Objects.equals(pitch, idea.pitch);
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
