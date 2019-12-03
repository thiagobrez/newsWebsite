import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map, List, fromJS } from 'immutable'
import { browserHistory } from 'react-router'

import { login, AUTH_LOGIN } from '../../modules/auth/actions'
import { getUser } from '../../modules/user/actions'
import Input from '../../components/input'
import Button, { ButtonColor, ButtonTheme } from '../../components/button'

import styles from './styles.css'

const mapStateToProps = ({ loading, error, auth, routing, user }) => {
  const nextRoute = fromJS(routing).getIn(['locationBeforeTransitions', 'state', 'next'])
  return {
    isLoading: loading.get(AUTH_LOGIN.ACTION),
    errors: error.get(AUTH_LOGIN.ACTION),
    auth,
    nextRoute: nextRoute && nextRoute.toJS(),
    user,
  }
}

const mapDispatchToProps = { login, getUser }

class Login extends Component {
  static propTypes = {
    login: PropTypes.func,
    isLoading: PropTypes.bool,
    errors: ImmutablePropTypes.map,
    // eslint-disable-next-line react/no-unused-prop-types
    nextRoute: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }),
    getUser: PropTypes.func,
    auth: ImmutablePropTypes.map,
  }

  static defaultProps = {
    login: () => {},
    isLoading: false,
    errors: new Map(),
    nextRoute: undefined,
    getUser: () => {},
    auth: new Map(),
  }

  state = {
    username: '',
    password: '',
  }

  componentWillReceiveProps({ auth, user }) {
    const token = auth.get('token')
    const username = user.get('username')

    if (!this.props.auth.get('token') && token) {
      localStorage.setItem('token', token)
      this.props.getUser(this.state.username)
    }

    if (username) {
      browserHistory.replace('/interests')
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const { username, password } = this.state
    this.props.login(username, password)
  }

  getErrors = () => {
    const { errors, isLoading } = this.props
    if (errors.size > 0 && !isLoading) {
      return errors.get('non_field_errors', new List(['unknown error'])).first()
    }
    return null
  }

  handleInput = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { username, password } = this.state
    const { isLoading } = this.props

    return (
      <form onSubmit={this.onSubmit}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.headerText}>USER AREA</span>
          </div>
          <div className={styles.form}>
            <div className={styles.wrapper}>
              <Input text="username" name="username" value={username} onChange={this.handleInput} />
            </div>
            <div className={styles.wrapper}>
              <Input
                text="password"
                name="password"
                type="password"
                value={password}
                onChange={this.handleInput}
              />
            </div>
            <div className={styles.wrapper}>
              <Button
                type="submit"
                theme={ButtonTheme.RECTANGULAR}
                color={ButtonColor.BLUE}
                disabled={isLoading}
              >
                LOGIN
              </Button>
            </div>
            {this.getErrors()}
          </div>
        </div>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
