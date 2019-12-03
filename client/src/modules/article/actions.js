import { defineAction } from '@cheesecakelabs/boilerplate/utils'

import { get } from '_services/article'

export const GET_ARTICLES = defineAction('GET_ARTICLES')

export const getArticles = (subject = null, limit = 0, offset = 0) => ({
  type: GET_ARTICLES,
  payload: get(subject, limit, offset),
})
