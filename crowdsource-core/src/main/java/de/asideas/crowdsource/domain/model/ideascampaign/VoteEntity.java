package de.asideas.crowdsource.domain.model.ideascampaign;

import java.util.Objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="ideavotes")
@TypeAlias("idea_vote")
public class VoteEntity {

    @Id
    private VoteId id;

    private Integer vote;

    private VoteEntity() {
    }
    public VoteEntity(VoteId id, Integer vote) {
        this.id = id;
        this.vote = vote;
    }

    public VoteId getId() {
        return id;
    }
    public void setId(VoteId id) {
        this.id = id;
    }

    public Integer getVote() {
        return vote;
    }
    public void setVote(Integer vote) {
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
        VoteEntity that = (VoteEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "VoteEntity{" +
            "id=" + id +
            ", vote=" + vote +
            '}';
    }
}
