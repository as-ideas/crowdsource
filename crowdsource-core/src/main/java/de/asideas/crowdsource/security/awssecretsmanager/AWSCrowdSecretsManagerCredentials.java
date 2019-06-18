package de.asideas.crowdsource.security.awssecretsmanager;

import com.amazonaws.auth.AWSCredentials;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Validated
@ConfigurationProperties(prefix = "de.asideas.crowdsource.aws-secrets-manager")
public class AWSCrowdSecretsManagerCredentials implements AWSCredentials {

    @NotNull
    private String accessKeyId;

    @NotNull
    private String awsSecretKey;

    public AWSCrowdSecretsManagerCredentials() {
    }

    public AWSCrowdSecretsManagerCredentials(String accessKeyId, String awsSecretKey) {
        this.accessKeyId = accessKeyId;
        this.awsSecretKey = awsSecretKey;
    }

    @Override
    public String getAWSAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    @Override
    public String getAWSSecretKey() {
        return awsSecretKey;

    }

    public void setAwsSecretKey(String awsSecretKey) {
        this.awsSecretKey = awsSecretKey;
    }
}
