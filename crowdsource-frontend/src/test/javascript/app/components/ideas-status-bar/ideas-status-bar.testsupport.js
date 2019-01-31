function IdeasStatusBar(element) {

    this.element = element;

    this.adminButton = function () {
        return element.find("a[name='admin-button']");
    };

    this.getDuration = function () {
        var el = element.find("span.ideas-status-timeleft").text();
    }
};
