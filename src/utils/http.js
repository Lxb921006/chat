import axios from 'axios'
import baseUrl from './baseUrl'
import { Message } from 'element-ui'


// 创建axios实例
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
//   responseType: 'json',
});

instance.interceptors.request.use(config => {
    // 请求拦截逻辑写在这里

    return Promise.resolve(config)
}, error => {

    return Promise.reject(error)
});

// var p1 = ()=> new Promise((resolve, reject) => setTimeout(()=>resolve(11122), 1000))
// 定义了一个p1无参函数, 返回值是promise对象
// 直接new Promise里边的函数会立即执行，所以需要调用时候才执行，只能把new Promise当做函数返回值

instance.interceptors.response.use(resp => {
    // 响应拦截逻辑写在这里

    return Promise.resolve(resp) // 异步调用方式将回调函数作为函数参数返回
}, err => {
    
    switch (err.response.status) {
        case 400:
            Message.error(err.response.data.message);
            break
        case 403:
            Message.error(err.response.data.message);
            break
        case 500:
            Message.error(err.response.data.message);
            break
        case 502:
            Message.error(err.response.data.message+" 3秒后将跳转到登录页!");
            setTimeout(()=>{
                sessionStorage.clear();
                window.location.href = '/';
                ;},3000)
            break
    }
    return Promise.reject(err)
});

// 背景，当需要执行一个耗时任务时，通常使用的是异步方式，这样就可以继续执行后面的任务而不被耗时任务阻塞，通常使用的是回调函数的形式来通知你耗时任务已经完成，避免的程序的阻塞
// promise是一个对象, 代表了一个异步操作的最终结果（完成或者失败），promise的出现也正是为了解决多个异步任务顺序执行造成的回调地狱，导致代码可读性非常差
// 本质上promise是一个函数返回的对象, 可以把回调函数绑定到它上面
// 这样就不需要一开始就把回调函数作为参数传入函数
export const get = (url, params) => {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params
        }).then(resp => {
            resolve(resp);
        }).catch(error => {
            reject(error);
        })
    })
};
  
export const post = (url, data, method) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data).then(resp => {
            method.call(); // 不知道当初为啥要传入一个method
            
            resolve(resp);
        }).catch(error => {
            reject(error);
        })
    })
};


export const loginPost = (url, data, other, method) => {
    return new Promise((resolve, reject) => {
        instance.post(url + "?user="+other, data).then(resp => {
            method.call();
            resolve(resp);
        }).catch(error => {
            Message.error(error+":无法连接服务器");
            reject(error);
        })
    })
};
