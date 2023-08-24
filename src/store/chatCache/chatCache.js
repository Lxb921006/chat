
import createPersistedState from 'vuex-persistedstate'

const chatCache = {
  namespace: true,
  state: {
    editableTabs: [],
  },
  getters: {
    UPDATE_CHAT_CACHE(state) {
    }
  },
  mutations: {
    ADD_CHAT_CACHE(state, data){
      // 原始
      state.editableTabs.push(data);
      localStorage.setItem("chatCache", JSON.stringify(state.editableTabs));
    },
    REMOVE_CHAT_CACHE(state, data) {
      state.editableTabs = data;
      localStorage.setItem("chatCache", JSON.stringify(data));
    },
    CLEAR_CHAT_CACHE(state, data) {
      state.editableTabs = [];
    },
    GET_CHAT_CACHE(state, data) {
      let reg = new RegExp(data);
      let cd = state.editableTabs;
      let newChat = cd.filter(cd => {
        if (cd.title.match(reg) || cd.model.match(data)) {
          return cd
        }
      });
      state.editableTabs = newChat;
    },
    SAVE_CHAT_CACHE_ANSWER(state, data) {
        let chatData = localStorage.getItem("chatCache");
        let fcd = JSON.parse(chatData);
        for (let i = 0;i < fcd.length; i++) {
            if (fcd[i].id == data.id) {
                let lfcd = fcd[i];
                lfcd['answer'] = data['answer'];
                lfcd['cursor'] = false;
                lfcd['timeShow'] = true;
                lfcd['pid'] = data['pid'];
                lfcd['cid'] = data['cid'];
                lfcd['content'] = data['content'];
                lfcd['file'] = data['file'];
                break
            }
        }
        state.editableTabs = fcd;
        let jd = JSON.stringify(fcd);
        localStorage.setItem("chatCache", jd);
    }
  },
  actions: {},
  plugins: [createPersistedState({
    key: 'chatLocalStorage',
    storage: window.localStorage,
    paths: ['editableTabs']
  })],
};

export default chatCache

