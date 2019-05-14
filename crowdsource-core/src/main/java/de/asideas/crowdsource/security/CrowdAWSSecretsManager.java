package de.asideas.crowdsource.security;

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

import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.Base64;

public class CrowdAWSSecretsManager {

    final static String SECRET_NAME = "AS_Crowd_DeepL_API_Key";
    final static String REGION = "eu-central-1";

    public static String getDeepLKey() {

        AWSSecretsManager client = AWSSecretsManagerClientBuilder.standard()
                .withRegion(REGION)
                .build();

        String secret = null;
        GetSecretValueRequest getSecretValueRequest = new GetSecretValueRequest()
                .withSecretId(SECRET_NAME);
        GetSecretValueResult getSecretValueResult = null;

        try {
            getSecretValueResult = client.getSecretValue(getSecretValueRequest);
        } catch (DecryptionFailureException e) {
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw e;
        } catch (InternalServiceErrorException e) {
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw e;
        } catch (InvalidParameterException e) {
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw e;
        } catch (InvalidRequestException e) {
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw e;
        } catch (ResourceNotFoundException e) {
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw e;
        }

        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if (getSecretValueResult.getSecretString() != null) {
            secret = getSecretValueResult.getSecretString();
        } else {
            // TODO
        }

        // Your code goes here.
        return extractKey(secret);
    }

    private static String extractKey(String jsonString) {
        String key = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readValue(jsonString, JsonNode.class);
            key = root.get("deepl_api_key").getTextValue();
        } catch (IOException e) {
            // TODO
            e.printStackTrace();
        }
        return key;
    }

}
