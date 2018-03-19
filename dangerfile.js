import path from 'path';
import jest from 'danger-plugin-jest';
import { message, danger } from 'danger';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

// Default
jest();
// Custom path
jest({ testResultsJsonPath: path.resolve(__dirname, 'tests/results.json') });
