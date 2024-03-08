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
import { Button, Popover, Upload } from 'element-ui'
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
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Popconfirm } from 'element-ui'
import { Loading } from 'element-ui';
import { Dialog } from 'element-ui';
import { Checkbox } from 'element-ui';
import { Badge } from 'element-ui';
import { RadioGroup } from 'element-ui';
import { Radio } from 'element-ui';
// import { Collapse } from 'element-ui';
// import { CollapseItem } from 'element-ui';
import VuePageTransition from 'vue-page-transition'


// Vue.use(Collapse);
// Vue.use(CollapseItem);
Vue.use(Checkbox);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Badge);
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
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popconfirm);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Loading);

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
