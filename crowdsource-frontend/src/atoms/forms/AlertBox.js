import React from 'react'
import styles from './AlertBox.module.scss'

class AlertBox extends React.Component {
    render() {
        return (
            <div className={styles["alert-box"]}>{this.props.message}</div>
        )
    }
}

export default AlertBox