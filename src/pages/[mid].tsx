import { useMemo } from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { StyleSheet } from "aphrodite";

import Text from "@riptide/components/core/Text";
import StorefrontBackground from "@riptide/components/StorefrontBackground";
import StoreInfoSection from "@riptide/components/storeInfo/StoreInfoSection";
import PromotionsSection from "@riptide/components/promotions/PromotionsSection";
import CuratedProductsSection from "@riptide/components/curatedProducts/CuratedProductsSection";
import HighestRatedProductsSection from "@riptide/components/highestRatedProducts/HighestRatedProductsSection";

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" }; // TODO [lliepert]: query the top x merchants and pre-render their pages
};

type SellerTags = "WISH_EXPRESS" | "VERIFIED_SELLER";
type CountryCode = "CN";

type Props = {
  readonly sellerSince: number;
  readonly location: {
    readonly cc: CountryCode;
    readonly formatted: string;
  };
  readonly refundRate: number;
  readonly storeName: string;
  readonly tags: ReadonlyArray<SellerTags>;
  readonly storeDescription: string;
  readonly numReviews: number;
  readonly isFollowing: boolean;
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  if (!params?.mid || params.mid == "404me") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const props: Props = {
    sellerSince: 2016,
    location: {
      cc: "CN",
      formatted: "China",
    },
    refundRate: 0.2,
    storeName: `${params.mid as string}Super Nintendo Sega Genesis`,
    tags: ["WISH_EXPRESS", "VERIFIED_SELLER"],
    storeDescription:
      "Quidem mollitia sit porro corrupti nihil facere. Voluptas necessitatibus repudiandae.",
    numReviews: 1839,
    isFollowing: false,
  };

  return {
    props,
    revalidate: 60, // regenerate the page every 60 seconds using ISR (see: https://vercel.com/docs/next.js/incremental-static-regeneration)
  };
};

const MerchantStorefront: NextPage<Props> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { storeName } = props;
  const styles = useStylesheet();

  return (
    <>
      <Head>
        <title>{storeName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <StorefrontBackground colorA="teal" colorB="darkslateblue" deg={130}>
        <StoreInfoSection {...props} style={styles.infoCard} />
        <PromotionsSection style={styles.promotionsSection} />
        <CuratedProductsSection style={styles.cardsSection} />
        <HighestRatedProductsSection style={styles.cardsSection} />
        <Text
          fontSize={10}
          fontWeight="MEDIUM"
          color="LIGHT"
          style={styles.footer}
        >
          &copy; Wish 2021
        </Text>
      </StorefrontBackground>
    </>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        infoCard: {
          margin: "34px 8px",
        },
        promotionsSection: {
          margin: "32px 16px",
        },
        cardsSection: {
          margin: "32px 0px 32px 16px",
        },
        footer: {
          textAlign: "end",
          padding: 8,
        },
      }),
    [],
  );
export default MerchantStorefront;
