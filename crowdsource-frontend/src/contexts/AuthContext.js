import React from 'react'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        isAuth: false,
        role: 'guest'
    }

    constructor() {
        super()
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    login() {
        setTimeout(() => this.setState({isAuth: true, role: 'user'}), 1000)
    }

    logout() {
        setTimeout(() => this.setState({isAuth: false, role: 'guest'}), 1000)
    }

    render() {
        return (
            <AuthContext.Provider value={{
                isAuth: this.state.isAuth,
                login: this.login,
                logout: this.logout
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }

