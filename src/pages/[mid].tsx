import { useMemo } from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { StyleSheet } from "aphrodite";
import client from "@toolkit/apollo-client";
import {
  STOREFRONT_DATA_QUERY,
  StorefrontDataParams,
  StorefrontDataResponse,
} from "@toolkit/queries";
import { CountryCode } from "@toolkit/schema";

import PageContainer from "@riptide/components/core/PageContainer";
import StoreInfoSection from "@riptide/components/storeInfo/StoreInfoSection";
import ProductFeed from "@riptide/components/productFeed/ProductFeed";

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" }; // TODO [lliepert]: query the top x merchants and pre-render their pages
};

type Props = {
  readonly storeName: string;
  readonly merchantCreationDate: string;
  readonly location: {
    readonly cc: CountryCode;
    readonly name: string;
  };
  readonly numReviews: number;
  readonly averageRating: number;
  readonly productFeeds: {
    readonly id: string;
    readonly name: string;
  }[];
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params?.mid || typeof params.mid !== "string") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const { data, error } = await client.query<
    StorefrontDataResponse,
    StorefrontDataParams
  >({
    query: STOREFRONT_DATA_QUERY,
    variables: {
      mid: params.mid,
    },
  });

  if (
    error ||
    data == null ||
    !data.storefront.serviceEnabled ||
    !data.storefront.merchantEnabled
  ) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const {
    name: storeName,
    creationDate: { formatted: merchantCreationDate },
    location: { code: cc, name },
    reviewSummary: { count: numReviews, averageRating },
    customization: { feeds: productFeeds },
  } = data.storefront.forMerchant;

  const props: Props = {
    storeName,
    merchantCreationDate,
    location: {
      cc,
      name,
    },
    numReviews,
    averageRating,
    productFeeds,
  };

  return {
    props,
    revalidate: 60, // regenerate the page every 60 seconds using ISR (see: https://vercel.com/docs/next.js/incremental-static-regeneration)
  };
};

const MerchantStorefront: NextPage<Props> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { storeName, productFeeds } = props;
  const styles = useStylesheet();

  const Feeds = () => (
    <>
      {/* TODO [lliepert]: temp doubling of product feeds for UI testing purposes */}
      {[...productFeeds, ...productFeeds].map(({ id, name }, i) => (
        <ProductFeed
          key={`${id}_${i}`}
          id={id}
          name={name}
          style={styles.upperMargin}
        />
      ))}
    </>
  );

  return (
    <>
      <Head>
        <title>{storeName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageContainer>
        <StoreInfoSection {...props} />
        <Feeds />
      </PageContainer>
    </>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        upperMargin: {
          marginTop: "16px",
        },
      }),
    [],
  );
export default MerchantStorefront;
