package de.axelspringer.ideas.crowdsource.model.presentation.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserActivation {

    @NotEmpty
    private String activationToken;

    @NotEmpty
    // (at least one non-word-character in password)(no whitespaces anywhere in password).{min 8 chars long}
    @Pattern(regexp = "(?=.*\\W)(?=\\S+$).{8,}", message = "insecure_password")
    private String password;
}
