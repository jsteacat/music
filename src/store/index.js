import { createStore } from 'vuex';
import {
  getFirestore,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  startAfter,
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
  strict: process.env.NODE_ENV !== 'production',
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
      state.songs = state.songs.concat(payload);
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

    async getSongList({ commit, state }, data) {
      const list = [];
      let snapshots;

      if (!state.songs.length) {
        const first = query(collection(db, 'songs'),
          where('uid', '==', state.user.uid),
          limit(data.limit));

        snapshots = await getDocs(first);
      }

      if (state.songs.length) {
        const docRef = doc(db, 'songs', state.songs[state.songs.length - 1].id);
        const docSnap = await getDoc(docRef);
        const next = query(collection(db, 'songs'),
          where('uid', '==', state.user.uid),
          startAfter(docSnap),
          limit(data.limit));

        snapshots = await getDocs(next);
      }

      snapshots.forEach((item) => {
        list.push({ ...item.data(), id: item.id });
      });
      commit('setSongList', list);
      return list;
    },

    // eslint-disable-next-line no-empty-pattern
    async getSongById({}, id) {
      const songRef = doc(db, 'songs', id);
      const songSnap = await getDoc(songRef);
      return songSnap.data();
    },

    // eslint-disable-next-line no-empty-pattern
    async addComment({}, data) {
      const commentRef = await addDoc(collection(db, 'comments'), {
        ...data,
        author: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      });
      const commentSnap = await getDoc(commentRef);
      return commentSnap.data();
    },

    // eslint-disable-next-line no-empty-pattern
    async getCommentsBySid({}, sid) {
      const resp = query(collection(db, 'comments'), where('sid', '==', sid));
      const snapshots = await getDocs(resp);

      const list = [];
      snapshots.forEach((item) => {
        list.push({ ...item.data() });
      });
      return list;
    },
  },
  modules: {
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
});
