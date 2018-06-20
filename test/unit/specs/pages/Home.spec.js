import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';
import Home from 'APP/pages/Home.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Home.vue', () => {
  let wrapper;
  let store;
  let actions;
  let state;
  beforeEach(() => {
    actions = {
      addSample: sinon.spy(),
      reset: sinon.spy(),
    };
    state = {
      samples: [],
    };
    store = new Vuex.Store({
      modules: {
        samples: {
          state,
          actions,
          namespaced: true,
        },
      },
    });
    wrapper = shallowMount(Home, { store, localVue });
  });
  // We need to test our event listeners (even though they just wrap other
  // functions) for code coverage purposes.
  it('should trigger addSample() when first <button/> is clicked', () => {
    wrapper.vm.addSampleEvent();
    return localVue.nextTick()
      .then(() => {
        expect(actions.addSample).to.be.calledOnce;
      });
  });
  it('should trigger reset() when second <button/> is clicked', () => {
    wrapper.vm.resetEvent();
    return localVue.nextTick()
      .then(() => {
        expect(actions.reset).to.be.calledOnce;
      });
  });
});
