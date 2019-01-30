package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class VoteCmd {

    private String ideaId;

    @Min(0)
    @Max(5)
    @NotNull
    private int vote;

    public VoteCmd(String ideaId, int vote) {
        this.ideaId = ideaId;
        this.vote = vote;
    }

    public VoteCmd() {
    }

    public String getIdeaId() {
        return ideaId;
    }

    public void setIdeaId(String ideaId) {
        this.ideaId = ideaId;
    }

    public int getVote() {
        return vote;
    }

    public void setVote(int vote) {
        this.vote = vote;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        VoteCmd voteCmd = (VoteCmd) o;
        return vote == voteCmd.vote &&
            Objects.equals(ideaId, voteCmd.ideaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ideaId, vote);
    }

    @Override
    public String toString() {
        return "VoteCmd{" +
            "ideaId='" + ideaId + '\'' +
            ", vote=" + vote +
            '}';
    }
}
