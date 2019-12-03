import request from '../utils/request'

export const login = (username, password) =>
  request().post(
    ['api-token-auth/'],
    {},
    {
      username,
      password,
    }
  )
