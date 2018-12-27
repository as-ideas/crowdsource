import React from 'react'
import decode from 'jwt-decode'
import param from 'jquery-param'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        isAuth: false,
        role: 'guest',
        token: null
    }

    constructor() {
        super()
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        //this.apiRequest = this.apiRequest.bind(this)

        this.state.token = this.loadToken()
        if(this.state.token) this.state.isAuth = true

        // TODO: Get role
    }

    login(username, password) {
        this.requestAPI('http://localhost:8080/oauth/token', { username, password, client_id: 'web', grant_type: 'password'})
            .then(response => console.log(`Login: ${response}`)
            )
    }

    logout() {
        this.clearToken()
        this.setState({isAuth: false, role: 'guest', token: null})
    }

    loadToken() {
        let _token = localStorage.getItem('access_token')
        if(_token && !this.isTokenExpired(_token)) { return _token }
        else {
            this.clearToken()
            return null
        }
    }

    saveToken(token) {
        localStorage.setItem('access_token', token)
    }

    clearToken() {
        localStorage.removeItem('access_token')
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    async requestAPI(url, params, options, method = "POST") {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.state.isAuth) {
            headers['Authorization'] = 'Bearer ' + this.state.token
        }

// TODO: Remove no-cors? For testing only
         return fetch(url, {
                method,
                headers,
                mode: "no-cors",
                body: param(params),
                ...options
            })
                .then(response => {
                    if(response.status >= 200 && response.status < 300) {
                        response.json()
                    }
                })

    }

    checkResponseStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    render() {
        return (
            <AuthContext.Provider value={{
                isAuth: this.state.isAuth,
                login: this.login,
                logout: this.logout,
                apiRequest: this.apiRequest
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }

