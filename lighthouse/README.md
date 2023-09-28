This folder contains the module that runs after Lighthouse CI, to post results back to GitHub for better visibilty.

It uses a simple package.json file to install a depedency for the official GitHub JS client called `octokit`. Here `npm` is used rather than `yarn` because this setup is not intended to be final, and `npm` is already available versus `yarn` that has to be installed separately.

In the future, we may consider building the dependency into the CI environment using a custom Docker image stored in our private container registry. This will allow us to only maintain `lhci.mjs` and also help reduce CI runtime.
