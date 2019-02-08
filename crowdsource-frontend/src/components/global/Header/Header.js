import React from 'react'
import { Link } from 'react-router-dom'
import ContentContainer from 'atoms/container/ContentContainer'
import IconCrowdsource from 'atoms/icons/IconCrowdsource'
import styles from './Header.module.scss'

class Header extends React.Component {

  render () {
    return (
        <div className={styles['header-spacer']}>
        <header className={styles['header-container']}>
          <ContentContainer>
              <nav className={styles['nav-container']}>
                <ul className={styles['nav-container-item']}>
                    <li className={styles['breadcrumb-item']}><Link className={styles['nav-link']} to='#'><div className={styles['icon-crowdsource']}><IconCrowdsource /></div></Link></li>
                    <li className={styles['breadcrumb-item']}><Link className={styles['nav-link']} to='#'>nav1</Link></li>
                    <li className={styles['breadcrumb-item']}><span className={styles['nav-active']}>nav2</span></li>
                </ul>
                  <ul className={styles['nav-container-item']}>
                    <li className={styles['nav-local-item']}><Link className={styles['nav-link']} to='#'>Deine Ideen</Link></li>
                    <li className={styles['nav-local-item--last']}><Link className={styles['nav-link']} to='#'>Admin</Link></li>
                    <li className={styles['nav-item']}><Link className={styles['nav-link']} to='Login'>Login</Link></li>
                    <li className={styles['nav-item']}><Link className={styles['nav-link']} to='Signup'>Registieren</Link></li>
                  </ul>
              </nav>
          </ContentContainer>
        </header>
        </div>
    )
  }
}

export default Header
