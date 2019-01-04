import React from 'react'
import styles from './PrimaryButton.module.scss'

class PrimaryButton extends React.Component {
  render () {
    return (
      <button type='button' className={styles['primary-button']} onClick={this.props.onClick}>{this.props.label}</button>
    )
  }
}

export default PrimaryButton
