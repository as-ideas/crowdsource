package de.asideas.crowdsource.domain.model.prototypecampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Comparator;

// needed for serialization
@Document(collection = "pledges")
public class PledgeEntity {

    @Id
    private String id;
    @DBRef
    private ProjectEntity project;
    @DBRef
    private UserEntity user;
    @DBRef
    private FinancingRoundEntity financingRound;

    private int amount;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    public PledgeEntity() {
    }
    public PledgeEntity(ProjectEntity projectEntity, UserEntity userEntity, Pledge pledge, FinancingRoundEntity financingRoundEntity) {
        this.project = projectEntity;
        this.user = userEntity;
        this.financingRound = financingRoundEntity;
        this.amount = pledge.getAmount();
    }
    /** Copy Constructor */
    private PledgeEntity(int amount, DateTime createdDate, FinancingRoundEntity financingRound, String id, DateTime lastModifiedDate, ProjectEntity project, UserEntity user) {
        this.amount = amount;
        this.createdDate = createdDate;
        this.financingRound = financingRound;
        this.id = id;
        this.lastModifiedDate = lastModifiedDate;
        this.project = project;
        this.user = user;
    }

    /**
     * Adds the <code>other</code> pledge's amount to <code>this</code> returning a new object, leaving this as is.
     * In case the <code>users</code> differ it will be set to <code>null</code>.
     * In case <code>this</code>' user is null but the <code>other</code>'s user is set the user will be set to the <code>other</code>'s
     * The <code>id</code> will always be set to null.
     * In case <code>financingRound</code>s differ, it will be set to <code>null</code>, set otherwise
     * In case <code>this</code>' financingRound is null but the <code>other</code>'s financingRound is set the financingRound will be set to the <code>other</code>'s
     * The <code>createdDate</code> and <code>lastModifiedDate</code> will be set to <code>null</code>
     * The <code>project</code> will be <code>null</code> if different, set otherwise
     * In case <code>this</code>' project is null but the <code>other</code>'s project is set the financingRound will be set to the <code>other</code>'s
     *
     * @param other the other to add
     * @return the summed pledge; if <code>other</code> is <code>null</code> will return a copy of <code>this</code>
     */
    public PledgeEntity add(PledgeEntity other){
        if(other == null) {
            return new PledgeEntity(amount, null, financingRound, null, null, project, user);
        }

        PledgeEntity res = new PledgeEntity();
        res.setAmount(this.amount + other.amount);
        if(this.user == null || this.user.equals(other.user)) {
            res.user = other.user;
        }

        if(this.financingRound == null || this.financingRound.equals(other.financingRound)) {
            res.financingRound = other.financingRound;
        }
        if(this.project == null || this.project.equals(other.project)) {
            res.project = other.project;
        }
        return res;
    }

    public String getId() {
        return this.id;
    }

    public ProjectEntity getProject() {
        return this.project;
    }

    public UserEntity getUser() {
        return this.user;
    }

    public FinancingRoundEntity getFinancingRound() {
        return this.financingRound;
    }

    public int getAmount() {
        return this.amount;
    }

    public DateTime getCreatedDate() {
        return this.createdDate;
    }

    public DateTime getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setFinancingRound(FinancingRoundEntity financingRound) {
        this.financingRound = financingRound;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
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

    public static class CreationTimeComparator implements Comparator<PledgeEntity> {

        @Override
        public int compare(PledgeEntity o1, PledgeEntity o2) {
            if( o1 == o2) {
               return 0;
            }
            if(o1 == null) {
                return -1;
            }
            if (o2 == null) {
                return 1;
            }
            return o1.getCreatedDate().compareTo(o2.getCreatedDate());
        }
    }
}
