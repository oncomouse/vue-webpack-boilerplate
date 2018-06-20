import Vuex from 'vuex';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import module, { ADD_SAMPLE_DONE, ERROR, RESET } from 'APP/store/modules/samples';
import post from 'TEST/fixtures/post.json';
import { API_URL } from 'APP/api/config';

const NAME_SPACE = 'samples';
const addNameSpace = thing => `${NAME_SPACE}/${thing}`;

describe('store/modules/samples', () => {
  const store = new Vuex.Store({
    modules: {
      [NAME_SPACE]: module,
    },
  });
  const initialState = { ...module.state };
  afterEach(() => {
    // Reset fetchMock:
    fetchMock.reset();
    fetchMock.restore();
    // Reset our vuex store:
    store.state[NAME_SPACE] = { ...initialState };
  });
  // Boilerplate and setup tests:
  it('should initialize a blank array in state.samples', () => {
    expect(store.state[NAME_SPACE].samples).to.have.lengthOf(0);
  });
  it('should initialize a blank array in state.errors', () => {
    expect(store.state[NAME_SPACE].errors).to.have.lengthOf(0);
  });
  // Action tests:
  it('should commit ADD_SAMPLE_DONE when running actions.addSample', () => {
    fetchMock.mock(new RegExp(`${API_URL}/posts/[0-9]+.*$`), JSON.stringify(post), { method: 'get' });
    // Stub commit() so that mutations are not triggered:
    sinon.stub(store, 'commit');

    return store.dispatch(addNameSpace('addSample'))
      .then(() => {
        expect(store.commit).to.be.calledOnce;
        expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(ADD_SAMPLE_DONE));
        expect(store.commit.getCall(0).args[1]).to.equal(post.title);

        store.commit.restore();
      });
  });
  it('should commit ERROR when encountering a 404 error in actions.addSample', () => {
    // Make fetchMock return a 404 error:
    fetchMock.get(new RegExp(`${API_URL}/posts/[0-9]+.*$`), 404);
    // Stub commit() so that mutations are not triggered:
    sinon.stub(store, 'commit');

    return store.dispatch(addNameSpace('addSample'))
      .then(() => {
        expect(store.commit).to.be.calledOnce;
        expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(ERROR));

        store.commit.restore();
      });
  });
  it('should commit RESET when running actions.reset', () => {
    // Stub commit() so that mutations are not triggered:
    sinon.stub(store, 'commit');

    store.dispatch(addNameSpace('reset'));
    expect(store.commit).to.be.calledOnce;
    expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(RESET));

    store.commit.restore();
  });
  // Mutation tests:
  it('should add one element to state.samples.samples when mutations[ADD_SAMPLE_DONE] is called.', () => {
    store.commit(addNameSpace(ADD_SAMPLE_DONE), post.title);
    expect(store.state.samples.samples).to.have.lengthOf(1);
  });
  it('should reset element to state.samples.samples when mutations[RESET] is called.', () => {
    store.state[NAME_SPACE].samples = [
      post.title,
      post.title,
      post.title,
    ];
    store.commit(addNameSpace(RESET));
    expect(store.state.samples.samples).to.have.lengthOf(0);
  });
  it('should add one element to state.samples.errors when mutations[ERROR] is called.', () => {
    store.commit(addNameSpace(ERROR), { message: 'Test Message' });
    expect(store.state.samples.errors).to.have.lengthOf(1);
  });
});
