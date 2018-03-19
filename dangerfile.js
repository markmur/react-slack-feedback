const jest = require('danger-plugin-jest').default;
const { message, danger, warn } = require('danger');

// Output all modified files in the PR
const modified = danger.git.modified_files;
message('Changed Files in this PR: \n' + modified.map(file => `- ${file}\n`));

// Encourage smaller PRs
let errorCount = 0;
const bigPRThreshold = 600;
const thresholdErrorMessage =
  'Pull Request size seems quite large. If the PR contains multiple changes, try splitting each change into a separate PR to aid faster, easier reviews.';
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(
    `:exclamation: PR is too big (${++errorCount}) - ${thresholdErrorMessage}`
  );
}

// Run jest test suites
jest();
