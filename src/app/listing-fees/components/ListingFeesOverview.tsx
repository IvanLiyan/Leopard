import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { Tooltip } from "@mui/material";
import { StyleSheet } from "aphrodite";
import { Card, Layout, Text } from "@ContextLogic/lego";
import { Icon } from "src/app/performance-cn/components";
import { useTheme } from "@core/stores/ThemeStore";
import Link from "@deprecated/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
import { formatCurrency } from "@core/toolkit/currency";
import { WssMerchantLevelType } from "@schema";
import store from "@listing-fees/toolkit";
import Illustration from "@core/components/Illustration";
import { useTierThemes } from "@performance/migrated/toolkit/stats";
import CircularProgressSection from "@listing-fees/components/CircularProgress";

const ListingFeesOverview: React.FC = () => {
  const { textBlack } = useTheme();
  const styles = useStylesheet();
  const tierThemes = useTierThemes();
  const currentLevel: WssMerchantLevelType | null = store.levelText(
    store.currentCycleListingFeeDetails?.currentBasedWssTierLevel,
  );

  return (
    <Layout.FlexRow style={styles.body}>
      <Layout.FlexColumn style={{ flex: 2 }}>
        <Card style={styles.card}>
          <Layout.FlexRow>
            <div
              style={{
                flex: 5,
                height: 180,
                borderRight: "1px solid #DCDCDA",
                marginRight: 24,
                paddingRight: 24,
                alignContent: "space-between",
              }}
            >
              <Layout.FlexRow alignItems="center">
                <Text style={styles.title}>Current listing</Text>
              </Layout.FlexRow>
              <Layout.FlexRow justifyContent="space-between">
                <Layout.FlexColumn style={{ marginRight: 50 }}>
                  <CircularProgressSection
                    currentCount={
                      store.latestListingFeeDetails?.latestItems || 0
                    }
                    freeCount={
                      store.currentCycleListingFeeDetails
                        ?.currentFreeThreshold || 0
                    }
                    size={120}
                  ></CircularProgressSection>
                </Layout.FlexColumn>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Layout.FlexRow>
                    <Text>Current items</Text>
                    <Tooltip
                      title={i`The number of items in your inventory is calculated daily. `}
                      style={styles.overviewTooltip}
                    >
                      <Icon name="info" size={24} color={textBlack} />
                    </Tooltip>
                  </Layout.FlexRow>
                  <Text
                    style={[styles.overviewNumber, styles.marginBottom]}
                    weight="bold"
                  >
                    {store.latestListingFeeDetails?.latestItems || 0}
                  </Text>
                  <Link
                    href={merchFeUrl(`/md/products`)}
                    style={styles.linkText}
                    underline
                    openInNewTab
                  >
                    View product listings
                  </Link>
                </Layout.FlexColumn>
              </Layout.FlexRow>
            </div>
            <div
              style={{
                flex: 5,
                height: 180,
                borderRight: "1px solid #DCDCDA",
                marginRight: 24,
                paddingRight: 24,
                alignContent: "space-between",
              }}
            >
              <Layout.FlexRow>
                <Text style={styles.title}>Listing fee</Text>
              </Layout.FlexRow>
              <Layout.FlexRow justifyContent="space-between">
                <Layout.FlexColumn style={styles.overviewText}>
                  <Text>Current listing fee</Text>
                  <Text style={styles.overviewNumber} weight="bold">
                    {store.currentCycleListingFeeDetails &&
                      formatCurrency(
                        store.currentCycleListingFeeDetails.currentFeeToPay
                          .amount,
                        store.currentCycleListingFeeDetails.currentFeeToPay
                          .currencyCode,
                      )}
                  </Text>
                  <Text style={{ marginTop: 24 }}>Fee amount per item</Text>
                  <Text style={styles.overviewNumber} weight="bold">
                    {store.currentCycleListingFeeDetails &&
                      formatCurrency(
                        store.currentCycleListingFeeDetails.currentUnitPrice
                          .amount,
                        store.currentCycleListingFeeDetails.currentUnitPrice
                          .currencyCode,
                      )}
                  </Text>
                </Layout.FlexColumn>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Layout.FlexRow>
                    <Text>Free threshold</Text>
                    <Tooltip
                      title={i`Your free threshold is based on your highest Wish Standards tier within the last 90 days.`}
                      style={styles.overviewTooltip}
                    >
                      <Icon name="info" size={24} color={textBlack} />
                    </Tooltip>
                  </Layout.FlexRow>
                  <Layout.FlexRow>
                    <Text style={styles.overviewNumber} weight="bold">
                      {
                        store.currentCycleListingFeeDetails
                          ?.currentFreeThreshold
                      }
                    </Text>
                    <Illustration
                      name={tierThemes(currentLevel).icon}
                      alt={tierThemes(currentLevel).icon}
                      style={styles.badgeSmallIcon}
                    />
                  </Layout.FlexRow>
                  <Layout.FlexRow style={{ marginTop: 24 }}>
                    {store.currentCycleListingFeeDetails && (
                      <>
                        <Text>Max listings</Text>
                        <Text>
                          (
                          {
                            store.currentCycleListingFeeDetails.currentPeakTime
                              .formatted
                          }
                          )
                        </Text>
                      </>
                    )}
                    <Tooltip
                      title={i`The max number of items used to determine your listing fee.`}
                      style={styles.overviewTooltip}
                    >
                      <Icon name="info" size={24} color={textBlack} />
                    </Tooltip>
                  </Layout.FlexRow>
                  <Text style={styles.overviewNumber} weight="bold">
                    {store.currentCycleListingFeeDetails?.currentPeakItems}
                  </Text>
                </Layout.FlexColumn>
              </Layout.FlexRow>
            </div>
            <div
              style={{ flex: 3, height: 180, alignContent: "space-between" }}
            >
              <Layout.FlexRow>
                <Text style={styles.title}>Listing fee schedule</Text>
              </Layout.FlexRow>
              <Layout.FlexColumn style={styles.overviewText}>
                <Layout.FlexRow>
                  <Text>Calculation period</Text>
                  <Tooltip
                    title={i`The listing fee is calculated on a monthly cadence.`}
                    style={styles.overviewTooltip}
                  >
                    <Icon name="info" size={24} color={textBlack} />
                  </Tooltip>
                </Layout.FlexRow>
                <Text>
                  {
                    store.currentCycleListingFeeDetails?.currentCycleStartTime
                      .formatted
                  }
                  -
                  {
                    store.currentCycleListingFeeDetails?.currentCycleEndTime
                      .formatted
                  }
                </Text>
                <Layout.FlexRow style={{ marginTop: 24 }}>
                  <Text>Next charge date</Text>
                  <Tooltip
                    title={i`Listing fee charges may take a few days to process. `}
                    style={styles.overviewTooltip}
                  >
                    <Icon name="info" size={24} color={textBlack} />
                  </Tooltip>
                </Layout.FlexRow>
                <Text>
                  {
                    store.currentCycleListingFeeDetails?.currentCyclePayTime
                      .formatted
                  }
                </Text>
              </Layout.FlexColumn>
            </div>
          </Layout.FlexRow>
        </Card>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

export default observer(ListingFeesOverview);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          boxSizing: "border-box",
          height: 230,
          fontSize: 28,
          color: textBlack,
          padding: 24,
          borderRadius: 4,
          border: "1px solid #DCE5E9",
          marginBottom: 42,
        },
        badgeSmallIcon: {
          height: 24,
          marginLeft: 4,
        },
        badgeIcon: {
          height: 48,
          marginRight: 4,
        },
        badgeTitle: {
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 700,
        },
        overviewNumber: {
          fontSize: 20,
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "24px",
        },
        title: {
          fontFamily: "ABC Ginto Nord",
          fontSize: 16,
          fontWeight: 700,
          color: "#0E161C",
          marginRight: 10,
          lineHeight: "20px",
          marginBottom: 16,
        },
        overviewText: {
          fontSize: 16,
          color: "#000",
          fontWeight: 400,
          lineHeight: "24px",
        },
        overviewTooltip: {
          display: "flex",
          alignItems: "center",
          marginLeft: 10,
        },
        marginTop: {
          fontSize: 16,
          color: textBlack,
          fontWeight: 400,
          marginTop: 16,
        },
        marginBottom: {
          marginBottom: 16,
        },
        body: {
          width: "100%",
          gap: 16,
        },
        line: { width: 0, height: 180, strokeWidth: 1, stroke: "#DCDCDA" },
        linkText: {
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 500,
          letterSpacing: 0.08,
          textDecorationLine: "underline",
          color: "#0E161C",
        },
        greyCard: {
          padding: "8px 16px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          background: "#F7F7F5",
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          marginBottom: "12px",
        },
      }),
    [textBlack],
  );
};
