const core = require("@actions/core");
const github = require("@actions/github");
const squadMapping = require('./squad-mapping.json');

const run = () => {

    console.log({squadMapping})


    const assignees = github.context.payload.issue.assignees || [];
    console.log(assignees)
}

run();