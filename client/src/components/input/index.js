import PropTypes from 'prop-types'
import React from 'react'

import styles from './styles.css'

const Input = ({ text, name, type, value, onChange }) => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>
      <input type={type} name={name} value={value} onChange={onChange} className={styles.input} />
    </div>
  )
}

Input.propTypes = {
  // eslint-disable-next-line react/require-default-props
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default Input
