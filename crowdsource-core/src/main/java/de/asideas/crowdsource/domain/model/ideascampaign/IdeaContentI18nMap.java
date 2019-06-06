package de.asideas.crowdsource.domain.model.ideascampaign;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class IdeaContentI18nMap implements Serializable {

    private String originalLanguage;

    @Valid
    @NotNull
    private IdeaContentI18n original;

    private IdeaContentI18n de;

    private IdeaContentI18n en;


    private IdeaContentI18nMap() {
    }

    public IdeaContentI18nMap(String originalTitle, String originalPitch) {
        this.original = new IdeaContentI18n(originalTitle, originalPitch);
    }

    public IdeaContentI18nMap(IdeaContentI18n original) {
        this.original = original;
    }

    public IdeaContentI18nMap(String originalLanguage, IdeaContentI18n original, IdeaContentI18n de, IdeaContentI18n en) {
        this.original = original;
        this.de = de;
        this.en = en;
        this.originalLanguage = originalLanguage;
    }

    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) {
        this.originalLanguage = originalLanguage;
    }

    public IdeaContentI18n getOriginal() { return original; }
    public void setOriginal(IdeaContentI18n original) {
        this.original = original;
    }

    public IdeaContentI18n getDe() { return de; }
    public void setDe(IdeaContentI18n de) {
        this.de = de;
    }

    public IdeaContentI18n getEn() { return en; }
    public void setEn(IdeaContentI18n en) {
        this.en = en;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IdeaContentI18nMap that = (IdeaContentI18nMap) o;
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
        return "IdeaContentI18nMap{" +
                "originalLanguage='" + originalLanguage + '\'' +
                ", original='" + original + '\'' +
                ", de='" + de + '\'' +
                ", en='" + en + '\'' +
                '}';
    }

}
