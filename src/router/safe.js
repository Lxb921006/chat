import router from './index'
import store from "../store/index"

// 当if条件都成立时, next("/index")跳转到index页面, 此时的router.beforeEach并没有结束, 需要调用next()作为跳出出口,否则会发生死循环
router.beforeEach((to, from, next) => {
    let user = sessionStorage.getItem('user');
    if (to.path != '/login' && !user) {
        next('/login');
    } else {
        if (to.path == '/login' && user) {
            next('/index'); 
        } else {
            // 必须调用next(), 否则死循环
            next(); 
        }
    }
});
