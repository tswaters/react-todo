
import {getUser} from 'common/redux/user'
import {initiateRequest, finishRequest, errorRequest} from 'common/redux/api'

const baseUrl = process.env.BASE_URL

export default (dispatch, getState) => async (url, method, body) => {
  const {user} = getUser(getState())

  dispatch(initiateRequest())

  const response = await fetch(`${baseUrl}${url}`, {
    method,
    credentials: 'same-origin',
    headers: Object.assign(
      {'Content-Type': 'application/json'},
      user ? {'x-token': user.token} : null
    ),
    body: body ? JSON.stringify(body) : null
  })

  const result = await response.json()

  if (response.ok) {
    dispatch(finishRequest())
    return result
  }

  dispatch(errorRequest(result))
  return false
}
