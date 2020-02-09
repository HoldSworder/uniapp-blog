import Cookie from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookie.get(TokenKey)
}

export function setToken(token) {
  return Cookie.set(TokenKey, token)
}

export function delToken() {
  return Cookie.remove(TokenKey)
}