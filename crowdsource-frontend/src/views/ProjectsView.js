import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import FormBox from "../atoms/container/FormBox";
import Form from "../atoms/forms/Form";
import PrimaryButton from "../atoms/buttons/PrimaryButton"
import { Redirect } from 'react-router-dom'

class ProjectsView extends React.Component {

    state = {
        redirect: false
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/logout' />
        }
    }

    render() {
        return (
            <div>
            {this.renderRedirect()}
            <Header/>
                Projekte...
                <AuthConsumer>
                    {({ isAuth, login }) => (
                        <FormBox>
                            {!isAuth ? (
                                <div>
                                    <Redirect to={"/login"} />
                                </div>
                            ) : (
                                <div>
                                    <h1>Projekte</h1>
                                    <Form>
                                        <PrimaryButton label="Logout" onClick={this.setRedirect}/>
                                    </Form>
                                </div>
                            )}

                        </FormBox>
                    )}
                </AuthConsumer>
            </div>
        )
    }
}

export default ProjectsView