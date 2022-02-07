import { Octokit, App } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_LIGHTHOUSE_TOKEN,
});

// const postComment = () => {
//   console.log("Posting comment to GitHub...");
//   return octokit.rest.issues.createComment({
//     owner: "ContextLogic",
//     repo: "leopard",
//     issue_number: 37,
//     body: `https://gitlab.i.wish.com/ContextLogic/leopard/-/jobs/artifacts/${process.env.CI_COMMIT_REF_NAME}/raw/lhcireport/lighthouse.report.html?job=lighthouse`,
//   });
// };

// TODO
// update `description` to report URL of page that LH ran against
// update `state` to accept parameter of `lhci` cmd return code
// Doc: https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/master/docs/repos/createCommitStatus.md
const updateCommitStatus = () => {
  console.log("Updating commit status...");
  return octokit.rest.repos.createCommitStatus({
    owner: "ContextLogic",
    repo: "leopard",
    sha: `${process.env.CI_COMMIT_SHA}`,
    state: "success",
    description: "Lighthouse report",
    target_url: `https://gitlab.i.wish.com/ContextLogic/leopard/-/jobs/artifacts/${process.env.CI_COMMIT_REF_NAME}/raw/lhcireport/lighthouse.report.html?job=lighthouse`,
    context: "Lighthouse",
  });
};

// Can't post comment yet b/c haven't found a way to pass the Github issue # to CI
// postComment().then((data) => {
//   const { status } = data;
//   if (status === 201) {
//     console.log("...success");
//   } else {
//     console.error("...error");
//     console.error(data);
//   }

// });

updateCommitStatus().then((data) => {
  const { status } = data;
  if (status === 201) {
    console.log("...success");
  } else {
    console.error("...error");
    console.error(data);
  }
});
