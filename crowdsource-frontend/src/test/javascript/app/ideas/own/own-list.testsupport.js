function OwnIdeasView(element) {
    this.element = element;

    this.getPublishedIdeas = function() {
        return this.element.find('div.ideas-grid__published');
    };
    this.getProposedIdeas = function() {
        return this.element.find('div.ideas-grid__proposed');
    };
    this.getRejectedIdeas = function () {
        return this.element.find('div.ideas-grid__rejected');
    };
    this.getEmptyLabels = function () {
        return this.element.find(".ideas-grid__empty-label");
    };
}