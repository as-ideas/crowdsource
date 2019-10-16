const ValidationService = {};


ValidationService.isEmailValid = (email) => {
  console.log("validate: " + email);
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

ValidationService.errorObjectFromBackend = (errorObject) => {
  let errors = {};
  if (errorObject.errorCode) {
    if (errorObject.fieldViolations) {
      for (let errorProperty in errorObject.fieldViolations) {
        let errorInBackend = errorObject.fieldViolations[errorProperty];
        errors[errorProperty] = [backendErrorCodeToLabel(errorProperty, errorInBackend)];
      }
    } else {
      errors.general = errorObject.errorCode;
    }
  }
  return errors;
};

function backendErrorCodeToLabel(field, errorCode) {
  if (field === 'email') {
    if (errorCode === 'required') {
      return 'FORM_EMAIL_ERROR_REQUIRED';
    } else if (errorCode === 'email') {
      return 'FORM_EMAIL_ERROR_INVALID';
    } else if (errorCode === 'remote_eligible' || errorCode === 'eligible') {
      return 'FORM_EMAIL_ERROR_INVALID_UNIT';
    } else if (errorCode === 'non_blacklisted_email') {
      return 'FORM_EMAIL_ERROR_INVALID_BLACKLIST';
    } else if (errorCode === 'remote_not_activated' || errorCode === 'not_activated') {
      return 'FORM_EMAIL_ERROR_ALREADY_ACTIVATED_1';
    } else {
      return 'unknown error in ' + field + ' with errorCode ' + errorCode;
    }
  }

  if (errorCode === "remote_bad_credentials") {
    return "LOGIN_ERROR_INVALID_CREDENTIALS"
  } else if (errorCode === "remote_unknown") {
    return "FORM_ERROR_UNEXPECTED";
  } else {
    console.error("Error on login, unknown errorCode", errorCode);
    return errorCode;
  }
}

export default ValidationService;
