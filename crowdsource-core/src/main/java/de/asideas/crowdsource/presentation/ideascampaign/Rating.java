package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;

public class Rating {

    private String ideaId;
    private int countVotes;
    private int ownVote;
    private float averageRating;

    public Rating(String ideaId, int countVotes, int ownVote, float averageRating) {
        this.ideaId = ideaId;
        this.countVotes = countVotes;
        this.ownVote = ownVote;
        this.averageRating = averageRating;
    }

    private Rating() {
    }

    public String getIdeaId() {
        return ideaId;
    }

    public void setIdeaId(String ideaId) {
        this.ideaId = ideaId;
    }

    public int getCountVotes() {
        return countVotes;
    }

    public void setCountVotes(int countVotes) {
        this.countVotes = countVotes;
    }

    public int getOwnVote() {
        return ownVote;
    }

    public void setOwnVote(int ownVote) {
        this.ownVote = ownVote;
    }

    public float getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(float averageRating) {
        this.averageRating = averageRating;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Rating rating = (Rating) o;
        return countVotes == rating.countVotes &&
            ownVote == rating.ownVote &&
            Float.compare(rating.averageRating, averageRating) == 0 &&
            Objects.equals(ideaId, rating.ideaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ideaId, countVotes, ownVote, averageRating);
    }

    @Override
    public String toString() {
        return "Rating{" +
            "ideaId='" + ideaId + '\'' +
            ", countVotes=" + countVotes +
            ", ownVote=" + ownVote +
            ", averageRating=" + averageRating +
            '}';
    }
}
