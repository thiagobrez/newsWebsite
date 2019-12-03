import Fetch from '@cheesecakelabs/fetch'

const getHeaders = () => {
  const headers = {
    Accept: 'application/json; version=1.0',
    'Content-Type': 'application/json',
  }

  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Token ${token}`

  return headers
}

export default () =>
  new Fetch(
    'http://localhost:8000',
    {
      headers: getHeaders(),
    },
    {
      removeTrailingSlash: true,
    }
  )
