/* eslint-disable camelcase */
/* eslint-disable no-console */
'use strict';

const http = require('https');
const ui = require('./ui');

function triggerBuild(program) {
  return new Promise(function triggerBuildPromise(resolve, reject) {
    const {
      slug,
      token,
      branch,
      currentVersion,
      publish,
      releaseVersion,
      developmentVersion
    } = program;

    const options = {
      hostname: 'circleci.com',
      path: `/api/v2/project/github/${slug}/pipeline`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(token).toString('base64'),
        'Accept': 'application/json',
        'Host': 'circleci.com',
      }
    };

    const release_command = './node_modules/.bin/release -n -x'
      + ` -b ${branch}`
      + ` ${publish ? '-p' : ''}`
      + ` ${currentVersion}`
      + ` ${releaseVersion}`
      + ` ${developmentVersion ?  developmentVersion : ''}`;

    const body = {
      branch: program.branch,
      parameters: {
        release_workflow: false,
        release_command
      }
    };

    console.log('Making a CI request with:', options, body);
    const confirmPromise = program.nonInteractive ?
      Promise.resolve(true)
      : ui.confirm('Is this OK?', false);

    return confirmPromise.then(function withAnswer(answer) {
      if (!answer) {
        throw new Error('User aborted release');
      }
      const request = http.request(options, function(res) {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const resBody = Buffer.concat(chunks);
          resolve(resBody.toString());
        });
      });

      request.once('error', reject);
      request.end(JSON.stringify(body));
    });
  });
}


module.exports.triggerBuild = triggerBuild;
