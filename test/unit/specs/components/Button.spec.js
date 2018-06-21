import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import Button from 'APP/components/Button.vue';

describe('Button.vue', () => {
  let wrapper;
  // Create a spy for a button action:
  const action = sinon.spy();
  beforeEach(() => {
    // Re-render the button each test:
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
    // Reset button action's history each test:
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
