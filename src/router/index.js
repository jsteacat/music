import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/manage-music',
    name: 'manage',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "manage" */ '../views/Manage.vue'),
    beforeEnter: (to, from, next) => {
      console.log(to, from);
      next();
    },
  },
  {
    path: '/song/:id',
    name: 'song',
    component: () => import(/* webpackChunkName: "about" */ '../views/Song.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.isAuth) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
