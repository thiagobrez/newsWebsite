import { defineAction } from '@cheesecakelabs/boilerplate/utils'

import { get } from '_services/user'

export const GET_USER = defineAction('GET_USER')

export const getUser = user => ({
  type: GET_USER,
  payload: get(user),
})
