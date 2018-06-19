import Vuex from 'vuex';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import module, { ADD_SAMPLE_DONE, ERROR, RESET } from 'APP/store/modules/samples';
import post from 'TEST/fixtures/post.json';
import { API_URL } from 'APP/api/config';

const store = new Vuex.Store({
  modules: {
    samples: module,
  },
});

describe('store/modules/samples', () => {
  const commit = sinon.spy();
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
    commit.resetHistory();
  });
  // Boilerplate and setup tests:
  it('should initialize a blank array in state.samples', () => {
    expect(store.state.samples.samples).to.have.lengthOf(0);
  });
  it('should initialize a blank array in state.errors', () => {
    expect(store.state.samples.errors).to.have.lengthOf(0);
  });
  // Action tests:
  it('should commit ADD_SAMPLE_DONE when running actions.addSample', () => {
    fetchMock.mock(new RegExp(`${API_URL}/posts/[0-9]+.*$`), JSON.stringify(post), { method: 'get' });
    return module.actions.addSample({ commit })
      .then(() => {
        expect(commit).to.be.calledOnce;
        expect(commit.getCall(0).args[0]).to.equal(ADD_SAMPLE_DONE);
        expect(commit.getCall(0).args[1]).to.equal(post.title);
      });
  });
  it('should commit ERROR when encountering a 404 error in actions.addSample', () => {
    fetchMock.get(new RegExp(`${API_URL}/posts/[0-9]+.*$`), 404, { overwriteRoutes: true });
    return module.actions.addSample({ commit })
      .then(() => {
        expect(commit).to.be.calledOnce;
        expect(commit.getCall(0).args[0]).to.equal(ERROR);
      });
  });
  it('should commit RESET when running actions.reset', () => {
    module.actions.reset({ commit });
    expect(commit).to.be.calledOnce;
    expect(commit.getCall(0).args[0]).to.equal(RESET);
  });
  // Mutation tests:
  it('should add one element to state.samples.samples when mutations[ADD_SAMPLE_DONE] is called.', () => {
    const state = { ...module.state };
    module.mutations[ADD_SAMPLE_DONE](state, post.title);
    expect(state.samples).to.have.lengthOf(1);
  });
  it('should reset element to state.samples.samples when mutations[RESET] is called.', () => {
    const state = {
      samples: [
        post.title,
        post.title,
        post.title,
      ],
    };
    module.mutations[RESET](state);
    expect(state.samples).to.have.lengthOf(0);
  });
  it('should add one element to state.samples.errors when mutations[ERROR] is called.', () => {
    const state = {
      errors: [],
    };
    module.mutations[ERROR](state, { message: 'Test Message' });
    expect(state.errors).to.have.lengthOf(1);
  });
});
