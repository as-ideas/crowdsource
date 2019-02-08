import React from 'react'
import styles from './Footer.module.scss'
import ContentContainer from'atoms/container/ContentContainer'

class Footer extends React.Component {
    render () {
        return (
            <div className={styles.container}>
                <ContentContainer>
                    <ul className={styles.column}>
                        <li className={styles['column-headline']}>CrowdSource</li>
                        <li className={styles['column-item']}><a href="#/intro">Entdecken</a></li>
                        <li className={styles['column-item']}><a href="#/login">Log In</a></li>
                        <li className={styles['column-item']}><a href="#/signup">Registrieren</a></li>
                    </ul>
                    <ul className={styles.column}>
                        <li className={styles['column-headline']}>Hilfe</li>
                        <li className={styles['column-item']}><a href="#/about">Über uns</a></li>
                        <li className={styles['column-item']}><a href="#/faq">FAQ</a></li>
                        <li className={styles['column-item']}><a href="#/imprint">Impressum</a></li>
                        <li className={styles['column-item']}><a href="#/privacy">Datenschutzerklärung</a></li>
                    </ul>
                </ContentContainer>
            </div>
        )
    }
}

export default Footer
