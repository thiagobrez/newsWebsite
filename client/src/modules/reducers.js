import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { error, loading } from '@cheesecakelabs/boilerplate/reducers'

import { user } from './user/reducers'
import { auth } from './auth/reducers'
import { subject } from './subject/reducers'
import { article } from './article/reducers'

const rootReducer = combineReducers({
  routing,
  user,
  auth,
  error,
  loading,
  subject,
  article,
})

export default rootReducer
