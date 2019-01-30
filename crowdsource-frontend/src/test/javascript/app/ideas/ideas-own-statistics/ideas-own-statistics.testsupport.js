function IdeasOwnStatistics(element) {
    this.element = element;
    this.getApprovedCount = function () {
        return element.find('li:nth-child(1) span').text();
    };

    this.getProposedCount = function () {
        return element.find('li:nth-child(2) span').text();
    };

    this.getRejectedCount = function() {
        return element.find('li:nth-child(3) span').text();
    }
}