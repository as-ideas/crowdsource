package de.asideas.crowdsource.service.translation;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18n;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.security.awssecretsmanager.CrowdAWSSecretsManager;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.http.client.utils.URIBuilder;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

@Service
public class TranslationService {

    @Autowired
    private CrowdAWSSecretsManager crowdAWSSecretsManager;

    private static final Logger log = getLogger(TranslationService.class);

    private ArrayList<String> supportedLanguages = new ArrayList<String>() {{
        add("de");
        add("en");
    }};

    /**
     * This method tries to translate an idea but does NOT throw any exception. If the translation fails, the
     * unmodified IdeaEntity should still be saved.
     *
     * @param ideaEntity The IdeaEntity to be translated
     */
    public void translateIdea(IdeaEntity ideaEntity) {
        List<SingleTranslation> translationResults = new ArrayList<>();

        try {
            translationResults = callTranslationServiceForGivenIdea(ideaEntity);
        } catch (Exception e) {
            log.error("An exception occurred while using the translation service! One or more submitted ideas might be untranslated in the database.", e);
        }

        String bestGuessSourceLanguage = decideSourceLanguage(translationResults);
        ideaEntity.getContentI18n().setOriginalLanguage(bestGuessSourceLanguage);

        for (SingleTranslation translation : translationResults) {
            IdeaContentI18n ideaContentI18n = new IdeaContentI18n(translation.getTitle(), translation.getPitch());
            setTranslatedIdeaContent(ideaEntity, ideaContentI18n, translation.targetLanguage);
        }
    }

    private List<SingleTranslation> callTranslationServiceForGivenIdea(IdeaEntity ideaEntity) throws Exception {
        List<SingleTranslation> translations = new ArrayList<>();
        for (String language : supportedLanguages) {
            SingleTranslation singleTranslation = getTranslation(ideaEntity, language);
            translations.add(singleTranslation);
        }
        return translations;
    }

    private SingleTranslation getTranslation(IdeaEntity ideaEntity, String targetLang) throws Exception {
        final String apiKey = crowdAWSSecretsManager.getDeepLKey();

        final String origTitle = ideaEntity.getOriginalTitle();
        final String origPitch = ideaEntity.getOriginalPitch();

        final URI uri = new URIBuilder("https://api.deepl.com/v2/translate?")
            .addParameter("auth_key", apiKey)
            .addParameter("text", origTitle)
            .addParameter("text", origPitch)
            .addParameter("target_lang", targetLang).build();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        final RequestEntity<String> requestEntity = new RequestEntity<>(headers, HttpMethod.GET, uri);

        final ResponseEntity<DeeplResponse> responseEntity = restTemplate.exchange(requestEntity, DeeplResponse.class);
        final DeeplResponse resp = responseEntity.getBody();
        final Translation title = resp.translations.get(0);
        final Translation pitch = resp.translations.get(1);

        return new SingleTranslation(pitch.detectedSourceLanguage, targetLang, title.text, pitch.text);
    }

    /*
        Ideally an identical string should always show the same source-language. Just in case the API
        returns inconsistent responses we fall back to the default language.
     */
    private String decideSourceLanguage(List<SingleTranslation> singleTranslations) {
        // use this as a fallback because most of our users are German.
        final String defaultLanguage = "de";
        String detectedLanguage = null;

        if (singleTranslations != null) {
            for (SingleTranslation singleTranslation : singleTranslations) {
                if (detectedLanguage != null && !detectedLanguage.equals(singleTranslation.sourceLanguage)) {
                    //we have a problem
                    log.error("No unambiguous source language detected! Setting default: " + defaultLanguage);
                    return defaultLanguage;
                } else {
                    detectedLanguage = singleTranslation.sourceLanguage;
                }
            }
        }

        log.info("Detected language: " + detectedLanguage);
        return detectedLanguage;
    }

    private void setTranslatedIdeaContent(IdeaEntity idea, IdeaContentI18n content, String language) {
        switch (language) {
            case "de":
                idea.getContentI18n().setDe(content);
                break;
            case "en":
                idea.getContentI18n().setEn(content);
                break;
            default:
                log.error("setTranslatedIdeaContent: language not supported (" + language + ")");
        }
    }

    private static class SingleTranslation {
        private String sourceLanguage;
        private String targetLanguage;
        private String title;
        private String pitch;

        public SingleTranslation(String sourceLanguage, String targetLanguage, String title, String pitch) {
            this.sourceLanguage = sourceLanguage;
            this.targetLanguage = targetLanguage;
            this.title = title;
            this.pitch = pitch;
        }

        public String getSourceLanguage() {
            return sourceLanguage;
        }

        public String getTargetLanguage() {
            return targetLanguage;
        }

        public String getTitle() {
            return title;
        }

        public String getPitch() {
            return pitch;
        }
    }

    private static class DeeplResponse {
        @JsonProperty
        List<Translation> translations;
    }

    private static class Translation {
        @JsonProperty
        String text;
        @JsonProperty("detected_source_language")
        String detectedSourceLanguage;
    }


}
