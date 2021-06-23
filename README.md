# Default-service

This is a barebones project, that gives you the CI/CD benefits of a new service. The entire application is intended to be discarded. Users of this template are required to re-write their Dockerfile along with everything within the application. This **IS NOT** a ready made template project. It requires full customization by the user.

The benefits of using this template comes from the already defined `Gitlab pipeline`. The definitions which are housed in the `.gitlab-ci.yml` automatically build docker images with every commit to the repository.
Also, the project allows the user to deploy to Kubernetes using the deploy jobs if the project is properly configured in k8s and kube-deploy.

## Creating a project off default-service

To create a project off this template, go to [one-click](https://one-click.i.wish.com), and put in your project details. Make sure to select `default-service` as your template of choice.

Follow the instructions in the [one-click wiki](https://wiki.wish.site/display/Infra/One-Click).

## Deploying your service

To run your service (docker image) in Kubernetes, you need to push your code to the [Amazon ECR](https://us-west-1.console.aws.amazon.com/ecr/repositories?region=us-west-1#) registry, setup your k8s manifest, and setup `kube-deploy`.
You should also look at the [one-click wiki](https://wiki.wish.site/display/Infra/One-Click) for instructions around maintaining and updating your service.
And this [CI/CD](https://wiki.wish.site/pages/viewpage.action?pageId=13927283) break down for understanding what your pipeline jobs do.

You can push your images to `ECR` using `Gitlab`. Anytime code is pushed to the remote repository, a Gitlab pipeline will be triggered to build your docker image, and push it to `ECR`. The image tag that is sent to `ECR` will defer by branch.

> Note: If you've updated your service, make sure you expose a `/status` enpoint for the k8s liveness probe. If not, your service deployment will fail.

- All branches have a manual `deploy-dev` button for pushing an image with the `dev` tag.
- feature branches (any branch besides `master`, `release_candidate` and `production`)
  - Automatically builds and pushes image with the `commit-sha` as its tag.
  - `deploy-dev`
- `master` branch
  - `deploy-dev`
- `release_candidate` branch
  - `deploy-stage` - Automatic job
  - `deploy-dev`
- `production` branch
  - `deploy-canary`
  - `deploy-prod-01` - mapped to K8s cluster app-01 (more information on k8s in the **About K8s** section)
  - `deploy-prod-02` - mapped to k8s cluster app-02
  - `deploy-prod-06` - mapped to k8s cluster app-06
  - `deploy-prod-07` - mapped to k8s cluster app-07
  - `deploy-dev`

You can verify your image was built in [Amazon ECR](https://us-west-1.console.aws.amazon.com/ecr/repositories?region=us-west-1#). To get access to ECR, you will need to assume the [Registry Role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-console.html) on AWS. To do so, contact IT or the #security channel to give you permissions to do so. Once you've assumed the Registry Role, clicking on the Amazon ECR link above, should take you to the ECR repositories page. The name of the ECR repo will follow the format
`contextlogic/<repository-name>`.

> Note: Built images will be under the `contextlogic/` folder in ECR. E.g. `contextlogic/default-service`.

## Testing your deployed service

To test the newly running service, you can issue a curl against it via `Consul` to test the http server:

> Action: Replace service-name with the name of your service. E.g. `curl http://default-service-dev.service.consul:8080/status`

`curl http://<service-name>-dev.service.consul:8080/status`
