import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { Tooltip } from "@mui/material";
import { StyleSheet } from "aphrodite";
import { Card, Layout, Text } from "@ContextLogic/lego";
import { Icon } from "src/app/performance-cn/components";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
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
  const lastestLevel: WssMerchantLevelType | null = store.levelText(
    store.predictedListingFeeDetails?.latestWssTierLevel,
  );

  const wssTierText = useMemo(() => {
    const currentLevelNumber =
      store.currentCycleListingFeeDetails?.currentBasedWssTierLevel;
    const lastestLevelNumber =
      store.predictedListingFeeDetails?.latestWssTierLevel;
    if (
      currentLevelNumber &&
      lastestLevelNumber &&
      currentLevelNumber > 0 &&
      lastestLevelNumber > 0
    ) {
      if (currentLevelNumber === lastestLevelNumber) {
        return i`Based on your current tier, there are no changes to your free items threshold.`;
      } else if (currentLevelNumber > lastestLevelNumber) {
        return (
          i`Based on your current tier, your free  items threshold may decrease to ${store.predictedListingFeeDetails?.predictedFreeThreshold} in ` +
          ` ${store.predictedListingFeeDetails?.nextUpdateDate.formatted}`
        );
      } else if (currentLevelNumber < lastestLevelNumber) {
        return (
          `Based on your current tier, your free  items threshold may increase to ${store.predictedListingFeeDetails?.predictedFreeThreshold} in ` +
          ` ${store.predictedListingFeeDetails?.nextUpdateDate.formatted}`
        );
      } else {
        return "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentCycleListingFeeDetails, store.predictedListingFeeDetails]);

  return (
    <Layout.FlexRow style={styles.body}>
      <Layout.FlexColumn style={{ flex: 2 }}>
        <Card style={styles.card}>
          <Layout.FlexRow>
            <div
              style={{
                flex: 1,
                height: 180,
                borderRight: "1px solid #DCDCDA",
                marginRight: 24,
                paddingRight: 24,
                alignContent: "space-between",
              }}
            >
              <Layout.FlexRow alignItems="center">
                <Text style={styles.title}>Product listed</Text>
                <Tooltip
                  title={
                    <div style={{ fontSize: "14px" }}>
                      Average time from order placed to the time that you marked
                      the order shipped
                    </div>
                  }
                >
                  <Icon name="info" size={20} color={textBlack} />
                </Tooltip>
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
                  ></CircularProgressSection>
                </Layout.FlexColumn>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Text>Current items</Text>
                  <Text weight="bold" style={{ marginBottom: 16 }}>
                    {store.latestListingFeeDetails?.latestItems || 0}
                  </Text>
                  <Text>Free items</Text>
                  <Layout.FlexRow>
                    <Text weight="bold">
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
                </Layout.FlexColumn>
              </Layout.FlexRow>
              <Link
                href={merchFeUrl(`/md/products`)}
                style={styles.linkText}
                underline
                openInNewTab
              >
                View product listings
              </Link>
            </div>
            <div
              style={{ flex: 1, height: 180, alignContent: "space-between" }}
            >
              <Layout.FlexRow>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Text style={styles.title}>Wish Standards tier</Text>
                  <Layout.FlexRow
                    alignItems="center"
                    style={{ marginBottom: 24 }}
                  >
                    <Illustration
                      name={tierThemes(lastestLevel).icon}
                      alt={tierThemes(lastestLevel).icon}
                      style={styles.badgeIcon}
                    />
                    <Text style={styles.badgeTitle} weight="bold">
                      {tierThemes(lastestLevel).title}
                    </Text>
                  </Layout.FlexRow>
                  <div className={css(styles.greyCard)}>{wssTierText}</div>
                  <Link
                    href={merchFeUrl(`/md/performance?tab=wish-standards`)}
                    style={styles.linkText}
                    underline
                    openInNewTab
                  >
                    View Wish Standards
                  </Link>
                </Layout.FlexColumn>
              </Layout.FlexRow>
            </div>
          </Layout.FlexRow>
        </Card>
      </Layout.FlexColumn>
      <Layout.FlexColumn style={{ flex: 1 }}>
        <Card style={styles.card}>
          <Layout.FlexRow justifyContent="space-around">
            <Layout.FlexColumn
              style={{ flex: 1, alignContent: "space-between" }}
            >
              <Text style={styles.title}>Listing fee</Text>
              <Text
                style={{
                  fontSize: 34,
                  alignItems: "flex-start",
                  height: "120px",
                }}
                weight="bold"
              >
                {store.currentCycleListingFeeDetails &&
                  formatCurrency(
                    store.currentCycleListingFeeDetails.currentFeeToPay.amount,
                    store.currentCycleListingFeeDetails.currentFeeToPay
                      .currencyCode,
                  )}
              </Text>
              <Link
                href={merchFeUrl(`/md/learn-more`)}
                style={styles.linkText}
                underline
                openInNewTab
              >
                Learn more
              </Link>
            </Layout.FlexColumn>
            <Layout.FlexColumn style={styles.overviewText}>
              <Text>Next charge date</Text>
              <Text style={{ marginBottom: 16 }}>
                {
                  store.currentCycleListingFeeDetails?.currentCyclePayTime
                    .formatted
                }
              </Text>
              <Text>Fee amount per item</Text>
              <Text style={{ marginBottom: 16 }}>
                {store.currentCycleListingFeeDetails &&
                  formatCurrency(
                    store.currentCycleListingFeeDetails.currentUnitPrice.amount,
                    store.currentCycleListingFeeDetails.currentUnitPrice
                      .currencyCode,
                  )}
              </Text>
              <Text>Items charged</Text>
              <Text>
                {store.currentCycleListingFeeDetails?.currentItemsOverThreshold}
              </Text>
            </Layout.FlexColumn>
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
        overviewTitle: {
          fontFamily: "ABC Ginto Normal",
          fontSize: 20,
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: 24,
        },
        title: {
          fontFamily: "ABC Ginto Normal",
          fontSize: 20,
          fontWeight: 700,
          color: textBlack,
          marginRight: 10,
        },
        overviewText: {
          fontSize: 16,
          color: "#000",
          fontWeight: 400,
        },
        marginTop: {
          fontSize: 16,
          color: textBlack,
          fontWeight: 400,
          marginTop: 16,
        },
        body: {
          width: "100%",
          gap: 16,
        },
        line: { width: 0, height: 180, strokeWidth: 1, stroke: "#DCDCDA" },
        linkText: {
          fontFamily: "ABC Ginto Normal",
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
