const jest = require('danger-plugin-jest');
const { message, danger } = require('danger');

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

jest();
