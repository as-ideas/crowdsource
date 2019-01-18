package de.asideas.crowdsource.presentation.user;

import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.util.List;

// required for serialization
public class UserMetrics {

    private int count;

    private int remainingBudget;

    public UserMetrics(List<UserEntity> users) {
        count = users.size();

        remainingBudget = users.stream()
                .mapToInt(UserEntity::getBudget)
                .sum();
    }

    public UserMetrics() {
    }

    public int getCount() {
        return this.count;
    }

    public int getRemainingBudget() {
        return this.remainingBudget;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public void setRemainingBudget(int remainingBudget) {
        this.remainingBudget = remainingBudget;
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
