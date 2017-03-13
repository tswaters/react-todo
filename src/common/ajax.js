
import {initiateRequest, finishRequest, errorRequest} from 'common/redux/api'

const credentials = 'same-origin'

const headers = {
  'Content-Type': 'application/json'
}

export default dispatch => (url, method, body) => {
  dispatch(initiateRequest())

  const options = Object.assign({},
    {method, credentials, headers},
    {body: body ? JSON.stringify(body) : null}
  )

  return fetch(url, options)
    .then(res => { dispatch(finishRequest()); return res })
    .then(res => {
      if (!res.ok) { return res.json().then(err => { throw err }) }
      return res.json()
    })
    .catch(err => { dispatch(errorRequest(err.message)); throw err })
}
