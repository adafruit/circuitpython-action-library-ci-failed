const core = require('@actions/core');
const github = require('@actions/github');
console.log(github.context);
// Use a reaction to track if we've replied already. 201 is returned
// the first time we set it. 200 if it was already created. This saves
// us from having to look through all of the existing comments.
const result = github.rest.reactions.createForIssue({
    issue_number: github.context.issue.number,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    content: 'eyes'
});
if (result.status == 201) {
  github.issues.createComment({
    issue_number: github.context.issue.number,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    body: '👋 Thanks for this pull request! Unfortunately, it looks like the automated continuous integration (CI) [test(s) failed](). These can be tricky to fix so we've written a guide on how to fix them locally. It has pages about [running pre-commit locally](https://learn.adafruit.com/creating-and-sharing-a-circuitpython-library/check-your-code) and another about [building the docs locally with sphinx](https://learn.adafruit.com/creating-and-sharing-a-circuitpython-library/sharing-our-docs-on-readthedocs). Thanks for contributing to CircuitPython! If you have more questions, feel free to join [the Adafruit Discord](https://adafru.it/discord) and post in #circuitpython-dev.'
  });
}