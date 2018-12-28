import React from 'react'
import styles from './PrimaryButton.module.scss';

class PrimaryButton extends React.Component {
    render() {
        return (
            <button type="button" className={styles["primary-button"]}>{this.props.label}</button>
        )
    }
}

export default PrimaryButton