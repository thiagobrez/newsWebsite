import { Map, fromJS } from 'immutable'
import { createReducer } from '@cheesecakelabs/boilerplate/utils'

import { GET_USER } from './actions'

export const INITIAL_STATE = new Map()

export const user = createReducer(INITIAL_STATE, {
  [GET_USER.FULFILLED]: (state, { payload }) => fromJS(payload[0]),
})
