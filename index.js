const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const repo = github.context.payload.repository;
  const workflow_run = github.context.payload.workflow_run;
  const issue = workflow_run.pull_requests[0];

  // Use a reaction to track if we've replied already. 201 is returned
  // the first time we set it. 200 if it was already created. This saves
  // us from having to look through all of the existing comments.

  try {
    const result = await octokit.reactions.createForIssue({
        issue_number: issue.number,
        owner: repo.owner.login,
        repo: repo.name,
        content: 'eyes'
    });

    if (result.status == 201) {
      octokit.issues.createComment({
        issue_number: issue.number,
        owner: repo.owner.login,
        repo: repo.name,
        body: "👋 Thanks for this pull request! Unfortunately, it looks like the automated continuous integration (CI) [test(s) failed](" + workflow_run.html_url + "). These can be tricky to fix so we've written a guide on how to fix them locally. It has pages about [running pre-commit locally](https://learn.adafruit.com/creating-and-sharing-a-circuitpython-library/check-your-code) and another about [building the docs locally with sphinx](https://learn.adafruit.com/creating-and-sharing-a-circuitpython-library/sharing-our-docs-on-readthedocs). Thanks for contributing to CircuitPython! If you have more questions, feel free to join [the Adafruit Discord](https://adafru.it/discord) and post in #circuitpython-dev."
      });
    } else {
      console.log("Already commented");
    }
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();