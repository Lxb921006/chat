
import createPersistedState from 'vuex-persistedstate'

const chatRecycle = {
  namespace: true,
  state: {
    editableTabsZ: [],
  },
  getters: {
    Z_UPDATE_CHAT_CACHE(state) {
    }
  },
  mutations: {
    Z_ADD_CHAT_CACHE(state, data){
      // 原始
      state.editableTabsZ.push(data);
      sessionStorage.setItem("chatRecycle", JSON.stringify(state.editableTabsZ));
    },
    Z_REMOVE_CHAT_CACHE(state, data) {
      state.editableTabsZ = data;
      sessionStorage.setItem("chatRecycle", JSON.stringify(state.editableTabsZ));
    },
    Z_REMOVE_ALL_CHAT_CACHE(state, data) {
      state.editableTabsZ = [];
      sessionStorage.setItem("chatRecycle", JSON.stringify(state.editableTabsZ));
    },
    Z_CLEAR_CHAT_CACHE(state, data) {
      state.editableTabsZ = [];
    },
    Z_GET_CHAT_CACHE(state, data) {
      let reg = new RegExp(data);
      let cd = state.editableTabsZ;
      let newChat = cd.filter(cd => {
        if (cd.title.match(reg) || cd.model.match(data)) {
          return cd
        }
      });
      state.editableTabsZ = newChat;
    },
  },
  actions: {},
};

export default chatRecycle

