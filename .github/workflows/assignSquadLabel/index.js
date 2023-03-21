const core = require("@actions/core");
import * as github from '@actions/github';
const squadMapping = require('./squad-mapping.json');


const run = async () => {
  const assignees = github.context.payload.issue.assignees || [];

  // Find corresponding labels for each assignee
  const labels = assignees.map(assignee => {
    const squad = squadMapping.find(mapping => mapping.login === assignee.login);
    return squad ? squad.label : null;
  }).filter(label => label !== null);

  console.log({labels})

  // Add labels to the issue
  const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

  console.log({octokit})
}

run();