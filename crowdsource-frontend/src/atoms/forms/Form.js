import React from 'react'
import styles from './Form.module.scss';

class Form extends React.Component {
    render() {
        return (
            <form className={styles["form"]}>{this.props.children}</form>
        )
    }
}

export default Form