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
        state.editableTabs = data;
        sessionStorage.setItem("chatCache", JSON.stringify(data));
    },
    REMOVE_CHAT_CACHE(state, data) {
        state.editableTabs = data;
        sessionStorage.setItem("chatCache", JSON.stringify(data));
    },
    SAVE_CHAT_CACHE_ANSWER(state, data) {
        let chatData = sessionStorage.getItem("chatCache");
        let fcd = JSON.parse(chatData);
        for (let i = 0;i < fcd.length; i++) {
            if (fcd[i].id == data.id) {
                let lfcd = fcd[i];
                lfcd['answer'] = data['answer'];
                break
            }
        }
        let jd = JSON.stringify(fcd);
        sessionStorage.setItem("chatCache", jd);
    }
  },
  actions: {}
};

export default chatCache

