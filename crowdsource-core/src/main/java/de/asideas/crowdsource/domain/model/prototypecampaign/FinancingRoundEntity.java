package de.asideas.crowdsource.domain.model.prototypecampaign;

import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

// for serialization
@Document(collection = "financerounds")
public class FinancingRoundEntity {

    private static final Logger log = LoggerFactory.getLogger(FinancingRoundEntity.class);

    @Id
    private String id;

    private DateTime startDate;

    private DateTime endDate;

    /**
     * The amount of money available in the financing round
     */
    private Integer budget;

    /**
     * The amount of money left after round has been terminated; thus it is the amount of money users did not spend on
     * pledging projects during official activity of that round. It is set during post processing of financing rounds
     * and is intended to be eventually used for pledging projects by admins. When admin users pledge after termination
     * of the round the pledging amounts are not subtracted from this member.
     */
    private Integer postRoundBudget;

    private Integer budgetPerUser;

    private Integer userCount;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    private Boolean terminationPostProcessingDone = false;

    public FinancingRoundEntity() {
    }

    /**
     * Factory for a new financing round that immediately will be in active state
     *
     * @param creationCmd
     * @return
     */
    public static FinancingRoundEntity newFinancingRound(FinancingRound creationCmd, int userCount) {
        FinancingRoundEntity res = new FinancingRoundEntity();
        res.setStartDate(new DateTime());
        res.setEndDate(creationCmd.getEndDate());
        res.setBudget(creationCmd.getBudget());
        res.setUserCount(userCount);
        res.setBudgetPerUser(res.calculateBudgetPerUser());
        return res;
    }

    public boolean projectEligibleForRound(ProjectEntity project) {
        return ProjectStatus.FULLY_PLEDGED != project.getStatus();
    }

    public void stopFinancingRound() {
        this.terminationPostProcessingDone = false;
        this.setEndDate(new DateTime());
    }

    /**
     * @return Whether <code>this</code> is currently active
     */
    public boolean active() {
        long now = DateTime.now().getMillis();
        return startDate.getMillis() < now && endDate.getMillis() > now;
    }

    /**
     * @return whether <code>this</code> is terminated.
     */
    public boolean terminated() {
        long now = DateTime.now().getMillis();
        return endDate.getMillis() <= now;
    }

    public boolean terminationPostProcessingRequiredNow() {
        return terminated() && !this.terminationPostProcessingDone;
    }

    /**
     * @param postRoundPledges all pledges that have been made to projects assigned to <code>this</code>
     *                         after the round finished
     * @return how much money is left to be invested using money from this round based on <code>postRoundBudget</code>
     */
    public Integer postRoundPledgableBudgetRemaining(List<PledgeEntity> postRoundPledges) {
        if (!terminationPostProcessingDone) {
            return 0;
        }
        if (postRoundPledges == null || postRoundPledges.isEmpty()) {
            return this.postRoundBudget;
        }
        Collections.sort(postRoundPledges, new PledgeEntity.CreationTimeComparator() );
        Assert.isTrue(postRoundPledges.get(0).getCreatedDate().getMillis() > this.endDate.getMillis(),
                "Method must not be called with pledgeEntities from active financing round! One entry was: " + postRoundPledges.get(0));

        int postRoundPledgeAmount = postRoundPledges.stream().mapToInt(PledgeEntity::getAmount).sum();
        return this.postRoundBudget - postRoundPledgeAmount;
    }

    /**
     * Calculates and initializes the remaining budget that was not pledged by users during <code>this</code> active round
     *
     * @param pledgeAmountByUsers the total amount pledged by users during active financing round
     */
    public void initPostRoundBudget(int pledgeAmountByUsers) {
        if (!this.terminated()) {
            throw new IllegalStateException("Cannot initialize remaining budget on not yet terminated financing round: " + this);
        }
        if (this.postRoundBudget != null) {
            throw new IllegalStateException("PostRoundBudget must not be initialized more than once!");
        }
        int budgetRemainingAfterRound = getBudget() - pledgeAmountByUsers;
        if (budgetRemainingAfterRound < 0) {
            log.warn("It seems, within this financing round there were more pledges done than budget available; Setting remaining budget to 0; " +
                    "The pledge amount above budget is: {}; FinancingRound was: {}", budgetRemainingAfterRound, this);
            budgetRemainingAfterRound = 0;
        }
        setPostRoundBudget(budgetRemainingAfterRound);
    }

    Integer calculateBudgetPerUser() {
        Assert.notNull(this.userCount);
        Assert.notNull(this.budget);
        return this.userCount < 1 ? 0 : Math.floorDiv(this.budget, this.userCount);
    }


    public String getId() {
        return this.id;
    }

    public DateTime getStartDate() {
        return this.startDate;
    }

    public DateTime getEndDate() {
        return this.endDate;
    }

    public Integer getBudget() {
        return this.budget;
    }

    public Integer getBudgetPerUser() {
        return this.budgetPerUser;
    }

    public Integer getUserCount() {
        return this.userCount;
    }

    public DateTime getCreatedDate() {
        return this.createdDate;
    }

    public DateTime getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Boolean getTerminationPostProcessingDone() {
        return terminationPostProcessingDone;
    }

    public Integer getPostRoundBudget() {
        return postRoundBudget;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setStartDate(DateTime startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(DateTime endDate) {
        this.endDate = endDate;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public void setBudgetPerUser(Integer budgetPerUser) {
        this.budgetPerUser = budgetPerUser;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public void setTerminationPostProcessingDone(Boolean terminationPostProcessingDone) {
        this.terminationPostProcessingDone = terminationPostProcessingDone;
    }

    public void setPostRoundBudget(Integer postRoundBudget) {
        this.postRoundBudget = postRoundBudget;
    }

    @Override
    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o);
    }

    public boolean idenitityEquals(FinancingRoundEntity other) {
        if (other == null) {
            return false;
        }
        return this.getId().equals(other.getId());
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
