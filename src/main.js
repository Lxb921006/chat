import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

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

//复制插件
import VueClipboardPlus from 'vue-clipboard-plus';
Vue.use(VueClipboardPlus);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
