import { createStore } from 'vuex';
import {
  getFirestore,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
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
      state.songs.unshift(payload);
    },

    editSong: (state, payload) => {
      const { modifiedName, genre, id } = payload;
      const index = state.songs.findIndex((song) => song.id === id);

      if (index !== -1) {
        state.songs[index] = { ...state.songs[index], modifiedName, genre };
      }
    },

    removeSong: (state, id) => {
      state.songs = state.songs.filter((song) => song.id !== id);
    },

    setSongList: (state, payload) => {
      state.songs = payload;
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
      const songRef = await addDoc(collection(db, 'songs'), data);
      commit('addSong', { ...data, id: songRef.id });
    },

    async editSong({ commit }, data) {
      const { modifiedName, genre, id } = data;
      const songRef = doc(db, 'songs', id);

      await updateDoc(songRef, { modifiedName, genre });
      commit('editSong', data);
    },

    async removeSong({ commit }, id) {
      const songRef = doc(db, 'songs', id);

      await deleteDoc(songRef);
      commit('removeSong', id);
    },

    async getSongList({ commit, state }) {
      const list = [];
      const snapshot = await getDocs(query(collection(db, 'songs'), where('uid', '==', state.user.uid)));
      snapshot.forEach((item) => {
        list.push({ ...item.data(), id: item.id });
      });
      commit('setSongList', list);
      return list;
    },
  },
  modules: {
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
});
