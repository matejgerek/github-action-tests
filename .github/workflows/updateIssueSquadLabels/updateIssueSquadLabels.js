const squadMapping = require('./squadMapping.json');
const { getOctokit, context } = require("@actions/github");
const squadLabels = new Set(squadMapping.map(mapping => mapping.label));

const updateIssueSquadLabels = async () => {
  const assignees = context.payload.issue.assignees;
  const currentLabels = context.payload.issue.labels.map(label => label.name);
  const issueNumber = context.payload.issue.number;

  const { rest: client } = getOctokit(process.env.GITHUB_AUTH);

  const labelsByAssignees = assignees.flatMap(assignee => squadMapping.find(mapping => mapping.login === assignee.login)?.label ?? []);

  const labelsToRemove = currentLabels.filter(label => squadLabels.has(label) && !labelsByAssignees.includes(label));

  labelsToRemove.forEach(async (label) => {
    await client.issues.removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      name: label,
    });
  });

  const labelsToAdd = new Set(labelsByAssignees.filter(label => !currentLabels.includes(label)));

  if (labelsToAdd.size > 0) {
    await client.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: Array.from(labelsToAdd),
    });
  }
};

exports.module = {
    updateIssueSquadLabels
}