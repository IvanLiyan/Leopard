# Leopard

## Getting Started

1. Clone the repo.
2. Create a `.env.local` file. A template is included via the file `.env.example`.
3. Run `yarn create-certs`.
   > **Note**
   >
   > `create-certs` creates SSL certificates used to run the local Next.JS server with HTTPS. HTTPS is required to communicate with `merch-fe`.
   >
   > We use [devcert](https://github.com/davewasmer/devcert) under the hood to power cert management; this is the same tool used by [Gatsby](https://www.gatsbyjs.com/docs/local-https/), so it should be getting a significant amount of use and testing through that framework.
4. Run `yarn install`.
5. Run `yarn dev`.
   > **Note** `dev` starts a Next.JS development server running on port 8080.
6. Navigate to `https://leopard.wish.com:3000/<page>`.

### Logging In

While Leopard itself does not employ any authentication to view pages (see _Why don't we have page based authentication?_ below), the APIs it accesses do require authentication. On production, Leopard will get the `merchant.wish.com` authentication cookies automatically since we're hosted under that domain. For local development, we've implemented a special _dev-login_ flow leveraging the local Next.JS development server. To log in as your admin account, and then as a merchant:

1. Confirm your `.env.local` file is populated with your admin username and password and start the local dev server (`yarn dev`).
   > **Warning** `.env.local` is ignored by our `.gitignore`. **Never commit this file**, or any other file with your username and password.
2. Navigate to `https://leopard.wish.com:3000/dev-login`.
3. Press the `Dev Login` button.
   - The Leopard dev server will execute a query against the provided merch-fe backend and log you in under your admin account.
   - After the query is finished you should see your admin account's user ID next to `Current User ID`.
4. Navigate to `/go/<mid>`.
   - Leopard will use the merch-fe's native `/go` URL to log you in as the provided merchant.
5. Navigate to `/dev-login`. Click the `Fetch api/graphql` button.
   - Leopard will execute a query to get the current user and merchant IDs. You should see both your user ID and the merchant's merchant ID displayed after the query finishes executing.

## Project Tour

**:warning: :warning: :warning: Below info is out of date; updated project tour is incoming :warning :warning: :warning:**

- `src/pages`

  Next.JS uses a file-system based router that maps routes to pages via the formula

  - `leopard.wish.com/my-page` -> `src/pages/my-page`
  - `leopard.wish.com/subdir/my-page` -> `src/pages/subdir/my-page`
  - etc.

  Thus, all the pages in Leopard are stored in `src/pages`. Each file exports a React Component of type `NextPage<Record<string, never>>`, and they are free to import from the various other component packages in order to more easily build that component.

  For more information on pages and routing, visit [Next.JS: Pages](https://nextjs.org/docs/basic-features/pages) and [Next.JS: Routing](https://nextjs.org/docs/routing/introduction).

  > **Note**
  >
  > **Why are all the page components typed as `NextPage<Record<string, never>>`?**
  >
  > The type `NextPage<Props>` is a type template where props represents props fetched either at build time or at render time (when using SSR). Since we use static site generation and not SSR, our pages should not have any props, and instead the React component itself should be responsible for executing any requests for data it requires.

  > **Warning**
  >
  > The following files in `src/pages` are special and should not be modified during the normal feature development workflow:
  >
  > - `src/pages/api/*`
  > - `src/pages/_app.tsx`
  > - `src/pages/_document.tsx`
  > - `src/pages/dev-login.tsx`

- `src/pkg`

  The `pkg` folder is based on the legacy package structure used when Merchant Dashboard was part of the clroot monolith. By using the same structure here we're able to more efficiently migrate over existing pages to Leopard and maintain both codebases.

  - `pkg/assets`

    The `assets` package represents all the `.svg` / etc assets used throught the dashboard.

    When adding a new asset, please follow the following workflow:

    🏗 _TODO_ 🏗

  - `pkg/merchant`

    The `merchant` package contains all React compoennts used in the merchant facing section of the Merchant Dashboard (as opposed to, for example, the admin facing components stored in the `internal` package in clroot). **Since Leopard is only meant for merchant facing pages, all React components are contained in this package.** The package is further subdivided into the following sections:

    - `merchant/component`

      This folder contains all the standard React components used throughout the dashboard.

      To help with organization, utilize a feature specific sub-folder when building feature specific components (as opposed to general use components stored in `component/core`).

    - `merchant/container`

      This folder contains the React components functioning as page containers. This is a pattern that existed in the legacy clroot repository and no longer needs to be followed. **New pages do not need to be wrapped in a container.**

    - 🏗 _TODO: the rest_ 🏗

  - `pkg/schema`

    The `schema` package contains the GQL schema and corresponding TS types generated by the `ggt` finch function in clroot.

    🏗 _TODO: method for efficiently keeping `schema` in sync between clroot and Leopard_ 🏗

  - `pkg/stores`

    The `stores` package contains various providers and mobx stores used to power MD wide features such as navigation.

    > **Warning**
    > This package should not be modified during the normal feature development workflow.

  - `pkg/toolkit`

    The `toolkit` package contains `.ts` files that don't represent React components. Please follow a similar pattern of organization as seen in the `pkg/merchant/component` folder.

  - `pkg/workers`

    The `workers` package contains Web Workers.

- `src/styles`

  This folder contains `global.css` which represents the default css stylesheet loaded for all pages.

  > **Warning**
  > This folder should not be modified during the normal feature development workflow.

- `src/toolkit`

  This folder contains code required to power the Leopard specific aspects of the Merchant Dashboard.

  > **Warning**
  > This folder should not be modified during the normal feature development workflow.

## Creating a New Page

🏗 _TODO_ 🏗

### Writing Tests

🏗 _TODO_ 🏗

## Notes

**Why don't we have page based authentication?**

Leopard does not employ page based authentication. This is because Leopard is built for production as an [SSG](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) application and hosted on Cloudfront; we have no server sitting in front of requests to perform any authentication. If Leopard pages were to employ any form of page based authentication, it would be computed client side - any client side based authentication can be bypassed by the client.

However, all requests for data (the sensitive part) go through GQL to `merch-fe`, which **_does_** employ authentication. Thus the most a malicious user could get without authenticating would be the page skeleton with no actual client data.

> **Note**
>
> In `merch-fe`, page based authentication is often combined with redirects to provide a nice user experience where users who didn't have the correct permissions to access a page is redirected to a page they can access, or a 404 page, vs. being shown a broken page. Note that this behavior can still be accomplished in Leopard by employing client side checks and redirects - it's just important to note it doesn't provide actual authentication since the user can bypass the redirect and view the skeleton if they so desire.

On production, Leopard will get the required `merchant.wish.com` authentication cookies automatically since we're hosted under that domain. For local development, we've implemented a special _dev-login_ flow (see _Logging In_ above).
