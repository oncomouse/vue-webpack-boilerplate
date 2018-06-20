import { shallowMount, createLocalVue } from '@vue/test-utils';
import { always, times } from 'ramda';
import Samples from 'APP/components/Samples.vue';

const localVue = createLocalVue();

describe('Samples.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Samples, {
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
    wrapper.setProps({
      samples,
    });
    return localVue.nextTick()
      .then(() => {
        expect(wrapper.findAll('li')).to.have.lengthOf(samples.length);
      });
  });
});
