import { shallowMount, createLocalVue } from '@vue/test-utils';
import { always, times } from 'ramda';
import SampleView from 'APP/components/SampleView.vue';

// We will be hooking into a Vuex store, so we need to create a local instance of Vue. Do this any
// time you need to add plugins for a particular test.
const localVue = createLocalVue();

describe('SampleView.vue', () => {
  let wrapper;
  // Initialize our wrapper for each test.
  beforeEach(() => {
    wrapper = shallowMount(SampleView, {
      propsData: {
        samples: [],
      },
    });
  });
  it('should create a <ul/>', () => {
    expect(wrapper.contains('ul')).to.be.true;
  });
  it('should render an empty <ul/> when props.samples is []', () => {
    expect(wrapper.findAll('li')).to.have.lengthOf(0);
  });
  it('should render a number of <li/> === number of samples on props', () => {
    // Generate a random number of strings:
    const samples = times(always('gibberish'), Math.floor(1 + (Math.random() * 25)));
    // Update the wrapper with our list of test data:
    wrapper.setProps({
      samples,
    });
    // When Vue updates the DOM, we can check that the samples rendered correctly:
    return localVue.nextTick()
      .then(() => {
        expect(wrapper.findAll('li')).to.have.lengthOf(samples.length);
      });
  });
});
