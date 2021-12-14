/*
 * Dashboard.tsx
 *
 * Created by Jonah Dlin on Fri Jul 23 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import _ from "lodash";

/* Schema */
import { ProductListingPlanTier } from "@schema/types";

/* Toolkit */
import { css } from "@toolkit/styling";
import { useDateQueryParam } from "@toolkit/url";
import { BaseProps } from "@toolkit/api";
import { formatCurrency } from "@toolkit/currency";
import {
  formatPlpPercentage,
  MonthsAgoToShow,
  PercentSentiment,
  PlpInitialData,
  PlpTierNames,
  MonthNameMap,
  MonthNamePossessiveMap,
  PlpTiers,
  GET_PRODUCT_METRICS_SUMMARY,
  GetProductMetricsSummaryInputType,
  GetProductMetricsSummaryResponseType,
  getImpressionsSentiment,
  getSalesSentiment,
} from "@toolkit/products/product-listing-plan";

/* Lego Components */
import {
  FormSelect,
  Info,
  Layout,
  LoadingIndicator,
  Markdown,
  Option,
  Text,
} from "@ContextLogic/lego";

/* Components */
import BoxIconGroup from "./BoxIconGroup";
import ListingAmountCard from "./ListingAmountCard";
import PercentCard from "./PercentCard";
import BreakdownCard from "./BreakdownCard";
import { Icon } from "@merchant/component/core";
import ProductCountCard from "./ProductCountCard";

/* Stores */
import { useTheme } from "@stores/ThemeStore";
import { useQuery } from "@apollo/client";

type Props = BaseProps & {
  readonly initialData: PlpInitialData;
};

