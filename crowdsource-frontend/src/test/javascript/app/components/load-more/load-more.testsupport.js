function LoadMoreView(el) {
    this.element = el;

    this.getLabel = function () {
        return this.element.find('.loadMore__button').text();
    };

    this.clickButton = function () {
        return this.element.find('.loadMore__button').click();
    };

    this.getButton = function () {
        return this.element.find('.loadMore__button');
    };
}