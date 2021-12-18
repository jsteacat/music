import { createStore } from 'vuex';
import {
  getFirestore,
  setDoc,
  addDoc,
  doc,
  collection,
} from 'firebase/firestore';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword as createAccount,
  signInWithEmailAndPassword as signIn,
} from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export default createStore({
  state: {
    authModalShow: false,
    isAuth: false,
    user: null,
    songs: [],
  },
  mutations: {
    toggleAuthModalState: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuthState: (state, payload) => {
      state.isAuth = !state.isAuth;
      if (!state.isAuth && payload.route.meta.requiresAuth) {
        payload.router.push({ name: 'home' });
      }
    },
    setCurrentUser: (state, payload) => {
      state.user = payload;
    },
    addSong: (state, payload) => {
      state.songs.push(payload);
    },
  },
  actions: {
    async initAuth({ commit }) {
      if (auth.currentUser) {
        commit('toggleAuthState');
        commit('setCurrentUser', auth.currentUser);
      }
    },

    async login({ commit }, data) {
      await signIn(auth, data.email, data.password);
      commit('toggleAuthState');
      commit('setCurrentUser', auth.currentUser);
    },

    async register({ commit }, data) {
      const {
        name, email, age, password, country,
      } = data;

      const userCredentials = await createAccount(auth, email, password);

      // create user
      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        name, email, age, country,
      });

      await updateProfile(userCredentials.user, {
        displayName: name,
      });

      commit('toggleAuthState');
      commit('setCurrentUser', auth.currentUser);
    },
    async createSong({ commit }, data) {
      await addDoc(collection(db, 'songs'), data);
      commit('addSong', data);
    },
  },
  modules: {
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
});
