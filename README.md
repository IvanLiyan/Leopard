# Leopard

## Getting Started

1. Clone the repo.
2. Create a `.env.local` file. A template is included via the file `.env.example`.
3. Run `yarn setup`.
   > **Note**
   >
   > `setup` runs a setup script that installs [pre-commit](https://pre-commit.com/), sets up git to check the `.githooks` directory for hooks, and runs `create-certs`.
   >
   > `create-certs` creates SSL certificates used to run the local Next.JS server with HTTPS. HTTPS is required to communicate with `merch-fe`.
   >
   > We use [devcert](https://github.com/davewasmer/devcert) under the hood to power cert management; this is the same tool used by [Gatsby](https://www.gatsbyjs.com/docs/local-https/), so it should be getting a significant amount of use and testing through that framework.
4. Run `yarn install`.
5. Run `yarn dev`.
   > **Note** `dev` starts a Next.JS development server running on port 8080.
6. Navigate to `https://leopard.corp.contextlogic.com:3000/md/dev-login` and follow the instructions there to log in via the credentials in your `.env.local` file.
7. Navigate to `https://leopard.corp.contextlogic.com:3000/md/<page>`.

## Project Tour

- `src/pages`:

  Next.JS uses a file-system based router that maps routes to pages via the formula

  - `leopard.corp.contextlogic.com/my-page` -> `src/pages/my-page`
  - `leopard.corp.contextlogic.com/subdir/my-page` -> `src/pages/subdir/my-page`
  - etc.

  Thus, all the pages in Leopard are stored in `src/pages`. Each file exports a React Component of type `NextPage<Record<string, never>>`, and they import from the various apps in `src/app` to build the complete page.

  For more information on pages and routing, visit [Next.JS: Pages](https://nextjs.org/docs/basic-features/pages) and [Next.JS: Routing](https://nextjs.org/docs/routing/introduction).

  **All pages must include the suffix `.dev` or `.prod` (ex: `page.prop.tsx`).**

  Pages with the suffix `.dev` are only available locally when running the dev server (`yarn dev`) and are **_not_** exported during a production build.

  Pages with the suffix `.prop` **_are_** exported during a production build, along with being available locally when running the dev server.

  This allows us to have both dev only pages such as `dev-login`, as well allowing us to merge to master pages that are in progress but not yet ready to be deployed to S3.

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

- `src/app`:

  Aside from the pages directory, Leopard organizes its code into self contained apps. When creating a new feature, first create a new directory (e.g. `src/app/feature`), and then store all your files there. By separating features into separate apps like this, we can more easily enforce that different features are self contained, which enables different teams working on different features to maintain their own code style and paradigms and allows features to evolve on their own without impacting other parts of the Merchant Dashboard.

  To make imports easier, we recommend you also add an alias to `tsconfig.json` of the form

  ```
  "@feature/*": ["src/app/feature/*"],
  ```

  This allows you to more easily import your code across your feature, and makes it easier to maintain the separation of different apps during code review.

- `src/app/core` (aliased as `@core`):

  `@core` is a special app that contains all the components / utilities / etc. used across Merchant Dashboard. For example, shared features such as `NavigationStore` or components such as `<Link />` are located here.

- `src/schema` (aliased as `@schema`):

  `@schema` contains our GraphQL schema and is regularly updated by the Merchant Web team. When typing GQL requests / responses, please reference the types here.

## Testing

🏗 _TODO_ 🏗

## Notes

**Why don't we have page based authentication?**

Leopard does not employ page based authentication. This is because Leopard is built for production as an [SSG](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) application and hosted on Cloudfront; we have no server sitting in front of requests to perform any authentication. If Leopard pages were to employ any form of page based authentication, it would be computed client side - any client side based authentication can be bypassed by the client.

However, all requests for data (the sensitive part) go through GQL to `merch-fe`, which **_does_** employ authentication. Thus the most a malicious user could get without authenticating would be the page skeleton with no actual client data.

> **Note**
>
> In `merch-fe`, page based authentication is often combined with redirects to provide a nice user experience where users who didn't have the correct permissions to access a page is redirected to a page they can access, or a 404 page, vs. being shown a broken page. Note that this behavior can still be accomplished in Leopard by employing client side checks and redirects - it's just important to note it doesn't provide actual authentication since the user can bypass the redirect and view the skeleton if they so desire.

On production, Leopard will get the required `merchant.wish.com` authentication cookies automatically since we're hosted under that domain. For local development, we've implemented a special _dev-login_ flow (see _Logging In_ above).

## `package.json` Comments:

- sharp installed due to issue with alpine docker images and node 18: https://github.com/vercel/next.js/issues/38020

## RFCs

Below is a list of RFCs relating to Leopard.

- [Design Doc](https://docs.google.com/document/d/17cbVHjsqULJThlPjVRTJwe-9s_a44gQoxCOT1N31kwU)
- [RFC 001: Cloudfront Caching](https://docs.google.com/document/d/1G8FXsaCpLce8_j47g319pyXmO2SzFB_EJjJI08NvNms)

## Working with GraphQL

This project uses [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client).

Run the following during development to ensure TypeScript types are regenerated as needed:

```
yarn codegen
```

This starts a process to watch for code changes, and regenerate the GraphQL schema & query types on-the-fly. It will also notify you if any queries contains errors (e.g. misspelled field name).

When adding a new GQL query/mutation, define it like so:

```javascript
import { gql } from "@gql";

export const MyQuery = gql(`
  query MyQuery {
    ...
  }
`);
```

Afterwards, the query can be used without needing to specify the type:

```
const { data, loading } = useQuery(MyQuery, { variables: { ... } })
```

`data` will automagically get the typing information from `MyQuery` because it is generated as a fully typed `DocumentNode`.
