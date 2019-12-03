import { Map } from 'immutable'
import { createReducer } from '@cheesecakelabs/boilerplate/utils'

import { GET_ARTICLES } from './actions'

const INITIAL_STATE = new Map()

export const article = createReducer(INITIAL_STATE, {
  [GET_ARTICLES.FULFILLED]: (state, { payload }) =>
    payload.reduce((finalState, item, index) => finalState.set(index, item), INITIAL_STATE),
})
