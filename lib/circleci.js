'use strict';
// 'NzY1ZmViOWM5Yzg4ZDdkZGI5N2U4Yzg4ZWFiOGFmMjUzM2YzOGI3NDo='
var http = require('https');
function triggerBuild(program) {
  return new Promise(function triggerBuildPromise(resolve, reject) {
    var options = {
      hostname: 'circleci.com',
      path: '/api/v2/project/github/' + encodeURIComponent(program.slug) + '/pipeline',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + program.token,
        'Accept': 'application/json',
        'Host': 'circleci.com',
      }
    };

    const releaseCommand = './node_modules/.bin/release -b ' + program.branch +
        ' -n' +
        (program.publish ? ' -p' : '') +
        ' -x ' +
        program.currentVersion + ' ' +
        program.releaseVersion +
        (program.developmentVersion ? ' ' + program.developmentVersion : '');

    const body = {
      branch: program.branch,
      parameters: {
        // eslint-disable-next-line camelcase
        run_release_steps: true,
        stability: 'stable',
        releaseCommand
      }
    };

    const request = http.request(options, function(res) {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        var resBody = Buffer.concat(chunks);
        // eslint-disable-next-line no-console
        console.log(resBody.toString());
        resolve(resBody.toString());
      });
    });

    request.once('error', reject);
    request.end(JSON.stringify(body));
  });
}


module.exports.triggerBuild = triggerBuild;
