package de.asideas.crowdsource.presentation.prototypecampaign.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.domain.shared.LikeStatus;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.user.ProjectCreator;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Min;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

// needed for serialization
public class Project {

    // no validation here on purpose, as this is only filled on response and ignored in request.
    @JsonView(ProjectSummaryView.class)
    private String id;

    // no validation here on purpose, as this is only filled on response and ignored in request
    @JsonView(ProjectSummaryView.class)
    private ProjectStatus status;

    @NotEmpty
    @JsonView(ProjectSummaryView.class)
    private String title;

    @NotEmpty
    @JsonView(ProjectSummaryView.class)
    private String shortDescription;

    @NotEmpty
    private String description;

    @Min(1)
    @JsonView(ProjectSummaryView.class)
    private int pledgeGoal;

    // no validation here on purpose, as this is only filled on response and ignored in request
    @JsonView(ProjectSummaryView.class)
    private int pledgedAmount;

    // no validation here on purpose, as this is only filled on response and ignored in request
    @JsonView(ProjectSummaryView.class)
    private long backers;

    // no validation here on purpose, as this is only filled on response and ignored in request. Ideally,
    // this is filled on request too and denied if a normal user tries to create a project for someone else
    @JsonView(ProjectSummaryView.class)
    private ProjectCreator creator;

    // no validation here on purpose, as this is only filled on response and ignored in request
    @JsonView(ProjectSummaryView.class)
    private Date lastModifiedDate;

    @JsonView(ProjectSummaryView.class)
    private int pledgedAmountByRequestingUser;

    @JsonView(ProjectSummaryView.class)
    private int pledgedAmountByPostRoundBudget;

    @JsonView(ProjectSummaryView.class)
    private long likeCount;

    @JsonProperty("likeStatus")
    @JsonView(ProjectSummaryView.class)
    private LikeStatus likeStatusOfRequestUser;

    private List<Attachment> attachments;
    
    public Project(ProjectEntity projectEntity, List<PledgeEntity> pledges, UserEntity requestingUser) {
        this.id = projectEntity.getId();
        this.status = projectEntity.getStatus();
        this.title = projectEntity.getTitle();
        this.shortDescription = projectEntity.getShortDescription();
        this.description = projectEntity.getDescription();
        this.pledgeGoal = projectEntity.getPledgeGoal();
        this.lastModifiedDate = projectEntity.getLastModifiedDate() != null ? projectEntity.getLastModifiedDate().toDate() : null;

        this.pledgedAmount = projectEntity.pledgedAmount(pledges);
        this.backers = projectEntity.countBackers(pledges);
        this.pledgedAmountByRequestingUser = projectEntity.pledgedAmountOfUser(pledges, requestingUser);
        this.pledgedAmountByPostRoundBudget = projectEntity.pledgedAmountPostRound(pledges);

        this.creator = new ProjectCreator(projectEntity.getCreator());

        this.attachments = projectEntity.getAttachments().stream().map(a -> Attachment.asResponseWithoutPayload(a, projectEntity)).collect(Collectors.toList());
    }

    public Project(ProjectEntity projectEntity, List<PledgeEntity> pledges, UserEntity requestingUser, long likeCount, LikeStatus likeStatusOfRequestUser) {
        this(projectEntity, pledges, requestingUser);
        this.likeCount = likeCount;
        this.likeStatusOfRequestUser = likeStatusOfRequestUser;
    }

    public Project() {
    }

    public String getId() {
        return this.id;
    }

    public ProjectStatus getStatus() {
        return this.status;
    }

    public String getTitle() {
        return this.title;
    }

    public String getShortDescription() {
        return this.shortDescription;
    }

    public String getDescription() {
        return this.description;
    }

    public int getPledgeGoal() {
        return this.pledgeGoal;
    }

    public int getPledgedAmount() {
        return this.pledgedAmount;
    }

    public long getBackers() {
        return this.backers;
    }

    public ProjectCreator getCreator() {
        return this.creator;
    }

    public Date getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public int getPledgedAmountByRequestingUser() {
        return pledgedAmountByRequestingUser;
    }

    public int getPledgedAmountByPostRoundBudget() {
        return pledgedAmountByPostRoundBudget;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPledgeGoal(int pledgeGoal) {
        this.pledgeGoal = pledgeGoal;
    }

    public void setPledgedAmount(int pledgedAmount) {
        this.pledgedAmount = pledgedAmount;
    }

    public void setBackers(long backers) {
        this.backers = backers;
    }

    public void setCreator(ProjectCreator creator) {
        this.creator = creator;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public void setPledgedAmountByRequestingUser(int pledgedAmountByRequestingUser) {
        this.pledgedAmountByRequestingUser = pledgedAmountByRequestingUser;
    }

    public void setPledgedAmountByPostRoundBudget(int pledgedAmountByPostRoundBudget) {
        this.pledgedAmountByPostRoundBudget = pledgedAmountByPostRoundBudget;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    public LikeStatus getLikeStatusOfRequestUser() {
        return likeStatusOfRequestUser;
    }

    public void setLikeStatusOfRequestUser(LikeStatus likeStatusOfRequestUser) {
        this.likeStatusOfRequestUser = likeStatusOfRequestUser;
    }

    @Override
    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

    /**
     * Used as Marker for {@link de.asideas.crowdsource.presentation.prototypecampaign.project.Project} Validation on update requests
     */
    public interface UpdateProject {
    }

    /**
     * Used for @JsonView to return a subset of a project only
     */
    public interface ProjectSummaryView {
    }
}
