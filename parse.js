var Promise = require("bluebird");
var yaml = require('js-yaml');
var fs = Promise.promisifyAll(require("fs"));
var R = require('ramda');

var prepareShFile = function(json) {
  var contents = [
    'cd ~/build',
    'set -x'
  ];

  contents = contents.concat(json.before_script);
  contents = contents.concat(json.script);

  return contents.join('\n');
};

fs.readFileAsync('/home/shoov/build/.shoov.yml')
  .then(function (data) {
    return yaml.safeLoad(data);
  })
  .then(function (json) {
    return fs.writeFileAsync('/home/shoov/shoov.sh', prepareShFile(json));
  })
  .then(function() {
    return fs.chmodAsync('/home/shoov/shoov.sh', '777')
  })
  .catch(SyntaxError, function (e) {
    console.error("file contains invalid json");
  }).catch(Promise.OperationalError, function (e) {
    console.error(e.message);
  });
