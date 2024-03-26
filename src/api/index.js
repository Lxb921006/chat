import { get, post, loginPost } from '../utils/http'

export const gaLogin = (params, query, method) => loginPost('/vvv/login/', params, query, method);
export const chatList = (params, query, method) => get(`/vvv/chat/list/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const chatSave = (params, query, method) => post(`/vvv/chat/save/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const chatDel = (params, query, method) => post(`/vvv/chat/del/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const chatUpdate = (params, query, method) => post(`/vvv/chat/update/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const getFileText = (params, query, method) => get(`/vvv/claude/text/?user=${sessionStorage.getItem('user')}`, params, query, method);
export const downloadFile = (params, query, method) => get('/vvv/claude/download/', params, query, method);