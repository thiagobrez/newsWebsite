import { Map } from 'immutable'
import { createReducer } from '@cheesecakelabs/boilerplate/utils'

import { GET_SUBJECTS } from './actions'

const INITIAL_STATE = new Map()

export const subject = createReducer(INITIAL_STATE, {
  [GET_SUBJECTS.FULFILLED]: (state, { payload }) =>
    payload.reduce((finalState, item) => finalState.set(item.name, item), INITIAL_STATE),
})
