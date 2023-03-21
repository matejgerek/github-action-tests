const core = require("@actions/core");
const github = require("@actions/github");
const squadMapping = require('./squad-mapping.json');


const run = async () => {
  const assignees = github.context.payload.issue.assignees || [];

  // Find corresponding labels for each assignee
  const labels = assignees.map(assignee => {
    const squad = squadMapping.find(mapping => mapping.login === assignee.login);
    return squad ? squad.label : null;
  }).filter(label => label !== null);

  // Add labels to the issue
  const octokit = github.getOctokit(process.env.GITHUB_AUTH);
  console.log({octokit})
  await octokit.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue.number,
    labels: labels
  });
}

run();