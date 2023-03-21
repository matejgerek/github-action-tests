const core = require("@actions/core");

const run = () => {
    const githubToken = core.getInput('github_token', { required: true });

    const assignees = core
      .getInput('assignees')
      .split('\n')
      .filter(l => l !== '');

    console.log('assignees', assignees);
    console.log('githubToken', githubToken);

}

run();