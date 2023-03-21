const core = require("@actions/core");
const squadMapping = require('./squad-mapping.json');
const {getOctokit, context} = require("@actions/github");


const run = async () => {
  const assignees = context.payload.issue.assignees || [];
  console.log(context.payload.issue)
  const currentLabels = (context.payload.issue.labels || []).map(label => label.name);

  const labelsByAssignees = assignees.map(assignee => {
    const squad = squadMapping.find(mapping => mapping.login === assignee.login);
    return squad ? squad.label : null;
  }).filter(label => label !== null);

  const issue_number = context.payload.issue.number;
  console.log({labelsByAssignees})

  const {rest: client} = getOctokit(process.env.GITHUB_AUTH);

  const labelsToRemove = currentLabels.filter(label => {
    const squad = squadMapping.find(mapping => mapping.label === label);
    return squad && !labelsByAssignees.includes(label);
  });

  for (const label of labelsToRemove) {
    await client.issues.removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number,
      name: label,
    });
  }

  const labelsToAdd = labelsByAssignees.filter(label => !currentLabels.includes(label));

  if(labelsToAdd.length > 0) {
    await client.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number,
      labels: labelsToAdd,
    });
  }
};

run();


run();