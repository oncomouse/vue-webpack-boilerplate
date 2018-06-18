import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default function createRouter() {
  return new Router({
    mode: 'hash',
    routes: [
      { path: '/', component: () => import('../pages/Home.vue') },
    ],
  });
}
