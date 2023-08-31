import { get, post, loginPost } from '../utils/http'

export const gaLogin = (params, query, method) => loginPost('/login/', params, query, method);
export const chatList = (params, query, method) => get(`/chat/list/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const chatSave = (params, query, method) => post(`/chat/save/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const getFileText = (params, query, method) => get(`/claude/text/?user=${sessionStorage.getItem('user')}`, params, query, method);