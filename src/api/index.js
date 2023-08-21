import { get, post, loginPost } from '../utils/http'

export const gaLogin = (params, query, method) => loginPost('/login/', params, query, method);