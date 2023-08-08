import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
//路由守卫, 访问入口
// import './router/safe'

// element-ui
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import { Button, Popover } from 'element-ui'
import { Input } from 'element-ui'
import { Divider } from 'element-ui'
import { Tabs } from 'element-ui'
import { TabPane } from 'element-ui'
import { Tag } from 'element-ui'
import { Menu } from 'element-ui'
import { Submenu } from 'element-ui'
import { MenuItem } from 'element-ui'
import { Tooltip } from 'element-ui'
import { Card } from 'element-ui'
import { Row } from 'element-ui'
import { Col } from 'element-ui'
import { Image } from 'element-ui'
import { Select } from 'element-ui'
import { Option } from 'element-ui'
import { Link } from 'element-ui'
import { Dropdown } from 'element-ui'
import { DropdownMenu } from 'element-ui'
import { DropdownItem } from 'element-ui'
import { Switch } from 'element-ui'
import VueScrollTo from 'vue-scrollto';

import VuePageTransition from 'vue-page-transition'
import smoothscroll from 'smoothscroll-polyfill';

Vue.use(Button);
Vue.use(Input);
Vue.use(Divider);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Tooltip);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Image);
Vue.use(Select);
Vue.use(Option);
Vue.use(Link);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Popover);
Vue.use(Switch);
Vue.use(VuePageTransition);

let scrollOptions = {
  container: "body", //滚动的容器
  duration: 500, //滚动时间
  easing: "ease", //缓动类型
  offset: -50, // 滚动时应应用的偏移量。此选项接受回调函数
  force: true, // 是否应执行滚动
  cancelable: true, // 用户是否可以取消滚动
  onStart: false, // 滚动开始时的钩子函数
  onDone: false, // 滚动结束时候的钩子函数
  onCancel: false, // 用户取消滚动的钩子函数
  x: false, // 是否要在x轴上也滚动
  y: true    // 是否要在y轴上滚动
};
Vue.use(VueScrollTo, scrollOptions);

smoothscroll.polyfill();

//复制插件
import VueClipboardPlus from 'vue-clipboard-plus';
Vue.use(VueClipboardPlus);


Vue.config.productionTip = false

new Vue({
  mode: 'history',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
