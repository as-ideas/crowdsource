function IdeaTile(element) {

    this.getPitch = function () {
        return element.find('.ideas-grid-tile__text').text();
    };

    this.getTitle = function () {
        return element.find('.ideas-grid-tile__title').text();
    };

    this.getAuthor = function () {
        return element.find('.ideas-grid-tile__author').text();
    };

    this.getApprovalContainer = function () {
        return element.find('.ideas-grid-tile__approval-container');
    };

    this.getApprovalButton = function () {
        return element.find('.ideas-grid-tile__btn-approve');
    };

    this.getRejectButton = function () {
        return element.find('.ideas-grid-tile__btn ideas-grid-tile__btn-reject');
    };

    this.getRejectionMessage = function () {
        return element.find('.ideas-grid-tile__rejectionMessage');
    };

    this.getPublishedMessage = function () {
        return element.find('.ideas-grid-tile__publishedMessage');
    };

}