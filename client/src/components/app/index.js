import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import Navbar from '../navbar'
import Button, { ButtonColor, ButtonFontWeight } from '../button'
import { GET_SUBJECTS, getSubjects } from '../../modules/subject/actions'
import { GET_ARTICLES, getArticles } from '../../modules/article/actions'

import styles from './styles.css'

const mapStateToProps = ({ subject, loading }) => ({
  subject,
  loading,
})

const mapDispatchToProps = { getSubjects, getArticles }

class App extends Component {
  constructor(props) {
    super(props)

    props.getSubjects()

    this.state = {
      menuHeight: 0,
    }
  }

  toggleMenu = () => {
    const { menuHeight } = this.state
    const overlay = document.getElementById('overlay')
    const main = document.getElementById('main')

    this.setState({ menuHeight: menuHeight ? 0 : 100 }, () => {
      overlay.style.height = `${this.state.menuHeight}vh`

      if (this.state.menuHeight) {
        overlay.style.boxShadow = '0 0 0'
        main.style.display = 'none'
      } else {
        overlay.style.boxShadow = '5px 0px 5px #979797'
        main.style.display = 'block'
      }
    })
  }

  selectSubject = id => {
    this.props.getArticles(id)
    this.toggleMenu()
  }

  selectLogin = () => {
    this.props.router.push('/login')
    this.toggleMenu()
  }

  render() {
    const { children, router, subject, loading } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.child}>
          <Navbar router={router} toggleMenu={this.toggleMenu} />
        </div>
        <div className={styles.child} id="main">
          {children}
        </div>

        {(loading.get(GET_ARTICLES.ACTION) || loading.get(GET_SUBJECTS.ACTION)) && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingRing}>
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}

        <div className={styles.overlay} id="overlay">
          <div className={styles.overlayContent}>
            {[...subject.values()].map(el => (
              <div key={el.id} className={styles.overlayButtonWrapper}>
                <Button onClick={() => this.selectSubject(el.id)}>{el.name}</Button>
              </div>
            ))}
            <div className={styles.overlayButtonWrapper}>
              <Button
                color={ButtonColor.BLUE}
                fontWeight={ButtonFontWeight.BOLD}
                onClick={this.selectLogin}
              >
                LOGIN
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
  subject: ImmutablePropTypes.map,
  loading: ImmutablePropTypes.map,
  getSubjects: PropTypes.func,
  getArticles: PropTypes.func,
}

App.defaultProps = {
  children: null,
  subject: new Map(),
  loading: new Map(),
  getSubjects: () => {},
  getArticles: () => {},
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
