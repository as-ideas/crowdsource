import React from 'react'
import { Link } from 'react-router-dom'
import { AuthConsumer } from "../contexts/AuthContext";
import styles from './Header.module.scss';


class Header extends React.Component {
    render() {
        return (
            <AuthConsumer>
                {({ isAuth, login, logout }) => (
                    <nav className={styles["navigation"]}>
                        {isAuth ? (
                                <ul>
                                    <li><Link to="logout">Logout</Link></li>
                                </ul>
                        ) : (
                                <ul>
                                    <li><Link to="login">Login</Link></li>
                                    <li><Link to="signup">Registieren</Link></li>
                                </ul>
                        )}
                    </nav>
                )}
            </AuthConsumer>
        )
    }
}

export default Header