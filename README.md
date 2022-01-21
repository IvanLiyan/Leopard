# Leopard

## Getting Started

Before running leopard, add the root file `.env.local` populated with the following environment variables:

```
NEXT_PUBLIC_MD_URL=<url to your instance of merch-fe, ex: https://yourid-ec2-merch.vpn.contextlogic.com>
NEXT_PUBLIC_ENV=dev
USERNAME=<username for your MD admin account, used in /api/dev-login flow>
PASSWORD=<password for your MD admin account, used in /api/dev-login flow>
```

## MIDs for Testing

- `590cece8ee77233e8153dffa`: contains backfilled feed
- `593528d9e81e8a481cac4ea7`: contains products

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

# With Docker

This examples shows how to use Docker with Next.js based on the [deployment documentation](https://nextjs.org/docs/deployment#docker-image). Additionally, it contains instructions for deploying to Google Cloud Run. However, you can use any container-based deployment host.

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-docker nextjs-docker
# or
yarn create next-app --example with-docker nextjs-docker
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t nextjs-docker .`.
1. Run your container: `docker run -p 8080:8080 nextjs-docker`.

You can view your images created with `docker images`.

## Deploying to Google Cloud Run

The `start` script in `package.json` has been modified to accept a `PORT` environment variable (for compatability with Google Cloud Run).

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) so you can use `gcloud` on the command line.
1. Run `gcloud auth login` to log in to your account.
1. [Create a new project](https://cloud.google.com/run/docs/quickstarts/build-and-deploy) in Google Cloud Run (e.g. `nextjs-docker`). Ensure billing is turned on.
1. Build your container image using Cloud Build: `gcloud builds submit --tag gcr.io/PROJECT-ID/helloworld --project PROJECT-ID`. This will also enable Cloud Build for your project.
1. Deploy to Cloud Run: `gcloud run deploy --image gcr.io/PROJECT-ID/helloworld --project PROJECT-ID --platform managed`. Choose a region of your choice.

   - You will be prompted for the service name: press Enter to accept the default name, `helloworld`.
   - You will be prompted for [region](https://cloud.google.com/run/docs/quickstarts/build-and-deploy#follow-cloud-run): select the region of your choice, for example `us-central1`.
   - You will be prompted to **allow unauthenticated invocations**: respond `y`.

Or click the button below, authorize the script, and select the project and region when prompted:

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/vercel/next.js.git&dir=examples/with-docker)

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:8080/api/hello](http://localhost:8080/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

# Typescript

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:8080/api/hello](http://localhost:8080/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
