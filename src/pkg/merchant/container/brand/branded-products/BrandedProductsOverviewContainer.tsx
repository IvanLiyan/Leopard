import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatNumeral } from "@ContextLogic/lego/toolkit/string";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Merchant Components */
import Metric from "@merchant/component/brand/branded-products/overview/Metric";
import Section from "@merchant/component/brand/branded-products/overview/Section";
import BrandPerformanceOverview from "@merchant/component/brand/branded-products/overview/BrandPerformanceOverview";
import EmptyBrandPerformanceOverview from "@merchant/component/brand/branded-products/overview/EmptyBrandPerformanceOverview";

/* Merchant API */
import { getProductBrandDetectionInfoList } from "@merchant/api/brand/verify-brands";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { startApplicationLink } from "@toolkit/brand/branded-products/abs";
import { learnMoreZendesk, learnMoreZendeskCategory } from "@toolkit/url";
/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import {
  MerchantSchema,
  MerchantBrandSchema,
  Datetime,
  CurrencyValue,
} from "@schema/types";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

const GET_MERCHANT_BRAND_STATS = gql`
  query BrandedProductsOverviewContainer_GetMerchantBrandStats {
    currentMerchant {
      branding {
        brands {
          numProducts
          lifetimeStatsObject {
            cost {
              amount
            }
          }
        }
      }
    }
  }
`;

type MerchantBrand = Pick<MerchantBrandSchema, "numProducts"> & {
  readonly lifetimeStatsObject?: {
    readonly cost: Pick<CurrencyValue, "amount">;
  };
};

type ResponseType = {
  readonly currentMerchant: {
    readonly branding: {
      readonly brands: ReadonlyArray<MerchantBrand>;
    };
  };
};

type InitialData = {
  readonly currentMerchant: Pick<
    MerchantSchema,
    "primaryCurrency" | "isMerchantPlus" | "priceDropEnabled"
  > & {
    readonly branding: {
      readonly latestDateWithBrandData: Pick<Datetime, "unix">;
    };
  };
};

type BrandedProductsOverviewContainerProps = {
  readonly initialData: InitialData;
};

const BrandedProductsOverviewContainer = ({
  initialData,
}: BrandedProductsOverviewContainerProps) => {
  const styles = useStylesheet();

  /* Initial Data */
  const {
    currentMerchant: {
      primaryCurrency: currencyCode,
      branding: { latestDateWithBrandData },
      isMerchantPlus,
      priceDropEnabled,
    },
  } = initialData;

  const lastDayUnix = latestDateWithBrandData?.unix;

  /* Merchant Brand Stats */
  const { data: metricsData, loading: metricsDataLoading } = useQuery<
    ResponseType,
    void
  >(GET_MERCHANT_BRAND_STATS);
  const merchantBrands = metricsData?.currentMerchant.branding.brands;
  const numUniqueBrands = merchantBrands?.length || 0;
  const totalNumProducts =
    (merchantBrands &&
      _.sum(merchantBrands.map((brand) => brand.numProducts))) ||
    0;
  const totalLifetimeGmv =
    (merchantBrands &&
      _.sum(
        merchantBrands.map(
          (brand) => brand.lifetimeStatsObject?.cost.amount || 0
        )
      )) ||
    0;

  const totalLifetimeGmvString = formatCurrency(totalLifetimeGmv, currencyCode);
  const numUniqueBrandsString = formatNumeral(numUniqueBrands);
  const totalNumProductsString = formatNumeral(totalNumProducts);

  /* Pending Verification Products */
  const [response] = useRequest(
    getProductBrandDetectionInfoList({
      fetch_count_only: true,
    }).setOptions({
      failSilently: true,
    })
  );
  const totalnumPendingProducts = response?.data?.total_count || 0;
  const brandedProductPhrase = ni18n(
    totalnumPendingProducts,
    "1 Branded Product",
    "%1$s Branded Products"
  );

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Branded Products`}
        illustration="brandedProductsHeader"
      >
        <Markdown
          className={css(styles.welcomeText)}
          text={i`View your branded product performance and learn about tools to increase sales.`}
        />
        <LoadingIndicator loadingComplete={!metricsDataLoading}>
          <div className={css(styles.metricContainer)}>
            <Metric
              title={i`Lifetime Brand GMV`}
              value={totalLifetimeGmvString}
              className={css(styles.metric)}
            />
            <Metric
              title={i`Unique Brands`}
              value={numUniqueBrandsString}
              className={css(styles.metric)}
            />
            <Metric
              title={i`Your Branded Products`}
              value={totalNumProductsString}
              className={css(styles.metric)}
            />
          </div>
        </LoadingIndicator>
      </WelcomeHeader>
      <PageGuide>
        {totalnumPendingProducts > 0 && (
          <Section>
            <Section.Item
              titleText={i`${brandedProductPhrase} Pending Verification`}
              contentText={
                i`Help us verify your branded product listings. By correctly tagging` +
                i` your products, you can optimize your listings and maximize sales.`
              }
              buttonLink="/branded-products/verify-brands"
              buttonText={i`Verify your listings`}
              illustrationName="brandedProductVerificationSection"
            />
          </Section>
        )}
        {lastDayUnix ? (
          <BrandPerformanceOverview
            lastDayUnix={lastDayUnix}
            currencyCode={currencyCode}
            className={css(styles.section)}
          />
        ) : (
          <EmptyBrandPerformanceOverview className={css(styles.section)} />
        )}
        {!isMerchantPlus && (
          <Section header={i`Boost Performance with Marketing`}>
            <Section.Item
              titleText={i`ProductBoost`}
              contentText={
                i`Promote your branded products to the customers who are ` +
                i`most likely to buy them. ${learnMoreZendeskCategory(
                  "360000760934"
                )}`
              }
              buttonLink="/product-boost/v2/create"
              buttonText={i`Create a campaign`}
              illustrationName="productBoostSection"
            />
            {priceDropEnabled && (
              <Section.Item
                titleText={i`Price Drop`}
                contentText={
                  i`Attract customers with sales of your branded products by ` +
                  i`using Price Drop campaigns. ${learnMoreZendesk(
                    "360041691693"
                  )}`
                }
                buttonLink="/marketplace/price-drop/create-campaign"
                buttonText={i`Create a campaign`}
                illustrationName="priceDropSection"
              />
            )}
          </Section>
        )}
        <Section header={i`More Branded Product Features`}>
          <Section.Item
            titleText={i`Brand Directory`}
            contentText={
              i`Level up your brand knowledge or suggest ` +
              i`new brands for Wish’s Brand Directory.`
            }
            buttonLink="/branded-products/brand-directory"
            buttonText={i`Visit Brand Directory`}
            illustrationName="brandDirectorySection"
          />
          {!isMerchantPlus && (
            <Section.Item
              titleText={i`Are you a Brand Owner or Authorized Reseller?`}
              contentText={
                i`Receive more impressions by becoming an Authentic ` +
                i`Brand Seller. ${learnMoreZendesk("360050837853")}`
              }
              buttonLink={startApplicationLink()}
              buttonText={i`Apply`}
              illustrationName="absbSection"
            />
          )}
        </Section>
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        welcomeText: {
          fontSize: 16,
          color: textBlack,
          marginTop: 8,
          marginBottom: 20,
        },
        metricContainer: {
          display: "flex",
          flexDirection: "row",
        },
        metric: {
          marginRight: 80,
        },
        section: {
          marginTop: 24,
          marginBottom: 24,
        },
      }),
    [pageBackground, textBlack]
  );
};
export default observer(BrandedProductsOverviewContainer);
