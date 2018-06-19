import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';
import Home from '../../../../app/pages/Home.vue';

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
    wrapper = mount(Home, { store, localVue });
  });
  it('should trigger addSample() when first <button/> is clicked', () => {
    wrapper.findAll('button').at(0).trigger('click');
    return localVue.nextTick()
      .then(() => {
        expect(actions.addSample).to.be.calledOnce;
      });
  });
  it('should trigger reset() when second <button/> is clicked', () => {
    wrapper.findAll('button').at(1).trigger('click');
    return localVue.nextTick()
      .then(() => {
        expect(actions.reset).to.be.calledOnce;
      });
  });
});
