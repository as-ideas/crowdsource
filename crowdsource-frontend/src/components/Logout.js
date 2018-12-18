import React from 'react'
import { AuthConsumer } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

class Logout extends React.Component {
    render() {
        return (
            <AuthConsumer>
                {({ isAuth, login, logout }) => (
                    logout(),
                    <div>
                        <p>Du wurdest ausgeloggt</p>
                        <p>Du kannst Dich <Link to="login">hier</Link> wieder einloggen.</p>
                    </div>
                )}
            </AuthConsumer>
        )
    }
}

export default Logout