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
  console.info("redirectToOriginallyRequestedPageOr", RoutingService.history.length);
  if (RoutingService.history.length > 2) {
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


RoutingService.goToSignUpPage = () => {
  return RoutingService.history.push('/signup');
};

RoutingService.goToSuccessPageForUser = (user) => {
  RoutingService.history.push('/signup/' + user.email + '/' + ser.firstName + '/' + user.lastName + '/success');
};

RoutingService.goToRoute = (route) => {
  return RoutingService.history.push(route);
};


export default RoutingService;
