
import * as messages from 'i18n/en'

export default () => (req, res, next) => {
  res.locals.state.intl = {
    locale: 'en',
    messages
  }
  next()
}
