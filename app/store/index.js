import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import modules from './modules';

Vue.use(Vuex);

const createStore = () => {
  const store = new Vuex.Store({
    modules,
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  });
  if (module.hot) {
  // accept actions and mutations as hot modules
    module.hot.accept(['./modules'], () => {
      // require the updated modules
      // have to add .default here due to babel 6 module output
      import('./modules').then((newModules) => {
        // swap in the new actions and mutations
        store.hotUpdate({
          modules: newModules,
        });
      });
    });
  }
  return store;
};

export default createStore;
