function IdeasOwnStatistics(element) {
    this.element = element;
    this.getApprovedCount = function () {
        var text = element.find('li:nth-child(1) span:nth-child(1)').text();
        return text;
    };

    this.getProposedCount = function () {
        var text = element.find('li:nth-child(2) span:nth-child(1)').text();
        return element.find('li:nth-child(2) span:nth-child(1)').text();
    };

    this.getRejectedCount = function() {
        return element.find('li:nth-child(3) span:nth-child(1)').text();
    }
}