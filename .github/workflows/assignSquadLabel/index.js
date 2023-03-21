const core = require("@actions/core");
const github = require("@actions/github");

const run = () => {
    const assignees = github.context.payload.issue
    console.log(assignees)
}

run();