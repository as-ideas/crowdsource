import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import {Link} from "react-router-dom";
import FormBox from "../atoms/container/FormBox";

class LogoutView extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <AuthConsumer>
                    {({ logout }) => (
                    logout(),
                    <FormBox>
                        <h1>Du wurdest ausgeloggt</h1>
                        <p>Du kannst Dich <Link to="login">hier</Link> wieder einloggen.</p>
                    </FormBox>
                    )}
                </AuthConsumer>
            </div>
        )
    }
}

export default LogoutView