const TranslationService = {currentLanguage: 'de'};

TranslationService.getCurrentLanguage = () => {
    return TranslationService.currentLanguage;
};

TranslationService.translate = (value) => {
    return value;
};

TranslationService.isCurrentLanguage = (valueToBeChecked) => {
    return TranslationService.currentLanguage === valueToBeChecked;
};

TranslationService.changeLanguage = (newLanguage) => {
    TranslationService.currentLanguage = newLanguage;
};

export default TranslationService;