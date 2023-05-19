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
      state.editableTabs.push(data);
      sessionStorage.setItem("chatCache", JSON.stringify(state.editableTabs));
    },
    REMOVE_CHAT_CACHE(state, data) {
      state.editableTabs = data;
      sessionStorage.setItem("chatCache", JSON.stringify(data));
    },
    CLEAR_CHAT_CACHE(state, data) {
      state.editableTabs = [];
    },
    GET_CHAT_CACHE(state, data) {
      let filterData = [];
      let reg = new RegExp(data);
      let cd = state.editableTabs;
      for (let i = 0;i < cd.length; i++) {

      }
      let newChat = cd.filter(cd => cd.title.match(reg));
      state.editableTabs = newChat;
    },
    SAVE_CHAT_CACHE_ANSWER(state, data) {
        let chatData = sessionStorage.getItem("chatCache");
        let fcd = JSON.parse(chatData);
        for (let i = 0;i < fcd.length; i++) {
            if (fcd[i].id == data.id) {
                let lfcd = fcd[i];
                lfcd['answer'] = data['answer'];
                lfcd['cursor'] = false;
                lfcd['timeShow'] = true;
                break
            }
        }
        state.editableTabs = fcd;
        let jd = JSON.stringify(fcd);

        sessionStorage.setItem("chatCache", jd);
    }
  },
  actions: {}
};

export default chatCache

