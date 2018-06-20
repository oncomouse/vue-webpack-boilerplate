import Vuex from 'vuex';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import module, { ADD_SAMPLE_DONE, ERROR, RESET } from 'APP/store/modules/samples';
import post from 'TEST/fixtures/post.json';
import { API_URL } from 'APP/api/config';

describe('store/modules/samples', () => {
  // We use a spy for a commit method when testing actions, instead of the full
  // store, because we don't want to trigger our mutations during action tests.
  const commit = sinon.spy();
  // Store is used for testing mutations:
  const store = new Vuex.Store({
    modules: {
      samples: module,
    },
  });
  const initialState = { ...module.state };
  afterEach(() => {
    // Reset fetchMock:
    fetchMock.reset();
    fetchMock.restore();
    // Reset our spy:
    commit.resetHistory();
    // Reset our vuex store:
    store.state.samples = { ...initialState };
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
    // Make fetchMock return a 404 error:
    fetchMock.get(new RegExp(`${API_URL}/posts/[0-9]+.*$`), 404);
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
    module.mutations[ADD_SAMPLE_DONE](store.state.samples, post.title);
    expect(store.state.samples.samples).to.have.lengthOf(1);
  });
  it('should reset element to state.samples.samples when mutations[RESET] is called.', () => {
    store.state.samples.samples = [
      post.title,
      post.title,
      post.title,
    ];
    module.mutations[RESET](store.state.samples);
    expect(store.state.samples.samples).to.have.lengthOf(0);
  });
  it('should add one element to state.samples.errors when mutations[ERROR] is called.', () => {
    module.mutations[ERROR](store.state.samples, { message: 'Test Message' });
    expect(store.state.samples.errors).to.have.lengthOf(1);
  });
});
