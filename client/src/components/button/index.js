import PropTypes from 'prop-types'
import React from 'react'

import styles from './styles.css'

export const ButtonTheme = {
  FILL: 'fill',
  OUTLINE: 'outline',
  RECTANGULAR: 'rectangular',
}

export const ButtonColor = {
  GRAY: '#3E433E',
  RED: '#D0021B',
  PURPLE: '#BD10E0',
  BLUE: '#4A90E2',
  GREEN: '#7CBB37',
  ORANGE: '#F5A623',
}

export const ButtonFontWeight = {
  BOLD: 'bold',
}

const Button = ({ type, theme, color, fontWeight, disabled, onClick, children }) => {
  const className = `
    ${styles.button}
    ${styles[theme]}
    ${styles[fontWeight]}
    ${disabled && styles.disabled}
  `

  const style = {
    color,
    borderColor: color,
  }

  if (theme === ButtonTheme.FILL || theme === ButtonTheme.RECTANGULAR) style.background = color

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className} style={style}>
      {children}
    </button>
  )
}

Button.propTypes = {
  // eslint-disable-next-line react/require-default-props
  type: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  theme: PropTypes.oneOf(Object.values(ButtonTheme)),
  color: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  fontWeight: PropTypes.oneOf(Object.values(ButtonFontWeight)),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

Button.defaultProps = {
  color: ButtonColor.GRAY,
  disabled: false,
  onClick: () => {},
}

export default Button
