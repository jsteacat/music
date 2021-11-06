import { createStore } from 'vuex';
import {
  getFirestore,
  setDoc,
  doc,
} from 'firebase/firestore';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword as createAccount,
  signInWithEmailAndPassword as signIn,
  onAuthStateChanged,
} from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

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
    async initAuth({ commit }) {
      onAuthStateChanged(auth, (user) => {
        console.log('!!!!', user);
        if (user) commit('toggleAuthState');
        else commit('toggleAuthModalState');
      });
    },

    async login({ commit }, data) {
      await signIn(auth, data.email, data.password);
      commit('toggleAuthState');
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
    },
  },
  modules: {
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
});
