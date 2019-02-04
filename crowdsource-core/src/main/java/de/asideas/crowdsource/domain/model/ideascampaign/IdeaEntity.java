package de.asideas.crowdsource.domain.model.ideascampaign;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;
import de.asideas.crowdsource.presentation.ideascampaign.Rating;

import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.Assert;

import static org.springframework.util.Assert.hasText;
import static org.springframework.util.Assert.notNull;

@Document(collection = "ideas")
public class IdeaEntity {

    @Id
    private String id;

    private String title;

    private String pitch;

    private IdeaStatus status;

    /** When was the idea approved or rejected by an admin */
    private DateTime reviewDate;

    private String rejectionComment;

    @DBRef
    private UserEntity creator;

    private String approvingAdminId;

    @Indexed
    private String campaignId;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    private IdeaEntity() {
    }

    public static IdeaEntity createIdeaEntity(Idea cmd, String campaignId, UserEntity creator){
        hasText(campaignId, "campaignId must be given");
        hasText(cmd.getTitle(), "Title must contain text.");
        hasText(cmd.getPitch(), "Pitch must contain text.");
        notNull(creator, "Creator must not be null.");

        final IdeaEntity result = new IdeaEntity();
        result.setTitle(cmd.getTitle());
        result.setPitch(cmd.getPitch());
        result.setCreator(creator);
        result.setStatus(IdeaStatus.PROPOSED);
        result.setCampaignId(campaignId);
        return result;
    }

    public IdeaEntity modifyIdeaPitch(String newPitch) {
        hasText(newPitch, "new pitch must be given");
        this.setPitch(newPitch);
        return this;
    }

    public void approveIdea(UserEntity approvingAdmin) {
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null");
        Assert.notNull(approvingAdmin.getId(), "approvingAdmin must have an ID");
        Assert.isTrue(this.status != IdeaStatus.PUBLISHED, "Cannot approve idea because it is already published");


        setReviewDate(DateTime.now());
        this.setApprovingAdminId(approvingAdmin.getId());
        this.status = IdeaStatus.PUBLISHED;
    }

    public void rejectIdea(UserEntity approvingAdmin, String rejectionComment) {
        Assert.notNull(approvingAdmin, "approvingAdmin must not be null");
        Assert.hasText(rejectionComment, "Rejection comment must not be empty.");
        Assert.notNull(approvingAdmin.getId(), "approvingAdmin must have an ID");

        Assert.isTrue(this.status != IdeaStatus.REJECTED, "Cannot reject idea because it is already rejected");

        setReviewDate(DateTime.now());
        this.setApprovingAdminId(approvingAdmin.getId());
        this.setRejectionComment(rejectionComment);
        this.status = IdeaStatus.REJECTED;
    }

    public VoteEntity vote(UserEntity voter, int vote) {
        Assert.isTrue(vote > 0, "Vote value out of bounds: " + vote);
        Assert.isTrue(vote < 6, "Vote value out of bounds: " + vote);

        if(IdeaStatus.PUBLISHED != this.status){
            throw InvalidRequestException.voteOnInvalidIdeaStatus();
        }

        return new VoteEntity(new VoteId(voter.getId(), this.getId()), vote);
    }

    public Rating calculateRating(Collection<VoteEntity> votes, UserEntity requestingUser) {
        final Double calculatedAverage = votes.stream().map(VoteEntity::getVote).collect(Collectors.averagingInt(element -> element));
        final Optional<VoteEntity> requestorVote = votes.stream().filter(el -> el.getId().getVoterId().equals(requestingUser.getId())).findFirst();
        return new Rating(this.id, votes.size(), requestorVote.map(VoteEntity::getVote).orElse(0), calculatedAverage.floatValue());
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
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

    public IdeaStatus getStatus() {
        return status;
    }
    public void setStatus(IdeaStatus status) {
        this.status = status;
    }

    public String getRejectionComment() {
        return rejectionComment;
    }
    public void setRejectionComment(String rejectionComment) {
        this.rejectionComment = rejectionComment;
    }

    public DateTime getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public DateTime getLastModifiedDate() {
        return lastModifiedDate;
    }
    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public DateTime getReviewDate() {
        return reviewDate;
    }
    public void setReviewDate(DateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public UserEntity getCreator() {
        return creator;
    }
    public void setCreator(UserEntity creator) {
        this.creator = creator;
    }

    public String getCampaignId() {
        return campaignId;
    }
    private void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getApprovingAdminId() {
        return approvingAdminId;
    }
    public void setApprovingAdminId(String approvingAdminId) {
        this.approvingAdminId = approvingAdminId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaEntity that = (IdeaEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "IdeaEntity{" +
            "id='" + id + '\'' +
            ", title='" + title + '\'' +
            ", pitch='" + pitch + '\'' +
            ", status=" + status +
            ", reviewDate=" + reviewDate +
            ", rejectionComment='" + rejectionComment + '\'' +
            ", creator=" + creator +
            ", approvingAdminId='" + approvingAdminId + '\'' +
            ", campaignId='" + campaignId + '\'' +
            ", createdDate=" + createdDate +
            ", lastModifiedDate=" + lastModifiedDate +
            '}';
    }

}
