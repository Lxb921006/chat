

const chatCache = {
  namespace: true,
  state: {
    imgList: [],
  },
  getters: {
    UPDATE_IMG_CACHE(state) {

    }
  },
  mutations: {
    ADD_IMG_CACHE(state, data){
        state.imgList = data;
        sessionStorage.setItem("imgList", JSON.stringify(data));
    },
    REMOVE_IMG_CACHE(state, data) {
        state.imgList = data;
        sessionStorage.setItem("imgList", JSON.stringify(data));
    },
    SAVE_IMG_CACHE(state, data) {
      let imgData = sessionStorage.getItem("imgList");
        let fcd = JSON.parse(imgData);
        for (let i = 0;i < fcd.length; i++) {
            if (fcd[i].id == data.id) {
                let lfcd = fcd[i];
                lfcd['answer'] = data['answer'];
                break
            }
        }
        let jd = JSON.stringify(fcd);
        sessionStorage.setItem("imgList", jd);
    }
  },
  actions: {}
};

export default chatCache

