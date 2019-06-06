package de.asideas.crowdsource.domain.model.ideascampaign;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class IdeaContentList implements Serializable {

    private String originalLanguage;

    @Valid
    @NotNull
    private IdeaContent original;

    private IdeaContent de;

    private IdeaContent en;


    private IdeaContentList() {
    }

    public IdeaContentList(String originalTitle, String originalPitch) {
        this.original = new IdeaContent(originalTitle, originalPitch);
    }

    public IdeaContentList(IdeaContent original) {
        this.original = original;
    }

    public IdeaContentList(String originalLanguage, IdeaContent original, IdeaContent de, IdeaContent en) {
        this.original = original;
        this.de = de;
        this.en = en;
        this.originalLanguage = originalLanguage;
    }

    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) {
        this.originalLanguage = originalLanguage;
    }

    public IdeaContent getOriginal() { return original; }
    public void setOriginal(IdeaContent original) {
        this.original = original;
    }

    public IdeaContent getDe() { return de; }
    public void setDe(IdeaContent de) {
        this.de = de;
    }

    public IdeaContent getEn() { return en; }
    public void setEn(IdeaContent en) {
        this.en = en;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IdeaContentList that = (IdeaContentList) o;
        return Objects.equals(originalLanguage, that.originalLanguage) &&
                Objects.equals(original, that.original) &&
                Objects.equals(de, that.de) &&
                Objects.equals(en, that.en);
    }

    @Override
    public int hashCode() {

        return Objects.hash(originalLanguage, original, de, en);
    }

    @Override
    public String toString() {
        return "IdeaContentList{" +
                "originalLanguage='" + originalLanguage + '\'' +
                ", original='" + original + '\'' +
                ", de='" + de + '\'' +
                ", en='" + en + '\'' +
                '}';
    }

}
