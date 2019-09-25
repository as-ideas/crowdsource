import fetchIntercept from "fetch-intercept";
import AuthService from "./AuthService";

const UnauthorizedInterceptor = {};

UnauthorizedInterceptor.init = () => {
    fetchIntercept.register({
        // Modify the url or config here
        request: function (url, config) {
            if (!config) {
                config = {};
            }
            if (!config.headers) {
                config.headers = {};
            }
            // config.headers["Content-Type"] = 'application/json';

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
            if (response.status === 401) {
                // Clear current JWT
                AuthService.logout();

                // redirect to login
                RoutingService.goToLoginPage();
            }

            if (response.status === 403) {
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