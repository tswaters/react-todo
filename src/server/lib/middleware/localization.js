
import * as messages from 'i18n/en'

export default () => (req, res, next) => {
  res.locals.intl = {
    locale: 'en',
    messages
  }
  next()
}
