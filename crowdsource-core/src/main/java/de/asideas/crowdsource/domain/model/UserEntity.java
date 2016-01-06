package de.asideas.crowdsource.domain.model;

import de.asideas.crowdsource.presentation.Pledge;
import de.asideas.crowdsource.security.Roles;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.joining;

// needed for serialization
@Document(collection = "users")
public class UserEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String activationToken;

    private List<String> roles = Arrays.asList(Roles.ROLE_USER);

    private boolean activated = false;

    private int budget = 0;

    @CreatedDate
    private DateTime createdDate;

    @LastModifiedDate
    private DateTime lastModifiedDate;

    public UserEntity(String email) {
        this(email, null);
    }

    public UserEntity(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public UserEntity() {
    }

    public void accountPledge(Pledge pledge) {
        if ((budget - pledge.getAmount()) < 0) {
            throw new IllegalArgumentException("User budget may not drop below 0");
        }

        budget -= pledge.getAmount();
    }

    public String fullNameFromEmail() {
        if (email == null) {
            return null;
        }

        int atPos = email.indexOf('@');
        if (atPos < 1) {
            return null;
        }

        String localPart = email.substring(0, atPos);
        List<String> localParts = Arrays.asList(localPart.split("\\."));

        return localParts.stream()
                .map(s -> s.replaceAll("\\d+", ""))
                .map(StringUtils::capitalize)
                .collect(joining(" "));
    }


    public String getId() {
        return this.id;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getActivationToken() {
        return this.activationToken;
    }

    public List<String> getRoles() {
        return this.roles;
    }

    public boolean isActivated() {
        return this.activated;
    }

    public int getBudget() {
        return this.budget;
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

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setActivationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setLastModifiedDate(DateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserEntity that = (UserEntity) o;

        if(this.id == null && that.id == null){
            return this == that;
        }

        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
