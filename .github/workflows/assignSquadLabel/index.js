const core = require("@actions/core");
const squadMapping = require('./squad-mapping.json');
const {getOctokit, context} = require("@actions/github");


const run = async () => {
  const assignees = context.payload.issue.assignees || [];

  const currentLabels = context.payload.issue.labels || [];

  console.log({currentLabels})

  const labelsByAssignees = assignees.map(assignee => {
    const squad = squadMapping.find(mapping => mapping.login === assignee.login);
    return squad ? squad.label : null;
  }).filter(label => label !== null);

  console.log({labelsByAssignees})

const issue_number = context.payload.issue.number;

  console.log({issue_number})

  const {rest: client} = getOctokit(process.env.GITHUB_AUTH);

  await client.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number,
      labels: labelsByAssignees,
  })

}

run();