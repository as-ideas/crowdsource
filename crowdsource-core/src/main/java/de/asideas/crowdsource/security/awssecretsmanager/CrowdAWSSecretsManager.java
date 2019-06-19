package de.asideas.crowdsource.security.awssecretsmanager;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.services.secretsmanager.AWSSecretsManager;
import com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder;
import com.amazonaws.services.secretsmanager.model.DecryptionFailureException;
import com.amazonaws.services.secretsmanager.model.GetSecretValueRequest;
import com.amazonaws.services.secretsmanager.model.GetSecretValueResult;
import com.amazonaws.services.secretsmanager.model.InternalServiceErrorException;
import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.InvalidParameterException;

import static org.slf4j.LoggerFactory.getLogger;

@Component
public class CrowdAWSSecretsManager {

    @Autowired
    private AWSCrowdSecretsManagerCredentials awsCredentials;

    private static final Logger log = getLogger(CrowdAWSSecretsManager.class);

    final static String SECRET_NAME_DEEPL = "AS_Crowd_DeepL_API_Key";
    final static String SECRET_NAME_MAILGUN = "AS_Crowd_Mailgun";
    final static String SECRET_NAME_MAILGUN_USER = "AS_Crowd_MailGun_User";
    final static String SECRET_NAME_MAILGUN_PASSWORD = "AS_Crowd_MailGun_PW";

    final static String REGION = "eu-central-1";

    public String getDeepLKey() throws Exception {
        return extractDeepLKey(getSecret(SECRET_NAME_DEEPL));
    }

    public Credentials getMailGunCredentials() throws Exception {
        final String secret = getSecret(SECRET_NAME_MAILGUN);
        Credentials credentials = new Credentials(extractMailGunUser(secret), extractMailGunPW(secret));
        return credentials;
    }

    private String getSecret(String secretName) throws Exception {

        AWSSecretsManager client = AWSSecretsManagerClientBuilder.standard()
                .withRegion(REGION)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();

        String secret = null;
        GetSecretValueRequest getSecretValueRequest = new GetSecretValueRequest()
                .withSecretId(secretName);
        GetSecretValueResult getSecretValueResult = null;

        try {
            getSecretValueResult = client.getSecretValue(getSecretValueRequest);
        } catch (DecryptionFailureException e) {
            log.error("Secrets Manager can't decrypt the protected secret text using the provided KMS key.");
            throw e;
        } catch (InternalServiceErrorException e) {
            log.error("An error occurred on the server side.");
            throw e;
        } catch (InvalidParameterException e) {
            log.error("You provided an invalid value for a parameter.");
            throw e;
        } catch (InvalidRequestException e) {
            log.error("You provided a parameter value that is not valid for the current state of the resource.");
            throw e;
        } catch (ResourceNotFoundException e) {
            log.error("We can't find the resource that you asked for.");
            throw e;
        }

        if (getSecretValueResult.getSecretString() != null) {
            secret = getSecretValueResult.getSecretString();
        } else {
            log.error("Found key in binary format but expected it in Text format.");
            throw new ResourceNotFoundException();
        }

        return secret;
    }

    private static String extractDeepLKey(String jsonString) throws IOException {
        String key = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readValue(jsonString, JsonNode.class);
            key = root.get("deepl_api_key").getTextValue();
        } catch (IOException e) {
            log.error("An error occurred reading the DeepL API key from AWS.");
            throw e;
        }
        return key;
    }

    private static String extractMailGunUser(String jsonString) throws IOException {
        String user = null;
        try {

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readValue(jsonString, JsonNode.class);
            user = root.get(SECRET_NAME_MAILGUN_USER).getTextValue();
        } catch (IOException e) {
            log.error("An error occurred reading the datadog user from AWS.");
            throw e;
        }
        return user;
    }

    private static String extractMailGunPW(String jsonString) throws IOException {
        String password = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readValue(jsonString, JsonNode.class);
            password = root.get(SECRET_NAME_MAILGUN_PASSWORD).getTextValue();
        } catch (IOException e) {
            log.error("An error occurred reading the datadog password from AWS.");
            throw e;
        }
        return password;
    }

    public class Credentials {
        private String username;
        private String password;

        public Credentials(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }
    }

}
