const jest = require('danger-plugin-jest').default;
const { message, danger, warn, markdown } = require('danger');

// Output all modified files in the PR
const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

// Encourage smaller PRs
let errorCount = 0;
const bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR (' + ++errorCount + ')');
  markdown(
    '> (' +
      errorCount +
      ') : Pull Request size seems quite large. If the PR contains multiple changes, try splitting each change into a separate PR to aid faster, easier reviews.'
  );
}

jest();
