import fetchIntercept from "fetch-intercept";
import RoutingService from "./RoutingService";
import AuthService from "./AuthService";

const UnauthorizedInterceptor = {};

UnauthorizedInterceptor.init = () => {
  fetchIntercept.register({
    // Modify the url or config here
    request: function (url, config) {
      console.log("Interceptor request", url);

      if (!config) {
        config = {};
      }
      if (!config.headers) {
        config.headers = {};
      }
      if (!config.headers["Accept"]) {
        config.headers["Accept"] = "application/json, text/plain, */*"
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = 'application/json';
      }

      let tokens = AuthService.getToken();
      if (tokens) {
        config.headers['Authorization'] = tokens.token_type + ' ' + tokens.access_token;
      }
      return [url, config];
    },

    // Called when an error occured during another 'request' interceptor call
    requestError: function (error) {
      console.error("REQUEST ERROR!", error);
      return Promise.reject(error);
    },

    // Modify the reponse object
    response: function (response) {
      console.log("Interceptor logout", response.url);
      // if(response.url.includes("/oauth/token")) {
      //
      // }
      if (response.status === 401) {
        // Clear current JWT
        console.log("UnauthorizedInterceptor 401 Unauthorized -> logout");
        AuthService.logout();

        // redirect to login
        RoutingService.goToLoginPage();
      }

      if (response.status === 403) {
        console.log("UnauthorizedInterceptor 403 Forbidden -> got to login");
        RoutingService.goToLoginPage();
      }

      return response;
    },

    // Handle an fetch error
    responseError: function (error) {
      console.error("RESPONSE ERROR!", JSON.stringify(error));
      return Promise.reject(error);
    },

  });
};

export default UnauthorizedInterceptor;
