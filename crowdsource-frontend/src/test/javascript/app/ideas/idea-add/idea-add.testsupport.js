function IdeaAdd(element) {

    this.setTitle = function (title) {
        return element.find('.idea-add__title').val(title).trigger('input');
    };

    this.setPitch = function (pitch) {
        return element.find('.idea-add__pitch').val(pitch).trigger('input');
    };

    this.submitForm = function () {
        return element.find('.idea-primary').click();
    };

    this.getSubmitButton = function () {
        return element.find('button[type="submit"]');
    };

    this.getPitchInput = function () {
        return val = element.find('.idea-add__pitch').val();
    };

    this.getTitleInput = function () {
        return element.find('.idea-add__title').val();
    };

    this.isButtonDisabled = function() {
        return element.find('.idea-add__submit');
    }
}