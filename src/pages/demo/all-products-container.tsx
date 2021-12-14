/*

    NOTE: THIS IS AN AUTO-GENERATED FILE CREATED DURING THE TRANSITION FROM
    CLROOT TO NEXT.JS.

    DO NOT COPY PATTERNS SEEN HERE.

*/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextPage } from "next";
import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import { LoadingIndicator } from "@ContextLogic/lego";
import { isProd } from "@stores/EnvironmentStore";
import { AllProductsContainer } from "@plus/container";

const Page: NextPage<Record<string, never>> = () => {
  const query = gql`
    query AllProductsContainer {
      currentMerchant {
        canManageShipping
      }
    }
  `;

  const { loading, error, data } = useQuery(query);

  // TODO [lliepert]: properly handle error
  if (error) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(`useQuery failed with error: ${error}`);
    }
    throw error;
  }

  // [lliepert] temp debugging to confirm GQL proxy
  // eslint-disable-next-line no-console
  console.log("data", data);

  return (
    <>
      <Head>
        <title>{"Wish For Merchants"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {loading ? (
        <LoadingIndicator />
      ) : (
        // <AllProductsContainer initialData={data} />
        <div>finished loading</div>
      )}
    </>
  );
};

export default Page;
