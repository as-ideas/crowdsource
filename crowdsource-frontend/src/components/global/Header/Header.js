import React from 'react'
import { Link } from 'react-router-dom'
import ContentContainer from 'atoms/container/ContentContainer'
import IconCrowdsource from 'atoms/icons/IconCrowdsource.js'
import styles from './Header.module.scss'

class Header extends React.Component {

    constructor(props) {
        super(props)

        let isMobile = (window.innerWidth <= 768) ? true : false;

        this.state = {
            isMobile,
            isMobileMenuVisible: false
        }
    }

    toggleMobileMenu() {
        this.setState({isMobileMenuVisible: !this.state.isMobileMenuVisible})
    }

  render () {
    return (
        <div className={styles['header-spacer']}>
        <header className={styles['header-container']}>
          <ContentContainer>
              <nav className={styles['navigation']}>
                <div className={styles['header-mobile']}>
                   <Link className={styles['home-link']} to='#'><div className={styles['icon-crowdsource']}><IconCrowdsource /></div></Link>
                    <button className={styles['burger-menu-button']} onClick={() => this.toggleMobileMenu()}></button>
                </div>
                  {(!this.state.isMobile || (this.state.isMobile && this.state.isMobileMenuVisible)) &&
                  <div className={styles['nav-container']}>
                      <div className={styles['breadcrumb-divider']}/>
                      <Link className={styles['breadcrumb-link']} to='#'>Plastikfreies Office</Link>
                      <div className={styles['breadcrumb-divider']}/>
                      <span className={styles['nav-active']}>Übersicht</span>
                      <div className={styles['breadcrumb-nav-divider']}/>
                      <Link className={styles['nav-link']} to='#'>Deine Ideen</Link>
                      <Link className={styles['nav-link']} to='#'>Admin</Link>
                      <div className={styles['nav-divider']}/>
                      <Link className={styles['nav-link']} to='Signup'>Hilfe</Link>
                      <Link className={styles['nav-link']} to='Login'>Login</Link>
                      <Link className={styles['nav-link']} to='Signup'>Registieren</Link>
                  </div>
                  }
              </nav>
          </ContentContainer>
        </header>
        </div>
    )
  }
}

export default Header
