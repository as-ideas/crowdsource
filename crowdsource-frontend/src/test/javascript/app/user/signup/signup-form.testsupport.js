/**
 * "page-object" for Signup-View
 */
function SignupForm(element) {

    this.getGeneralErrorsContainer = function () {
        return element.find('.general-error');
    };

    this.getGeneralError = function (violatedRule) {
        return this.getGeneralErrorsContainer().find('[ng-message="' + violatedRule + '"]');
    };

    this.getFirstName = function () {
        return element.find('input[name=firstName]');
    }

    this.getLastName = function () {
        return element.find('input[name=lastName]');
    }

    this.email = new FormGroup(element.find('.form-controls-email'));

    this.termsOfServiceAccepted = new FormGroup(element.find('.form-controls-termsofservice'));

    this.getTosLinkForValidLabel = function () {
        var link = element.find('.valid-label .crowd-tos-link');
        return link;
    };

    this.getTosLinkForInvalidLabel = function () {
        var link = element.find('.invalid-label .crowd-tos-link');0
        return link;
    };

    this.getSubmitButton = function () {
        return element.find('button[type="submit"]');
    };

    this.getTosPanel = function () {
        return element.find('.crowd-tos-panel');
    };
}
