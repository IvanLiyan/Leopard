import { useMemo } from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import * as Sentry from "@sentry/nextjs";
import { StyleSheet } from "aphrodite";
import client from "@toolkit/apollo-client";
import {
  STOREFRONT_DATA_QUERY,
  StorefrontDataParams,
  StorefrontDataResponse,
} from "@toolkit/queries";
import { fetchAllProducts, fetchProductFeed } from "@toolkit/rest-api";
import {
  StorefrontState,
  StorefrontStateProvider,
} from "@toolkit/context/storefront-state";
import { useLocalization } from "@toolkit/context/localization";
import { WISH_URL } from "@toolkit/context/constants";

import PageContainer from "@riptide/components/core/PageContainer";
import StoreInfoSection from "@riptide/components/storeInfo/StoreInfoSection";
import ProductFeed from "@riptide/components/productFeed/ProductFeed";

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" }; // TODO [lliepert]: query the top x merchants and pre-render their pages
};

export const getStaticProps: GetStaticProps<StorefrontState> = async ({
  params,
}) => {
  if (!params?.mid || typeof params.mid !== "string") {
    return {
      notFound: true,
    };
  }

  const { data, error, errors } = await client.query<
    StorefrontDataResponse,
    StorefrontDataParams
  >({
    query: STOREFRONT_DATA_QUERY,
    variables: {
      mid: params.mid,
    },
    errorPolicy: "all",
  });

  if (error) {
    Sentry.captureException(error);
    return { notFound: true };
  }
  if (errors) {
    Sentry.captureException(errors);
    return { notFound: true };
  }
  if (
    data == null ||
    !data.storefront.serviceEnabled ||
    !data.storefront.merchantEnabled
  ) {
    return { notFound: true };
  }

  const {
    name: storeName,
    creationDate: { formatted: merchantCreationDate },
    location: { code: cc, name },
    reviewSummary: { count: numReviews, averageRating },
    customization: { feeds: productFeeds },
  } = data.storefront.forMerchant;

  const props = {
    mid: params.mid,
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

const MerchantStorefront: NextPage<StorefrontState> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { storeName, productFeeds } = props;
  const styles = useStylesheet();
  const { i18n } = useLocalization();

  const Feeds = () => (
    <>
      {productFeeds.map(({ id, name }, i) => (
        <ProductFeed
          key={`${id}_${i}`}
          productsReq={() => fetchProductFeed({ fid: id })}
          name={name}
          style={styles.upperMargin}
          viewAllLink={`${WISH_URL}/collection/${id}`}
        />
      ))}
      <ProductFeed
        key={`allProducts`}
        productsReq={() => fetchAllProducts({ mid: props.mid })}
        name={i18n("All Products")}
        style={styles.upperMargin}
        viewAllLink={`${WISH_URL}/merchant/${props.mid}`}
      />
    </>
  );

  return (
    <StorefrontStateProvider state={props}>
      <Head>
        <title>{storeName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageContainer>
        <StoreInfoSection />
        <Feeds />
      </PageContainer>
    </StorefrontStateProvider>
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
