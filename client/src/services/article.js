import request from '_utils/request'

export const get = (subject = null, limit = 0, offset = 0) => {
  let url = `articles?limit=${limit}&offset=${offset}`
  if (subject) url = `${url}&subject=${subject}`

  return request().get([url])
}
