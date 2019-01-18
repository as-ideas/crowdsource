package de.asideas.crowdsource.presentation.user;

import com.fasterxml.jackson.annotation.JsonView;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class ProjectCreator {

    private String id;

    @JsonView(Project.ProjectSummaryView.class)
    private String name;

    @JsonView(Project.ProjectSummaryView.class)
    private String email;

    public ProjectCreator(UserEntity user) {
        this.id = user.getId();
        this.name = user.getFullName();
        this.email = user.getEmail();
    }

    public ProjectCreator() {
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
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
