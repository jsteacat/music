import { createStore } from 'vuex';
import {
  add, auth, createUser, usersCollection,
} from '../includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    isAuth: false,
  },
  mutations: {
    toggleAuthModalState: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuthState: (state) => {
      state.isAuth = !state.isAuth;
    },
  },
  actions: {
    async register({ commit }, data) {
      try {
        const {
          name, email, age, password, country,
        } = data;
        await createUser(auth, email, password);
        await add(usersCollection, {
          name, email, age, country,
        });
        commit('toggleAuthState');
      } catch (e) {
        console.log(e);
      }
    },
  },
  modules: {
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
});
