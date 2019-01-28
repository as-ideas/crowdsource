function AdminList(template) {

    this.getPendingIdeas = function() {
        return template.find('');
    };

    this.getRejectedIdeas = function() {
        return template.find('');
    };

    this.getPendingFilterButton = function() {
        return template.find('name["pending-filter"]');
    };

    this.getRejectedFilterButton = function() {
        return template.find('name["rejected-filter"]');
    }
}