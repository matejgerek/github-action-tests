const core = require("@actions/core");
const squadMapping = require('./squad-mapping.json');
const { getOctokit, context } = require("@actions/github");

const SQUADS = ["Squad 1", "Squad 2", "Squad 3"]

async function assignLabelsToIssue() {
  const assignees = context.payload.issue.assignees;
  const currentLabels = context.payload.issue.labels.map(label => label.name);
  const issueNumber = context.payload.issue.number;
  const { rest: client } = getOctokit(process.env.GITHUB_AUTH);

  const labelsByAssignees = assignees.flatMap(assignee => squadMapping.find(mapping => mapping.login === assignee.login)?.label ?? []);

  const labelsToRemove = currentLabels.filter(label => {
    const squad = SQUADS.find(mapping => mapping === label);
    return squad && !labelsByAssignees.includes(label);
  });

  labelsToRemove.forEach(async (label) => {
    await client.issues.removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      name: label,
    });
  });

  const labelsToAdd = labelsByAssignees.filter(label => !currentLabels.includes(label)).concat(['Squad 2', 'Squad 2']);

  if (labelsToAdd.length > 0) {
    await client.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: labelsToAdd,
    });
  }
}

// Call the main function
assignLabelsToIssue();
