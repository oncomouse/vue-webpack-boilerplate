const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
require('jsdom-global')();

document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const context = require.context('./test', true, /\.spec\.js$/);
context.keys().forEach(context);

global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;
