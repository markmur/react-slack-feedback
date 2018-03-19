const path = require('path');
const jest = require('danger-plugin-jest');
const { message, danger } = require('danger');

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

// Default
jest();
// Custom path
jest({ testResultsJsonPath: path.resolve(__dirname, 'tests/results.json') });
