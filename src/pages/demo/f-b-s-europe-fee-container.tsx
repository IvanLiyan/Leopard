/*

    NOTE: THIS IS AN AUTO-GENERATED FILE CREATED DURING THE TRANSITION FROM
    CLROOT TO NEXT.JS.

    DO NOT COPY PATTERNS SEEN HERE.

*/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { createClient } from "@next-toolkit/apollo-client";
import { gql } from "@apollo/client";

import { FBSEuropeFeeContainer } from "@merchant/container";

type Props = {
  readonly initialData: any;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const MD_URL: string = process.env.NEXT_PUBLIC_MD_URL || "";

  // the following is used to set the _xsrf token
  // if further gql queries are required, a better method will be required
  const req = await axios({
    method: "GET",
    url: MD_URL,
    headers: { Authorization: process.env.STAGING_AUTH_HEADER },
    xsrfCookieName: "_xsrf",
    xsrfHeaderName: "X-XSRFToken",
    withCredentials: true,
  });

  // AxiosResponse types header as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const xsrfToken = req?.headers["set-cookie"]
    ?.find((cookie: string) => cookie.substr(0, 5) == "_xsrf")
    .split(";")[0]
    .split("=")[1];

  const client = createClient(xsrfToken);

  const query = gql`
query FBSEuropeFeeContainer {
  currentUser {
    gating {
      fbwFeeExperiment: isAllowed(name: "fbw_fee_experiment_gate")
    }
  }
    }`;

  const {
    data: { initialData },
    error,
    errors,
  } = await client.query({
    query,
    errorPolicy: "all",
  });

  if (error || errors) {
    return { notFound: true };
  }

  return {
    props: { initialData },
    revalidate: 60, // regenerate the page every 60 seconds using ISR (see: https://vercel.com/docs/next.js/incremental-static-regeneration)
  };
};

const Page: NextPage<Props> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { initialData } = props;

  return (
    <>
      <Head>
        <title>{"Wish For Merchants"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <FBSEuropeFeeContainer initialData={initialData} />
    </>
  );
};

export default Page;
