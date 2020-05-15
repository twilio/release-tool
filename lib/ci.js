/* eslint-disable no-console */
'use strict';

const travis = require('./travis');
const circleci = require('./circleci');
let ciEnvironment;

function triggerBuild(program) {
  if (ciEnvironment === 'travis' || ciEnvironment === 'travis-pro') {
    return travis.triggerBuild(program);
  } else if (ciEnvironment === 'circleci') {
    return circleci.triggerBuild(program);
  }
  throw new Error('unsupported CI environment:' + program.ci);
}

function setCIEnvironment(config) {
  // eslint-disable-next-line no-undefined
  if (!config.ci) {
      // no CI environment specified.
      return;
  }

  if (!['travis', 'circleci', 'travis-pro'].includes(config.ci)) {
    throw new Error('only "circleci" or "travis" or "travis-pro" are valid values for ci. Found: ' + config.ci);
  }

  console.log('Setting ci environment: ', config.ci);
  ciEnvironment = config.ci;
}

module.exports = {
  triggerBuild,
  setCIEnvironment
};

