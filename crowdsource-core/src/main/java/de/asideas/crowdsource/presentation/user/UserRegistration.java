package de.asideas.crowdsource.presentation.user;

import de.asideas.crowdsource.util.validation.email.EligibleEmail;
import de.asideas.crowdsource.util.validation.email.NotActivated;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.AssertTrue;

public class UserRegistration {

    @NotEmpty
    @Email
    @NotActivated
    @EligibleEmail
    private String email;
    private String firstName;
    private String lastName;

    @AssertTrue
    private boolean termsOfServiceAccepted;

    public UserRegistration() {
    }

    public String getEmail() {
        return this.email;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public boolean isTermsOfServiceAccepted() {
        return this.termsOfServiceAccepted;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setTermsOfServiceAccepted(boolean termsOfServiceAccepted) {
        this.termsOfServiceAccepted = termsOfServiceAccepted;
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
