import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';
import Home from 'APP/pages/Home.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

// If you read through it, this test is really strange. We don't appear to be doing very much
// (because we aren't). However, to get code coverage to 100%, we need to make sure that our event
// handlers are working, so that's what we do. When Home.vue gets more complex, we might write more
// robust tests here.
describe('Home.vue', () => {
  let wrapper;
  // We define a limited version of our store here, b/c we are not testing our module in this suite.
  const initialState = {
    samples: [],
    errors: [],
  };
  // Define our two actions as spies:
  const addSample = sinon.spy();
  const reset = sinon.spy();
  // Dummy store:
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
    // Mount home:
    wrapper = shallowMount(Home, { store, localVue });
  });
  it('should trigger addSample() when first <button/> is clicked', () => {
    // Trigger the event:
    wrapper.vm.addSampleEvent();
    // When Vue updates, make sure that the appropriate action was called:
    return localVue.nextTick()
      .then(() => {
        expect(addSample).to.be.calledOnce;
      });
  });
  it('should trigger reset() when second <button/> is clicked', () => {
    // Trigger the event:
    wrapper.vm.resetEvent();
    // When Vue updates, make sure that the appropriate action was called:
    return localVue.nextTick()
      .then(() => {
        expect(reset).to.be.calledOnce;
      });
  });
});
