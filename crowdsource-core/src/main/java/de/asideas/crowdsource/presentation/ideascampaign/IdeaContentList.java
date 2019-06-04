package de.asideas.crowdsource.presentation.ideascampaign;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import java.util.Objects;

public class IdeaContentList {

    private IdeaContent de;
    private IdeaContent en;
    private IdeaContent original;
    private String originalLanguage;

    private IdeaContentList() {
    }

    public IdeaContentList(IdeaEntity ideaEntity) {
        IdeaContentEntity de = ideaEntity.getContentGerman();
        IdeaContentEntity en = ideaEntity.getContentEnglish();

        this.original = createOriginalIdeaContent();

        if(de != null) this.de = new IdeaContent(de.getTitle(), de.getPitch());
        else this.de = createOriginalIdeaContent();

        if(en != null) this.en = new IdeaContent(en.getTitle(), en.getPitch());
        else this.en = createOriginalIdeaContent();

        String originalLanguage = ideaEntity.getOriginalLanguage();
        if (originalLanguage != null) this.originalLanguage = originalLanguage.toLowerCase();
        else this.originalLanguage = "de";

    }

    public String getOriginalLanguage() {
        return originalLanguage;
    }
    public void setOriginalLanguage(String originalLanguage) {
        this.originalLanguage = originalLanguage;
    }

    public IdeaContent getOriginal() {
        return original;
    }

    public void setOriginal(IdeaContent original) {
        this.original = original;
    }

    public IdeaContent getDe() {
        return de;
    }

    public void setDe(IdeaContent de) {
        this.de = de;
    }

    public IdeaContent getEn() {
        return en;
    }

    public void setEn(IdeaContent en) {
        this.en = en;
    }

    private IdeaContent createOriginalIdeaContent() {
        if(original != null) {
            return new IdeaContent(original.getTitle(), original.getPitch());
        }
        return null;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaContentList ideaContentList = (IdeaContentList) o;
        return originalLanguage == ideaContentList.originalLanguage &&
                Objects.equals(original, ideaContentList.original) &&
                Objects.equals(de, ideaContentList.de) &&
                Objects.equals(en, ideaContentList.en);
    }

    @Override
    public int hashCode() {
        return Objects.hash(originalLanguage, original, de, en);
    }

    @Override
    public String toString() {
        return "IdeaContentList{" +
            ", originalLanguage='" + originalLanguage+ '\'' +
            ", original=" + original + '\'' +
            ", de=" + de + '\'' +
            ", en='" + en + '\'' + '\'' +
            '}';
    }
}
