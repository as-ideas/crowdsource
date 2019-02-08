import React from 'react'
import styles from './Breadcrumb.module.scss'
import ContentContainer from'atoms/container/ContentContainer'

class Breadcrumb extends React.Component {
    render () {
        return (
            <div className={styles.container}>
                <ContentContainer>
                    CROWD
                </ContentContainer>
            </div>
        )
    }
}

export default Breadcrumb
