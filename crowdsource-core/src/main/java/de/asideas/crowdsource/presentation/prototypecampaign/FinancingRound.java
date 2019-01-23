package de.asideas.crowdsource.presentation.prototypecampaign;

import com.fasterxml.jackson.annotation.JsonView;
import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.project.PublicFinancingRoundInformationView;
import de.asideas.crowdsource.util.validation.financinground.FinancingRoundNotColliding;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.joda.time.DateTime;

import javax.validation.constraints.Future;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.List;

@FinancingRoundNotColliding
public class FinancingRound {

    @JsonView(PublicFinancingRoundInformationView.class)
    private String id;

    @JsonView(PublicFinancingRoundInformationView.class)
    private DateTime startDate = new DateTime();

    @NotNull
    @Future(message = "end-date-in-future")
    @JsonView(PublicFinancingRoundInformationView.class)
    private DateTime endDate;

    @NotNull
    @Min(value = 1l, message = "at-least-one-dollar")
    private Integer budget;

    @JsonView(PublicFinancingRoundInformationView.class)
    private Integer postRoundBudget;

    @JsonView(PublicFinancingRoundInformationView.class)
    private Integer postRoundBudgetRemaining;

    @JsonView(PublicFinancingRoundInformationView.class)
    private boolean active;

    @JsonView(PublicFinancingRoundInformationView.class)
    private boolean postRoundBudgetDistributable;


    public FinancingRound(FinancingRoundEntity financingRoundEntity, List<PledgeEntity> postRoundPledges) {
        this.id = financingRoundEntity.getId();
        this.startDate = financingRoundEntity.getStartDate();
        this.endDate = financingRoundEntity.getEndDate();
        this.budget = financingRoundEntity.getBudget();
        this.postRoundBudget = financingRoundEntity.getPostRoundBudget();
        this.active = financingRoundEntity.active();
        this.postRoundBudgetRemaining = financingRoundEntity.postRoundPledgableBudgetRemaining(postRoundPledges);
        this.postRoundBudgetDistributable = financingRoundEntity.terminated() && financingRoundEntity.getTerminationPostProcessingDone();
    }

    public FinancingRound() {
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

    public boolean isActive() {
        return this.active;
    }

    public Integer getPostRoundBudget() {
        return postRoundBudget;
    }

    public Integer getPostRoundBudgetRemaining() {
        return postRoundBudgetRemaining;
    }

    public boolean isPostRoundBudgetDistributable() {
        return postRoundBudgetDistributable;
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

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setPostRoundBudget(Integer postRoundBudget) {
        this.postRoundBudget = postRoundBudget;
    }

    public void setPostRoundBudgetRemaining(Integer postRoundBudgetRemaining) {
        this.postRoundBudgetRemaining = postRoundBudgetRemaining;
    }

    public void setPostRoundBudgetDistributable(boolean postRoundBudgetDistributable) {
        this.postRoundBudgetDistributable = postRoundBudgetDistributable;
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
}
