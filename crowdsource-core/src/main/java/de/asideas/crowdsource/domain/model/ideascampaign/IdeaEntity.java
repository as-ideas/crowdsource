package de.asideas.crowdsource.domain.model.ideascampaign;

import java.util.Objects;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.Idea;

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

    private DateTime approvalDate;

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

        setApprovalDate(DateTime.now());
        this.setApprovingAdminId(approvingAdmin.getId());
        this.status = IdeaStatus.PUBLISHED;
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

    public DateTime getApprovalDate() {
        return approvalDate;
    }
    public void setApprovalDate(DateTime approvalDate) {
        this.approvalDate = approvalDate;
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
            ", approvalDate=" + approvalDate +
            ", creator=" + creator +
            ", approvingAdminId='" + approvingAdminId + '\'' +
            ", createdDate=" + createdDate +
            ", lastModifiedDate=" + lastModifiedDate +
            '}';
    }

}
