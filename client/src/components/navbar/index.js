import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import Button, { ButtonColor, ButtonFontWeight } from '../button'
import { getArticles } from '../../modules/article/actions'

import styles from './styles.css'

const mapStateToProps = ({ subject }) => ({
  subject,
})

const mapDispatchToProps = { getArticles }

class Navbar extends PureComponent {
  render() {
    const { toggleMenu, subject, router, getArticles } = this.props

    return (
      <div>
        <div className={styles.navbar}>
          <div className={styles.menuContainer}>
            <img
              srcSet="http://localhost:8000/media/menu.png 1x, http://localhost:8000/media/menu@2x.png 2x"
              alt="menu"
              onClick={toggleMenu}
            />
          </div>
          <div className={styles.logoContainer}>
            <img
              srcSet="http://localhost:8000/media/logo.png 1x, http://localhost:8000/media/logo@2x.png 2x"
              alt="logo"
              onClick={() => router.push('/')}
            />
          </div>
          <div className={styles.mainButtonsContainer}>
            {[...subject.values()].map(el => (
              <Button key={el.id} onClick={() => getArticles(el.id)}>
                {el.name}
              </Button>
            ))}
          </div>
          <div className={styles.loginButtonContainer}>
            <Button
              color={ButtonColor.BLUE}
              fontWeight={ButtonFontWeight.BOLD}
              onClick={() => router.push('/login')}
            >
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

Navbar.propTypes = {
  // eslint-disable-next-line react/require-default-props
  toggleMenu: PropTypes.func,
  getArticles: PropTypes.func,
  subject: ImmutablePropTypes.map,
}

Navbar.defaultProps = {
  toggleMenu: () => {},
  getArticles: () => {},
  subject: new Map(),
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
