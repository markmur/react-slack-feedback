const jest = require('danger-plugin-jest').default;
const { message, danger, warn } = require('danger');

// Output all modified files in the PR
const modified = danger.git.modified_files;
message('Changed Files in this PR: \n' + modified.map(file => `- ${file}\n`));

// Run jest test suites
jest();
