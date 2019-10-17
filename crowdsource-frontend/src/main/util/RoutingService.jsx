let createHistory = require('history').createBrowserHistory;

const RoutingService = {};

RoutingService.history = createHistory({basename: '/'});

RoutingService.openExternal = (url) => {
  window.open(url);
};

RoutingService.goBack = () => {
  return RoutingService.history.goBack();
};

RoutingService.redirectToOriginallyRequestedPageOr = (fallbackUrl) => {
  // HINT: It's not possible to store the old routes (without a huge effort and bugs)
  // To prevent a deadlock logout -> login -> redirect to logout, as it's the last page
  // the redirectToOriginallyRequestedPageOr function only works while accessing the app
  // with direct links without beeing logged in. Otherwise you will always be redirected to the
  // landingpage
  if (RoutingService.history.length < 2) {
    RoutingService.goBack()
  } else {
    RoutingService.goToRoute(fallbackUrl);
  }
};

RoutingService.getHistory = () => {
  return RoutingService.history;
};

RoutingService.goToLoginPage = () => {
  return RoutingService.history.push('/login');
};

RoutingService.goToLogoutPage = () => {
  return RoutingService.history.push('/user-logout');
};

RoutingService.goToSignUpPage = () => {
  return RoutingService.history.push('/signup');
};

RoutingService.goToSuccessPageForUser = (user) => {
  RoutingService.history.push('/signup/' + user.email + '/' + user.firstName + '/' + user.lastName + '/success');
};

RoutingService.goToRoute = (route) => {
  return RoutingService.history.push(route);
};


export default RoutingService;
