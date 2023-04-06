import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
//路由守卫, 访问入口
import './router/safe'

// element-ui
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import { Button } from 'element-ui'
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

import VuePageTransition from 'vue-page-transition'

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
Vue.use(VuePageTransition);

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
