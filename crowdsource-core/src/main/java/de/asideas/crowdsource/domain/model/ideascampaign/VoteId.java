package de.asideas.crowdsource.domain.model.ideascampaign;

import java.io.Serializable;
import java.util.Objects;

import org.springframework.util.Assert;

public class VoteId implements Serializable {

    private String voterId;

    private String ideaId;

    public VoteId() {
    }

    public VoteId(String voterId, String ideaId) {
        Assert.notNull(voterId, "voterId must not be null");
        Assert.notNull(ideaId, "ideaId must not be null");

        this.voterId = voterId;
        this.ideaId = ideaId;
    }

    public String getVoterId() {
        return voterId;
    }

    public void setVoterId(String voterId) {
        this.voterId = voterId;
    }

    public String getIdeaId() {
        return ideaId;
    }

    public void setIdeaId(String ideaId) {
        this.ideaId = ideaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        VoteId voteId = (VoteId) o;
        return Objects.equals(voterId, voteId.voterId) &&
            Objects.equals(ideaId, voteId.ideaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(voterId, ideaId);
    }

    @Override
    public String toString() {
        return "VoteId{" +
            "voterId='" + voterId + '\'' +
            ", ideaId='" + ideaId + '\'' +
            '}';
    }
}
