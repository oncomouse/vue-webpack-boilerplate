import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import Button from 'APP/components/Button.vue';

describe('Button.vue', () => {
  let wrapper;
  const action = sinon.spy();
  beforeEach(() => {
    wrapper = shallowMount(Button, {
      propsData: {
        action,
      },
      slots: {
        default: ['Click Me'],
      },
    });
  });
  afterEach(() => {
    action.resetHistory();
  });
  it('should render a button', () => {
    expect(wrapper.contains('button')).to.be.true;
  });
  it('should render a button containing "Click Me"', () => {
    expect(wrapper.find('button').text()).to.equal('Click Me');
  });
  it('should respond to a click', () => {
    wrapper.find('button').trigger('click');
    expect(action).calledOnce;
  });
});
