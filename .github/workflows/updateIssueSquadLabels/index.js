
const squadMapping = require('./squadMapping.json');
const { getOctokit, context } = require("@actions/github");

const updateIssueSquadLabels = async () => {
  const assignees = context.payload.issue.assignees;
  const currentLabels = context.payload.issue.labels.map(label => label.name);
  const issueNumber = context.payload.issue.number;

  const { rest: client } = getOctokit(process.env.GITHUB_AUTH);

  const test = await client.listMembersInOrg({
  org: 'sudolabs-io',
  team_slug: 'the-expert-squad-2',
});
  console.log(test)


  const labelsByAssignees = assignees.flatMap(assignee => squadMapping.find(mapping => mapping.login === assignee.login)?.label ?? []);

  const labelsToRemove = currentLabels.filter(label => label.includes('Squad') && !labelsByAssignees.includes(label));

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


updateIssueSquadLabels()