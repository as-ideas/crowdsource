import React from 'react'
import styles from './FormBox.module.scss'

class FormBox extends React.Component {
  render () {
    return (
      <div className={styles['form-box']}>{this.props.children}</div>
    )
  }
}

export default FormBox
