import { defineAction } from '@cheesecakelabs/boilerplate/utils'

import { getAll } from '_services/subject'

export const GET_SUBJECTS = defineAction('GET_SUBJECTS')

export const getSubjects = () => ({
  type: GET_SUBJECTS,
  payload: getAll(),
})