const Dashboard: React.FC<Props> = ({
  className,
  style,
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  const [inputStartDate, setInputStartDate] = useDateQueryParam("start_date", {
    format: "YYYY-MM-DD",
    defaultValue: new Date(),
  });

  const selectedValue: string | undefined = useMemo(() => {
    if (inputStartDate == null) {
      return;
    }
    const monthsAgo = moment
      .duration(moment().diff(moment(inputStartDate)))
      .months();
    const value = `${monthsAgo}`;
    return value;
  }, [inputStartDate]);

  const options: ReadonlyArray<Option<string>> = useMemo(() => {
    return [
      {
        value: `${0}`,
        text: i`Current`,
      },
      ..._.range(1, MonthsAgoToShow).map((monthsAgo): Option<string> => {
        const month = moment().startOf("month").subtract(monthsAgo, "months");
        return {
          value: `${monthsAgo}`,
          text: `${MonthNameMap[month.get("month")]} ${month.get("year")}`,
        };
      }),
    ];
  }, []);

  const isCurrent = useMemo(
    () => moment().isSame(moment(inputStartDate), "month"),
    [inputStartDate],
  );

  const monthName = useMemo(
    () =>
      isCurrent
        ? i`Current`
        : MonthNameMap[moment(inputStartDate).startOf("month").get("month")],
    [inputStartDate, isCurrent],
  );

  const monthNamePossessive = useMemo(
    () =>
      isCurrent
        ? i`Current`
        : MonthNamePossessiveMap[
            moment(inputStartDate).startOf("month").get("month")
          ],
    [inputStartDate, isCurrent],
  );

  const yearName = useMemo(
    () =>
      isCurrent
        ? undefined
        : moment(inputStartDate).startOf("month").get("year"),
    [inputStartDate, isCurrent],
  );

  const startUnix = useMemo(
    () =>
      isCurrent
        ? moment().subtract(60, "days").startOf("day").add(12, "hours").unix()
        : moment(inputStartDate).startOf("month").add(1, "day").unix(),
    [inputStartDate, isCurrent],
  );

  const endUnix = useMemo(
    () =>
      isCurrent
        ? moment().subtract(1, "day").startOf("day").add(12, "hours").unix()
        : moment(inputStartDate)
            .endOf("month")
            .startOf("day")
            .add(1, "day")
            .unix(),
    [inputStartDate, isCurrent],
  );

  const { data, loading } = useQuery<
    GetProductMetricsSummaryResponseType,
    GetProductMetricsSummaryInputType
  >(GET_PRODUCT_METRICS_SUMMARY, {
    variables: {
      startDate: { unix: startUnix },
      endDate: { unix: endUnix },
      billDate: { unix: isCurrent ? endUnix : startUnix },
    },
  });

  const tier: ProductListingPlanTier = useMemo(() => {
    if (
      data?.currentMerchant?.productListingPlan?.bill.priceBreakdownPerTier ==
      null
    ) {
      return "TIER_ONE";
    }
    const {
      currentMerchant: {
        productListingPlan: {
          bill: { priceBreakdownPerTier },
        },
      },
    } = data;
    const tier2Breakdown = priceBreakdownPerTier.find(
      ({ tier }) => tier == "TIER_TWO",
    );
    const tier3Breakdown = priceBreakdownPerTier.find(
      ({ tier }) => tier == "TIER_THREE",
    );
    if (tier3Breakdown != null && tier3Breakdown.productCount != 0) {
      return "TIER_THREE";
    }
    if (tier2Breakdown != null && tier2Breakdown.productCount != 0) {
      return "TIER_TWO";
    }
    return "TIER_ONE";
  }, [data]);

  const charge = useMemo(() => {
    if (
      data?.currentMerchant?.productListingPlan?.bill.priceBreakdownPerTier ==
      null
    ) {
      return;
    }
    const {
      currentMerchant: {
        productListingPlan: {
          bill: { priceBreakdownPerTier },
        },
      },
    } = data;
    if (priceBreakdownPerTier.length == 0) {
      return;
    }
    const {
      [0]: {
        price: { currencyCode: cc },
      },
    } = priceBreakdownPerTier;
    return formatCurrency(
      priceBreakdownPerTier.reduce(
        (acc, { price: { amount } }) => acc + amount,
        0,
      ),
      cc,
    );
  }, [data]);

  const rawTiers = useMemo((): PlpTiers | undefined => {
    const {
      platformConstants: { productListing },
    } = initialData;
    const tier1 = productListing.find(({ tier }) => tier === "TIER_ONE");
    const tier2 = productListing.find(({ tier }) => tier === "TIER_TWO");
    const tier3 = productListing.find(({ tier }) => tier === "TIER_THREE");
    if (tier1 == null || tier2 == null || tier3 == null) {
      return;
    }
    return { tier1, tier2, tier3 };
  }, [initialData]);

  if (loading) {
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }

  if (rawTiers == null || data?.currentMerchant?.productListingPlan == null) {
    return null;
  }

  const {
    currentMerchant: { productListingPlan },
  } = data;

  const { tier1, tier2, tier3 } = rawTiers;

  const currentProductMax = productListingPlan.bill.currentProductMax;
  const latestListingAmount =
    productListingPlan.bill.productMetrics?.totalProduct;
  const totalProductWithSale =
    productListingPlan.bill.productMetrics?.totalProductWithSale;
  const totalProductWithImpression =
    productListingPlan.bill.productMetrics?.totalProductWithImpression;
  const lastUpdatedDisplay =
    productListingPlan.bill.productMetrics?.date.formatted;
  const salesAverage =
    productListingPlan.bill.productMetricsBenchmark?.avgSaleRatio == null
      ? undefined
      : productListingPlan.bill.productMetricsBenchmark?.avgSaleRatio * 100;
  const salesPercent =
    totalProductWithSale == null ||
    currentProductMax == null ||
    currentProductMax == 0
      ? undefined
      : (100 * totalProductWithSale) / currentProductMax;
  const impressionsAverage =
    productListingPlan.bill.productMetricsBenchmark?.avgImpressionRatio == null
      ? undefined
      : productListingPlan.bill.productMetricsBenchmark?.avgImpressionRatio *
        100;
  const impressionsPercent =
    totalProductWithImpression == null ||
    currentProductMax == null ||
    currentProductMax == 0
      ? undefined
      : (100 * totalProductWithImpression) / currentProductMax;
  const priceBreakdownPerTier = productListingPlan.bill.priceBreakdownPerTier;

  const getSalesComparisonString = ({
    percent,
    sentiment,
  }: {
    readonly percent?: string | null;
    readonly sentiment: PercentSentiment;
  }): string | null => {
    if (percent == null) {
      return null;
    }
    const salesStrings: { readonly [T in PercentSentiment]: string } = {
      BETTER: i`${percent}% active listings with sales is generally higher than other merchants.`,
      NORMAL: i`${percent}% active listings with sales is generally similar to other merchants.`,
      WORSE: i`${percent}% active listings with sales is generally lower than other merchants.`,
    };
    return salesStrings[sentiment];
  };

  const getImpressionsComparisonString = ({
    percent,
    sentiment,
  }: {
    readonly percent?: string | null;
    readonly sentiment: PercentSentiment;
  }): string | null => {
    if (percent == null) {
      return null;
    }
    const salesStrings: { readonly [T in PercentSentiment]: string } = {
      BETTER: i`${percent}% active listings with impressions is generally higher than other merchants.`,
      NORMAL: i`${percent}% active listings with impressions is generally similar to other merchants.`,
      WORSE: i`${percent}% active listings with impressions is generally lower than other merchants.`,
    };
    return salesStrings[sentiment];
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexRow style={styles.controlRow} justifyContent="space-between">
        <Layout.FlexRow>
          <Text style={styles.pageTitle} weight="semibold">
            {monthNamePossessive} Product Listing Plan:
          </Text>
          <Text style={styles.tierText} weight="semibold">
            {PlpTierNames[tier]}
          </Text>
          <BoxIconGroup
            size={20}
            className={css(styles.boxIconGroup)}
            tier={tier}
          />
        </Layout.FlexRow>
        <FormSelect
          options={options}
          selectedValue={selectedValue}
          onSelected={(monthsAgo: string) => {
            setInputStartDate(
              moment()
                .startOf("month")
                .subtract(parseInt(monthsAgo), "months")
                .toDate(),
            );
          }}
        />
      </Layout.FlexRow>
      <Text style={styles.title} weight="semibold">
        Listing tracker
      </Text>
      <Text style={[styles.subtitle, styles.subtitleMargin]}>
        Our product listing plan helps your business perform better, by
        providing intelligence insigths on your listing performance
      </Text>
      <Layout.FlexRow style={styles.verticalCardPadding} alignItems="stretch">
        <ListingAmountCard
          className={css(
            styles.horizontalCardPadding,
            styles.listingAmountCard,
          )}
          title={
            isCurrent
              ? i`Current number of active listings`
              : i`Product Listings by End of ${monthName}`
          }
          amount={latestListingAmount}
        />
        <ListingAmountCard
          className={css(
            styles.horizontalCardPadding,
            styles.listingAmountCard,
          )}
          title={
            isCurrent
              ? i`Current month maximum number of active listings`
              : i`${`${monthName} ${yearName}`} maximum number of active listings`
          }
          amount={currentProductMax}
        />
      </Layout.FlexRow>
      <ProductCountCard
        className={css(styles.verticalCardPadding)}
        data={data?.currentMerchant?.productListingPlan.productTotal}
        isCurrent={isCurrent}
        monthName={monthName}
        yearName={yearName == null ? undefined : `${yearName}`}
      />
      <Layout.FlexRow
        style={[styles.verticalCardPadding, styles.sectionVerticalPadding]}
        alignItems="stretch"
      >
        <Layout.FlexColumn
          style={[styles.percentCardContainer, styles.horizontalCardPadding]}
          alignItems="stretch"
        >
          <PercentCard
            className={css(styles.percentCard)}
            title={
              isCurrent
                ? i`% Current month listings with sales`
                : // nested string is needed otherwise space " " disappears
                  i`% ${`${monthName} ${yearName}`} listings with sales`
            }
            icon="dollar"
            amount={totalProductWithSale}
            total={currentProductMax}
            buttonText={i`View Order History`}
            buttonHref="/transactions/history"
          >
            <Text style={styles.text}>
              {getSalesComparisonString({
                percent:
                  salesPercent == null
                    ? undefined
                    : formatPlpPercentage(salesPercent),
                sentiment: getSalesSentiment({
                  average: salesAverage,
                  percent: salesPercent,
                }),
              })}
            </Text>
          </PercentCard>
          {lastUpdatedDisplay != null && (
            <Layout.FlexRow style={styles.lastUpdatedSection}>
              <Markdown
                style={styles.lastUpdatedText}
                text={i`last updated: **${lastUpdatedDisplay}**`}
              />
              <Info
                style={styles.lastUpdatedInfo}
                size={16}
                text={
                  i`Current month listings with sales percentage is ` +
                  i`updated every ${1}-${3} days so the information may be ` +
                  i`out of date.`
                }
              />
            </Layout.FlexRow>
          )}
        </Layout.FlexColumn>
        <Layout.FlexColumn
          style={[styles.percentCardContainer, styles.horizontalCardPadding]}
          alignItems="stretch"
        >
          <PercentCard
            className={css(styles.percentCard)}
            title={
              isCurrent
                ? i`% Current month listings with impressions`
                : // nested string is needed otherwise space " " disappears
                  i`% ${`${monthName} ${yearName}`} listings with impressions`
            }
            icon="receipt"
            amount={totalProductWithImpression}
            total={currentProductMax}
            buttonText={i`Explore ProductBoost`}
            buttonHref="/product-boost"
          >
            <Layout.FlexColumn>
              <Text style={styles.text}>
                {getImpressionsComparisonString({
                  percent:
                    impressionsPercent == null
                      ? undefined
                      : formatPlpPercentage(impressionsPercent),
                  sentiment: getImpressionsSentiment({
                    average: impressionsAverage,
                    percent: impressionsPercent,
                  }),
                })}
              </Text>
              <Layout.FlexRow
                alignItems="center"
                style={styles.impressionsCardFooter}
              >
                <Icon color={textDark} name="productBoost" size={20} />
                <Text
                  style={styles.impressionsCardFooterText}
                  weight="semibold"
                >
                  Create a ProductBoost campaign now to further increase your
                  products' exposure.
                </Text>
              </Layout.FlexRow>
            </Layout.FlexColumn>
          </PercentCard>
          {lastUpdatedDisplay != null && (
            <Layout.FlexRow style={styles.lastUpdatedSection}>
              <Markdown
                style={styles.lastUpdatedText}
                text={i`last updated: **${lastUpdatedDisplay}**`}
              />
              <Info
                style={styles.lastUpdatedInfo}
                size={16}
                text={
                  i`Current month listings with impressions percentage is ` +
                  i`updated every ${1}-${3} days so the information may be ` +
                  i`out of date.`
                }
              />
            </Layout.FlexRow>
          )}
        </Layout.FlexColumn>
      </Layout.FlexRow>

      <Text style={[styles.title, styles.titleMargin]} weight="semibold">
        {isCurrent
          ? i`Current month listing fee`
          : // nested string is needed otherwise space " " disappears
            i`${`${monthName} ${yearName}`} listing fee`}
      </Text>
      <BreakdownCard
        tiers={{ tier1, tier2, tier3 }}
        productCount={currentProductMax}
        priceBreakdownPerTier={priceBreakdownPerTier}
        charge={charge}
      />
    </Layout.FlexColumn>
  );
};

export default observer(Dashboard);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pageTitle: {
          fontSize: 24,
          lineHeight: "28px",
          color: textBlack,
        },
        tierText: {
          fontSize: 24,
          lineHeight: "28px",
          color: textDark,
          marginLeft: 8,
        },
        boxIconGroup: {
          marginLeft: 8,
        },
        loadingIndicator: {
          marginTop: 16,
        },
        controlRow: {
          marginBottom: 40,
        },
        title: {
          fontSize: 20,
          lineHeight: "24px",
          color: textDark,
        },
        titleMargin: {
          marginBottom: 16,
        },
        subtitle: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        subtitleMargin: {
          margin: "8px 0px 16px 0px",
        },
        text: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        verticalCardPadding: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        horizontalCardPadding: {
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        sectionVerticalPadding: {
          marginBottom: 48,
        },
        listingAmountCard: {
          flex: 1,
        },
        percentCardContainer: {
          flex: 1,
        },
        percentCard: {
          flex: 1,
        },
        lastUpdatedSection: {
          marginTop: 8,
          alignSelf: "flex-end",
        },
        lastUpdatedText: {
          fontSize: 12,
          lineHeight: "16px",
          color: textDark,
        },
        lastUpdatedInfo: {
          marginLeft: 4,
        },
        impressionsCardFooter: {
          marginTop: 24,
        },
        impressionsCardFooterText: {
          fontSize: 12,
          lineHeight: "16px",
          color: textDark,
          marginLeft: 8,
          flex: 1,
        },
      }),
    [textDark, textBlack],
  );
};
