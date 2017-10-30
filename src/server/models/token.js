
import uuid from 'uuid'
import redis from './redis'

import BadRequest from 'server/errors/badRequest'
import NotFound from 'server/errors/notFound'

const {

  /**
   * @type {string} timeout in seconds - 1 day.
   */
  SESSION_TIMEOUT = '86400',

  /**
   * @type {string} prefix to use for tokens
   */
  TOKEN_PREFIX = 'token:'

} = process.env

const getKey = id => `${TOKEN_PREFIX}${id}`

/**
 * Creates or updates a login token with ttl expiry.
 * @param {string} [token] id of token (uuid if not provided).
 * @param {string} userId userId for the token.
 * @throws {BadRequest} if userId not provided.
 * @returns {Promise<*>} resolves to created token.
 */
export const upsert = async (token, userId) => {
  if (!token) { token = uuid.v4() }
  if (!userId) { throw new BadRequest('userId must be provided') }

  const loginToken = {id: token, userId}
  await redis.setex(getKey(token), SESSION_TIMEOUT, JSON.stringify(loginToken))

  return loginToken
}

/**
 * Retrieves a login token.
 * @param {string} token token to fetch.
 * @throws {BadRequest} if token not provided or invalid.
 * @throws {NotFound} if token was not found.
 * @returns {Promise<*>} resolves to fetched token.
 */
export const fetch = async token => {
  if (token == null || typeof token !== 'string' || token.trim() === '') {
    throw new BadRequest('token must be provided')
  }

  let loginToken = await redis.get(getKey(token))
  if (!loginToken) { throw new NotFound() }

  loginToken = JSON.parse(loginToken)
  return upsert(token, loginToken.userId)
}

/**
 * Destroys a login token.
 * @param {string} token token to remove
 * @returns {Promise<bool>} resolves to true
 */
export const destroy = async token => {
  await redis.del(getKey(token))
  return true
}
