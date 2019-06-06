package de.asideas.crowdsource.service.translation;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18n;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.security.CrowdAWSSecretsManager;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

@Service
public class TranslationService {

    private static final Logger log = getLogger(TranslationService.class);

    private ArrayList<String> supportedLanguages = new ArrayList<String>() {{
        add("DE");
        add("EN");
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
        List<SingleTranslation> translations = new ArrayList();
        for (String language : supportedLanguages) {
            SingleTranslation singleTranslation = getTranslation(ideaEntity, language);
            translations.add(singleTranslation);
        }
        return translations;
    }

    private SingleTranslation getTranslation(IdeaEntity ideaEntity, String targetLang) throws Exception {
        final String apiKey = CrowdAWSSecretsManager.getDeepLKey();

        final String origTitle = ideaEntity.getOriginalTitle();
        final String origPitch = ideaEntity.getOriginalPitch();

        final String apiPreppedTitle = URLEncoder.encode(replaceAllUmlauts(origTitle));
        final String apiPreppedPitch = URLEncoder.encode(replaceAllUmlauts(origPitch));

        final String uri = "https://api.deepl.com/v2/translate?auth_key=" + apiKey + "&text=" + apiPreppedTitle + "&text=" + apiPreppedPitch + "&target_lang=" + targetLang;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(uri, String.class);

        String sourceLang = null;
        String translatedTitle = null;
        String translatedPitch = null;

        try {
            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(responseEntity.getBody());
            JsonNode translations = root.get("translations");

            final JsonNode title = translations.get(0);
            final JsonNode pitch = translations.get(1);

            translatedTitle = title.get("text").getTextValue();
            translatedPitch = pitch.get("text").getTextValue();
            sourceLang = pitch.get("detected_source_language").getTextValue();

        } catch (IOException e) {
            log.error("GAAAAH!");
        }

        // TODO error handling
        if(sourceLang == targetLang) {
            log.info("source and target language are the same. Use original title and pitch instead of translated: " + sourceLang);
            return new SingleTranslation(sourceLang, targetLang, origTitle, origPitch);
        } else {
            return new SingleTranslation(sourceLang, targetLang, URLDecoder.decode(translatedTitle), URLDecoder.decode(translatedPitch));
        }
    }

    private String replaceAllUmlauts(String input) {
        return input.replaceAll("ä", "ae")
                .replaceAll("ü", "ue")
                .replaceAll("ö", "oe")
                .replaceAll("Ä", "Ae")
                .replaceAll("Ü", "Ue")
                .replaceAll("Ö", "Oe")
                .replaceAll("ß", "ss");
    }

    /*
    Ideally an identical string should always show the same source-language. Just in case the API
    returns inconsistent responses we fall back to the default language.
     */
    private String decideSourceLanguage(List<SingleTranslation> singleTranslations) {
        // use this as a fallback because most of our users are German.
        final String defaultLanguage = "DE";
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

        if (language.equalsIgnoreCase("de")) {
            idea.getContentI18n().setDe(content);
        }
        else if (language.equalsIgnoreCase("en")) {
            idea.getContentI18n().setEn(content);
        } else {
            log.error("setTranslatedIdeaContent: language not supported (" + language + ")");
        }

    }

    private class SingleTranslation {
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

}
