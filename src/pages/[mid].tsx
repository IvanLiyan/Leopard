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
import { fetchAllProducts, fetchProductFeed } from "@toolkit/rest-api";
import {
  StorefrontState,
  StorefrontStateProvider,
} from "@toolkit/context/storefront-state";

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
    customization: { feeds },
  } = data.storefront.forMerchant;

  const serverSideProductFeeds = [];

  for (const { id: fid, name } of feeds) {
    const feedProducts = await fetchProductFeed({ fid });
    serverSideProductFeeds.push({
      name,
      products: feedProducts,
    });
  }

  const allProducts = await fetchAllProducts({ mid: params.mid });

  // TODO [lliepert]: server side mock of i18n, only used for string extraction.
  // product feeds code will be moved client side once cookies are fixed
  const i18n = (s: string) => s;

  serverSideProductFeeds.push({
    name: i18n("All products"),
    products: allProducts,
  });

  const props = {
    storeName,
    merchantCreationDate,
    location: {
      cc,
      name,
    },
    numReviews,
    averageRating,
    productFeeds: [],
    serverSideProductFeeds,
  };

  return {
    props,
    revalidate: 60, // regenerate the page every 60 seconds using ISR (see: https://vercel.com/docs/next.js/incremental-static-regeneration)
  };
};

const MerchantStorefront: NextPage<StorefrontState> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { storeName, productFeeds, serverSideProductFeeds } = props;
  const styles = useStylesheet();

  const Feeds = () => (
    <>
      {productFeeds.map(({ id, name }, i) => (
        <ProductFeed
          key={`${id}_${i}`}
          id={id}
          name={name}
          style={styles.upperMargin}
        />
      ))}
      {serverSideProductFeeds.map(({ name, products }, i) => (
        <ProductFeed
          key={`${name}_${i}`}
          name={name}
          products={products}
          style={styles.upperMargin}
        />
      ))}
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
