function IdeasStatusBar(element) {

    this.adminButton = function () {
      return element.find("a[name='admin-button']");
    };
  this.userButton = function () {
    return element.find("a[name='user-button']");
    };
};
