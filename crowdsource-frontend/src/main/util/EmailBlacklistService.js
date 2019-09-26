const EmailBlacklistService = {};


EmailBlacklistService.isNonExternalEmail = (modelValue) => {
    if (!modelValue) {
        return true;
    }

    for (let i = 0; i < emailBlacklistPatterns.length; i++) {
        if (modelValue.indexOf(emailBlacklistPatterns[i]) >= 0) {
            return false;
        }
    }

    return true;
};

export default EmailBlacklistService;