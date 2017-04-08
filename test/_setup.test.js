'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

global.before(function() {
  chai.should();
  chai.use(chaiAsPromised);
});
