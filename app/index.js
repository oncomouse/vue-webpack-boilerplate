import Vue from 'vue';
import createRouter from './router';
import createStore from './store';
import App from './App.vue';

const router = createRouter();
const store = createStore();
const app = new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
});
router.onReady(() => {
  app.$mount('#root');
});
