import router from './index'
import store from "../store/index"

router.beforeEach((to, from, next) => {
    let user = sessionStorage.getItem('user');
    if (to.path != '/login' && !user) {
        next('/login');
    } else {
        if (to.path == '/login' && user) {
            next('/index');
        } else {
            next();
        }
    }
});
