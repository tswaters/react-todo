
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

  return fetch(`${baseUrl}${url}`, options)
    .then(res => { dispatch(finishRequest()); return res })
    .then(res => {
      if (!res.ok) { return res.json().then(err => { throw err }) }
      return res.json()
    })
    .catch(err => { dispatch(errorRequest(err.message)); throw err })
}
