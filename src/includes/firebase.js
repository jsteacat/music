import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAfqu9q_5bPXrLvpHcGaB-9Euhvkrb8bZA',
  authDomain: 'music-c62a0.firebaseapp.com',
  projectId: 'music-c62a0',
  storageBucket: 'music-c62a0.appspot.com',
  appId: '1:776617436757:web:77541e3cab345e63dd56dc',
};

// Initialize Firebase
export default initializeApp(firebaseConfig);

export const fsDB = getFirestore();
export const auth = getAuth();
export const createUser = createUserWithEmailAndPassword;
export const signIn = signInWithEmailAndPassword;
export const usersCollection = collection(fsDB, 'users');
export const add = addDoc;
export const getCollection = getDocs;
