let createHistory = require('history').createBrowserHistory;

const RoutingService = {};

RoutingService.history = createHistory({basename: '/'});

RoutingService.back = () => {
    return RoutingService.history.goBack();
};

RoutingService.getHistory = () => {
    return RoutingService.history;
};

RoutingService.goToLoginPage = () => {
    return RoutingService.history.push('/login');
};

RoutingService.goToRoute = (route) => {
    return RoutingService.history.push(route);
};

export default RoutingService;
