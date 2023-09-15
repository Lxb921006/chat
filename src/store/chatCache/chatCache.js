
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
      sessionStorage.setItem("chatCache", JSON.stringify(state.editableTabs));
    },
    REMOVE_CHAT_CACHE(state, data) {
      state.editableTabs = data;
      sessionStorage.setItem("chatCache", JSON.stringify(data));
    },
    CLEAR_CHAT_CACHE(state, data) {
      state.editableTabs = [];
      // sessionStorage.setItem("chatCache", JSON.stringify(state.editableTabs));
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
        let chatData = sessionStorage.getItem("chatCache");
        let fcd = JSON.parse(chatData);
        for (let i = 0;i < fcd.length; i++) {
            if (fcd[i].uuid == data.uuid) {
                let lfcd = fcd[i];
                lfcd['answer'] = data['answer'];
                lfcd['cursor'] = false;
                lfcd['timeShow'] = true;
                lfcd['pid'] = data['pid'];
                lfcd['cid'] = data['cid'];
                lfcd['content'] = data['content'];
                lfcd['date'] = data['date'];
                lfcd['file'] = data['file'];
                break
            }
        }
        state.editableTabs = fcd;
        let jd = JSON.stringify(fcd);
        sessionStorage.setItem("chatCache", jd);
    }
  },
  actions: {},
};

export default chatCache

