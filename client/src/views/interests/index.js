import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

import Button, { ButtonTheme, ButtonColor } from '../../components/button'
import { GET_SUBJECTS } from '../../modules/subject/actions'

import styles from './styles.css'

const mapStateToProps = ({ loading, user, subject }) => ({
  isLoading: loading.get(GET_SUBJECTS.ACTION),
  user,
  subject,
})

const mapDispatchToProps = {}

class Interests extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    user: ImmutablePropTypes.map,
    subject: ImmutablePropTypes.map,
    getSubjects: PropTypes.func,
  }

  static defaultProps = {
    isLoading: false,
    user: new Map(),
    subject: new Map(),
    getSubjects: () => {},
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.subject.size && nextProps.subject.size) {
      const state = [...nextProps.subject.values()].reduce((finalObj, currentSubject) => {
        // eslint-disable-next-line no-param-reassign
        finalObj[currentSubject.id] = false

        return finalObj
      }, {})

      this.setState(state)
    }
  }

  selectInterest = interestId => {
    this.setState({ [interestId]: !this.state[interestId] })
  }

  render() {
    const { isLoading, user, subject, router } = this.props
    const username = user.get('username')

    if (isLoading) return null

    return (
      <div className={styles.container}>
        <div className={styles.navbar}>
          <span className={styles.welcomeText}>WELCOME, </span>
          <span className={styles.usernameText}>{username && username.toUpperCase()}</span>
        </div>
        <div className={styles.interests}>
          <div className={styles.interestsTitle}>
            <span className={styles.interestsTitleText}>MY INTERESTS</span>
          </div>
          <div className={styles.interestsButtons}>
            {[...subject.values()].map(el => (
              <div className={styles.interestsButtonWrapper} key={el.id}>
                <Button
                  theme={ButtonTheme.OUTLINE}
                  color={el.color}
                  onClick={() => this.selectInterest(el.id)}
                >
                  {el.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mainButtons}>
          <div className={styles.mainButtonsWrapper}>
            <Button
              theme={ButtonTheme.RECTANGULAR}
              color={ButtonColor.BLUE}
              onClick={() => router.push('/')}
            >
              SAVE
            </Button>
          </div>
          <div className={styles.mainButtonsWrapper}>
            <Button color={ButtonColor.BLUE} onClick={() => router.push('/')}>
              BACK TO HOME
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interests)
