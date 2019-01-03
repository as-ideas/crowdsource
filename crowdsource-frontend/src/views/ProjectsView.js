import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import FormBox from "../atoms/container/FormBox";

class ProjectsView extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                    <FormBox>
                        <h1>Projekte</h1>
                    </FormBox>
            </div>
        )
    }
}

export default ProjectsView