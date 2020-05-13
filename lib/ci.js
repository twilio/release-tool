'use strict';

const travis = require('./travis');
const circleci = require('./circleci');
let ciEnvironment;

function triggerBuild(program) {
  if (ciEnvironment === 'travis') {
    return travis.triggerBuild(program);
  } else if (ciEnvironment === 'circleci') {
    return circleci.triggerBuild(program);
  }
  throw new Error('unsupported CI environment:' + program.ci);
}

function setCIEnvironment(config) {
  // eslint-disable-next-line no-undefined
  if (!config.ci && !config.travis) {
      // no CI environment specified.
      return;
  }

  // old style ci environment?
  if (config.travis) {
    config.ci = 'travis';
  }

  if (!['travis', 'circleci'].includes(config.ci)) {
    throw new Error('only "circleci" or "travis" are valid values for ci. Found: ' + config.ci);
  }

  console.log('Setting ci environment: ', config.ci);
  ciEnvironment = config.ci;
}

module.exports = {
  triggerBuild,
  setCIEnvironment
};

