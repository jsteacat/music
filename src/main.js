import { createApp } from 'vue';
import './includes/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidationPlugin from './includes/validation';
import './assets/tailwind.css';
import './assets/main.css';

let app;

onAuthStateChanged(getAuth(), () => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidationPlugin);

    app.mount('#app');
  }
});
