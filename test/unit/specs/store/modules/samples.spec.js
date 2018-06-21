import Vuex from 'vuex';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import module, { ADD_SAMPLE_DONE, ERROR, RESET } from 'APP/store/modules/samples';
import post from 'TEST/fixtures/post.json';
import { API_URL } from 'APP/api/config';

// We end up accessing store.state.samples a lot in these tests. It seemed like a good idea to DRY
// it with a single method here. This way, if namespace changes for any reason, it's one line to
// fix:
const NAME_SPACE = 'samples';
const addNameSpace = thing => `${NAME_SPACE}/${thing}`;

describe('store/modules/samples', () => {
  // Generate our store:
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
  // First, we want to test that all of our actions are calling commit with the correct parameters.
  // In each test, we stub store.commit(), so that the store does not actually update. Then, we
  // check that commit was called with the expected parameters. We will test the mutations
  // themselves later.
  //
  // This may seem excessive, but given that some our actions may produce side-effects, we want to
  // make sure that those side effects are working properly.
  it('should commit ADD_SAMPLE_DONE when running actions.addSample', () => {
    fetchMock.mock(new RegExp(`${API_URL}/posts/[0-9]+.*$`), JSON.stringify(post), { method: 'get' });
    // Stub commit() so that mutations are not triggered:
    sinon.stub(store, 'commit');

    // Dispatch our action:
    return store.dispatch(addNameSpace('addSample'))
      .then(() => {
        expect(store.commit).to.be.calledOnce;
        // Does the first argument match the symbol we defined + the namespace:
        expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(ADD_SAMPLE_DONE));
        expect(store.commit.getCall(0).args[1]).to.equal(post.title);

        // Restore the stubbed commit method:
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
        // Does the first argument match the symbol we defined + the namespace:
        expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(ERROR));

        // Restore the stubbed commit method:
        store.commit.restore();
      });
  });
  it('should commit RESET when running actions.reset', () => {
    // Stub commit() so that mutations are not triggered:
    sinon.stub(store, 'commit');

    store.dispatch(addNameSpace('reset'));
    expect(store.commit).to.be.calledOnce;
    // Does the first argument match the symbol we defined + the namespace:
    expect(store.commit.getCall(0).args[0]).to.equal(addNameSpace(RESET));

    // Restore the stubbed commit method:
    store.commit.restore();
  });
  // Mutation tests:
  // After we tested that our actions are calling commit with the correct data, we now test that
  // commit actually updates the store in the way we expect it to.
  it('should add one element to state.samples.samples when mutations[ADD_SAMPLE_DONE] is called.', () => {
    store.commit(addNameSpace(ADD_SAMPLE_DONE), post.title);
    expect(store.state.samples.samples).to.have.lengthOf(1);
    expect(store.state.samples.samples[0]).to.equal(post.title);
  });
  it('should reset element to state.samples.samples when mutations[RESET] is called.', () => {
    // Add some test data:
    store.state[NAME_SPACE].samples = [
      post.title,
      post.title,
      post.title,
    ];
    // Trigger a RESET commit:
    store.commit(addNameSpace(RESET));
    // State should now be empty:
    expect(store.state[NAME_SPACE].samples).to.have.lengthOf(0);
  });
  it('should add one element to state.samples.errors when mutations[ERROR] is called.', () => {
    const testError = { message: 'Test Message' };
    store.commit(addNameSpace(ERROR), testError);
    expect(store.state[NAME_SPACE].errors).to.have.lengthOf(1);
    expect(store.state[NAME_SPACE].errors[0]).to.deep.equal(testError);
  });
});
