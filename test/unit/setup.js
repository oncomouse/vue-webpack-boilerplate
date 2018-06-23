const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>');

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;

const context = require.context('./', true, /\.spec\.js$/);
context.keys().forEach(context);

const srcContext = require.context('../../app', true, /\.(?:vue|js)$/);
srcContext.keys().forEach(srcContext);
