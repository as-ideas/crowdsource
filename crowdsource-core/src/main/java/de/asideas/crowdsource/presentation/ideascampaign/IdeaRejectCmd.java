package de.asideas.crowdsource.presentation.ideascampaign;

import java.util.Objects;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.validation.annotation.Validated;

@Validated
public class IdeaRejectCmd {

    @NotEmpty
    @Size(min = 10, max = 10000)
    private String rejectionComment;

    public IdeaRejectCmd() {
    }

    public IdeaRejectCmd(String rejectionComment) {
        this.rejectionComment = rejectionComment;
    }

    public String getRejectionComment() {
        return rejectionComment;
    }
    public void setRejectionComment(String rejectionComment) {
        this.rejectionComment = rejectionComment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IdeaRejectCmd that = (IdeaRejectCmd) o;
        return Objects.equals(rejectionComment, that.rejectionComment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rejectionComment);
    }
}
