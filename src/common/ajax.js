
import {getUser} from 'common/redux/user'
import {initiateRequest, finishRequest, errorRequest} from 'common/redux/api'

const baseUrl = process.env.BASE_URL

const credentials = 'same-origin'

const headers = {
  'Content-Type': 'application/json'
}

export default (dispatch, getState) => (url, method, body) => {
  const {user} = getUser(getState())
  if (user) { headers['x-token'] = user.token }

  dispatch(initiateRequest())

  const options = Object.assign({},
    {method, credentials, headers},
    {body: body ? JSON.stringify(body) : null}
  )

  let response = null

  return fetch(`${baseUrl}${url}`, options)
    .then(res => res.json().then(data => {
      if (!res.ok) { throw data }
      return data
    }))
    .then(data => response = data)
    .then(() => dispatch(finishRequest()))
    .catch(err => { dispatch(errorRequest(err)); throw err })
    .then(() => response)
}
