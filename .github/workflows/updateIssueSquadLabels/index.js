
const squadMapping = require('./squadMapping.json');
const { getOctokit, context } = require("@actions/github");

const updateIssueSquadLabels = async () => {
  const assignees = context.payload.issue.assignees;
  const currentLabels = context.payload.issue.labels.map(label => label.name);
  const issueNumber = context.payload.issue.number;

  const { rest: client } = getOctokit(process.env.GITHUB_AUTH);

  const labelsByAssignees = assignees.flatMap(assignee => squadMapping.find(mapping => mapping.login === assignee.login)?.label ?? []);

  const updatedLabels = [...new Set([...currentLabels, ...labelsByAssignees])];

  console.log({updatedLabels})

  await client.issues.setLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    labels: updatedLabels
  })

};


updateIssueSquadLabels()