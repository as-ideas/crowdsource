import React from 'react'
import styles from './ContentContainer.module.scss'

class ContentContainer extends React.Component {
    render () {
        return (
            <div className={styles.container}>
                {this.props.children}
            </div>
        )
    }
}

export default ContentContainer
