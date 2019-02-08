import React from 'react'
import styles from './FormContainer.module.scss'

class FormContainer extends React.Component {
  render () {
    return (
      <div className={styles['form-box']}>{this.props.children}</div>
    )
  }
}

export default FormContainer
