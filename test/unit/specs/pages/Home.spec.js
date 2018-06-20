import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';
import Home from 'APP/pages/Home.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Home.vue', () => {
  let wrapper;
  const initialState = {
    samples: [],
    errors: [],
  };
  const addSample = sinon.spy();
  const reset = sinon.spy();
  const store = new Vuex.Store({
    modules: {
      samples: {
        state: { ...initialState },
        actions: {
          addSample,
          reset,
        },
        namespaced: true,
      },
    },
  });
  afterEach(() => {
    // Reset spies:
    reset.resetHistory();
    addSample.resetHistory();
    // Reset state:
    store.state.samples = { ...initialState };
  });
  beforeEach(() => {
    wrapper = shallowMount(Home, { store, localVue });
  });
  // We need to test our event listeners (even though they just wrap other
  // functions) for code coverage purposes.
  it('should trigger addSample() when first <button/> is clicked', () => {
    wrapper.vm.addSampleEvent();
    return localVue.nextTick()
      .then(() => {
        expect(addSample).to.be.calledOnce;
      });
  });
  it('should trigger reset() when second <button/> is clicked', () => {
    wrapper.vm.resetEvent();
    return localVue.nextTick()
      .then(() => {
        expect(reset).to.be.calledOnce;
      });
  });
});
