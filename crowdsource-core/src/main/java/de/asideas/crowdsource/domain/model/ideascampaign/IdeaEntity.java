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
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.Assert;

import static org.springframework.util.Assert.hasText;
import static org.springframework.util.Assert.notNull;

@CompoundIndexes({
        @CompoundIndex(def = "{'campaignId': 1, 'creator._id': 1 }", name = "idx_campaignId_creatorId"),
        @CompoundIndex(def = "{'campaignId': 1, 'status': 1 }", name = "idx_campaignId_status"),
        @CompoundIndex(def = "{'_id': 1, 'campaignId':1, 'status': 1 }", name = "idx_id_campaignId_status"),
})
@Document(collection = "ideas")
public class IdeaEntity {

    @Id
    private String id;

    private IdeaContentEntity contentOriginal;

    private IdeaContentEntity contentGerman;

    private IdeaContentEntity contentEnglish;

    private IdeaStatus status;

    /**
     * When was the idea approved or rejected by an admin
     */
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

    public static IdeaEntity createIdeaEntity(Idea cmd, String campaignId, UserEntity creator) {
        hasText(campaignId, "campaignId must be given");
        hasText(cmd.getTitle(), "Title must contain text.");
        hasText(cmd.getPitch(), "Pitch must contain text.");
        notNull(creator, "Creator must not be null.");

        final IdeaEntity result = new IdeaEntity();

        result.setContentOriginal(new IdeaContentEntity(cmd.getTitle(), cmd.getPitch()));
        result.setCreator(creator);
        result.setStatus(IdeaStatus.PROPOSED);
        result.setCampaignId(campaignId);
        return result;
    }

    public IdeaEntity modifyIdeaPitch(String newPitch) {
        hasText(newPitch, "new pitch must be given");
        this.setOriginalPitch(newPitch);
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

        if (IdeaStatus.PUBLISHED != this.status) {
            throw InvalidRequestException.voteOnInvalidIdeaStatus();
        }

        return new VoteEntity(new VoteId(voter.getId(), this.getId()), vote);
    }

    public Rating calculateRating(Collection<VoteEntity> votes, UserEntity requestingUser) {
        final Double calculatedAverage = votes.stream().map(VoteEntity::getVote).collect(Collectors.averagingInt(element -> element));
        final Optional<VoteEntity> requestorVote = votes.stream().filter(el -> el.getId().getVoterId().equals(requestingUser.getId())).findFirst();
        return new Rating(this.id, votes.size(), requestorVote.map(VoteEntity::getVote).orElse(0), calculatedAverage.floatValue());
    }

    public String getOriginalLanguage() {
        return contentOriginal.getLanguage();
    }

    public void setOriginalLanguage(String originalLanguage) {
        this.contentOriginal.setLanguage(originalLanguage);
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getOriginalTitle() {
        return this.contentOriginal.getTitle();
    }

    public void setOriginalTitle(String title) {
        this.contentOriginal.setTitle(title);
    }

    public String getOriginalPitch() {
        return this.contentOriginal.getPitch();
    }

    public void setOriginalPitch(String pitch) {
        this.contentOriginal.setPitch(pitch);
    }

    public String getTitleInLanguage(String language) {
        if (language == null) {
            throw new RuntimeException();
        }
        if (!language.equals(contentOriginal.getLanguage())) {
            if ("DE".equals(language)) {
                return this.getContentGerman().getTitle();
            }
            if ("EN".equals(language)) {
                return this.getContentEnglish().getTitle();
            }
        }
        return contentOriginal.getTitle();
    }

    public String getPitchInLanguage(String language) {
        if (language == null) {
            throw new RuntimeException();
        }
        if (!language.equals(contentOriginal.getLanguage())) {
            if ("DE".equals(language)) {
                return this.getContentGerman().getPitch();
            }
            if ("EN".equals(language)) {
                return this.getContentEnglish().getPitch();
            }
        }
        return contentOriginal.getPitch();
    }

    public IdeaContentEntity getContentOriginal() {
        return contentOriginal;
    }

    public void setContentOriginal(IdeaContentEntity contentOriginal) {
        this.contentOriginal = contentOriginal;
    }

    public IdeaContentEntity getContentGerman() {
        return contentGerman;
    }

    public IdeaContentEntity getContentEnglish() {
        return contentEnglish;
    }

    public void setContentTranslated(IdeaContentEntity ideaContentEntity) {
        if ("DE".equals(ideaContentEntity.getLanguage())) {
            this.contentGerman = ideaContentEntity;
        }
        if ("EN".equals(ideaContentEntity.getLanguage())) {
            this.contentEnglish = ideaContentEntity;
        }
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
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IdeaEntity that = (IdeaEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(contentOriginal, that.contentOriginal) &&
                Objects.equals(contentGerman, that.contentGerman) &&
                Objects.equals(contentEnglish, that.contentEnglish) &&
                status == that.status &&
                Objects.equals(reviewDate, that.reviewDate) &&
                Objects.equals(rejectionComment, that.rejectionComment) &&
                Objects.equals(creator, that.creator) &&
                Objects.equals(approvingAdminId, that.approvingAdminId) &&
                Objects.equals(campaignId, that.campaignId) &&
                Objects.equals(createdDate, that.createdDate) &&
                Objects.equals(lastModifiedDate, that.lastModifiedDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, contentOriginal, contentGerman, contentEnglish, status, reviewDate, rejectionComment, creator, approvingAdminId, campaignId, createdDate, lastModifiedDate);
    }

    @Override
    public String toString() {
        return "IdeaEntity{" +
                "id='" + id + '\'' +
                ", contentOriginal=" + contentOriginal +
                ", contentGerman=" + contentGerman +
                ", contentEnglish=" + contentEnglish +
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
