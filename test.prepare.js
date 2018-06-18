const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
require('jsdom-global')();

document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>');

chai.use(sinonChai);
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.assert = chai.assert;
global.should = chai.should;
