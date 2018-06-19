import { append } from 'ramda';
import PostAPI from '../../api/Post';

const MAX_POSTS = 99;

export const ADD_SAMPLE_DONE = 'ADD_SAMPLE_DONE';
export const ERROR = 'ERROR';
export const RESET = 'RESET';

const initialState = {
  samples: [],
  errors: [],
};
const actions = {
  addSample: ({ commit }) => {
    const randomPostID = 1 + Math.floor(Math.random() * MAX_POSTS);
    return PostAPI.get(randomPostID)
      .then(results => commit(ADD_SAMPLE_DONE, results.entities.posts[results.result].title))
      .catch(error => commit(ERROR, error));
  },
  reset: ({ commit }) => commit(RESET),
};
const mutations = {
  [ERROR]: (state, error) => {
    state.errors = append(error, state.errors);
  },
  [ADD_SAMPLE_DONE]: (state, sample) => {
    state.samples = append(sample, state.samples);
  },
  [RESET]: (state) => {
    state.samples = [];
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
