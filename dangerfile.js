const { message, danger } = require('danger')

// Output all modified files in the PR
const modified = danger.git.modified_files
message('Files changed in this PR: \n' + modified.map(file => `\n- ${file}`))
