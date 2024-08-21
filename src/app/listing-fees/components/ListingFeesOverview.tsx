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
import { ci18n } from "@core/toolkit/i18n";
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
                flex: 2,
                height: 192,
                borderRight: "1px solid #DCDCDA",
                marginRight: 24,
                paddingRight: 24,
                alignContent: "space-between",
              }}
            >
              <Layout.FlexRow alignItems="center">
                <Text style={styles.title}>Active product listings</Text>
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
                    size={100}
                  ></CircularProgressSection>
                </Layout.FlexColumn>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Layout.FlexRow>
                    <Text>{ci18n("Active listings", "Active listings")}</Text>
                    <Tooltip
                      title={i`It can take a few days for recently disabled or new active listings to reflect in this count. `}
                      style={styles.overviewTooltip}
                    >
                      <Icon name="info" size={24} color={textBlack} />
                    </Tooltip>
                  </Layout.FlexRow>
                  <Text
                    style={[styles.overviewBigNumber, styles.marginBottom]}
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
                flex: 4,
                height: 192,
                marginRight: 24,
                paddingRight: 24,
                alignContent: "space-between",
              }}
            >
              <Layout.FlexRow>
                <Text style={styles.title}>
                  {ci18n("Listing fees", "Listing fees")}
                </Text>
              </Layout.FlexRow>
              <Layout.FlexRow
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Layout.FlexColumn
                  style={[styles.overviewText, styles.flexBasis]}
                >
                  <Text>Current listing fee</Text>
                  <Text style={styles.overviewBigNumber} weight="bold">
                    {store.currentCycleListingFeeDetails &&
                      formatCurrency(
                        store.currentCycleListingFeeDetails.currentFeeToPay
                          .amount,
                        store.currentCycleListingFeeDetails.currentFeeToPay
                          .currencyCode,
                      )}
                  </Text>
                  <Text style={[styles.feeText, styles.margin8Style]}>
                    Your Listing fees are based on any Active listings that
                    exceed your Free threshold within the Calculation period.
                  </Text>
                </Layout.FlexColumn>
                <Layout.FlexColumn
                  style={[
                    styles.overviewText,
                    styles.flexBasis,
                    styles.marginLeft,
                  ]}
                >
                  <Layout.FlexRow>
                    <Text>Max active listings</Text>
                    <Tooltip
                      title={i`We will deduct a listing fee from your account based on this number of active listings. `}
                      style={styles.overviewTooltip}
                    >
                      <Icon name="info" size={24} color={textBlack} />
                    </Tooltip>
                  </Layout.FlexRow>
                  {store.currentCycleListingFeeDetails && (
                    <div style={{ display: "flex" }}>
                      <Text style={styles.overviewNumber} weight="bold">
                        {store.currentCycleListingFeeDetails.currentPeakItems}
                      </Text>
                      <Text style={{ fontWeight: "normal", marginLeft: "5px" }}>
                        (
                        {
                          store.currentCycleListingFeeDetails.currentPeakTime
                            .formatted
                        }
                        )
                      </Text>
                    </div>
                  )}
                  <Text style={styles.margin8Style}>Fee amount per item</Text>
                  <Text style={styles.overviewNumber} weight="bold">
                    {store.currentCycleListingFeeDetails &&
                      formatCurrency(
                        store.currentCycleListingFeeDetails.currentUnitPrice
                          .amount,
                        store.currentCycleListingFeeDetails.currentUnitPrice
                          .currencyCode,
                      )}
                  </Text>
                  <Layout.FlexRow style={styles.margin8Style}>
                    <Text>{ci18n("Free threshold", "Free threshold")}</Text>
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
                    {!store.currentCycleListingFeeDetails?.isInWhitelist && (
                      <Illustration
                        name={tierThemes(currentLevel).icon}
                        alt={tierThemes(currentLevel).icon}
                        style={styles.badgeSmallIcon}
                      />
                    )}
                  </Layout.FlexRow>
                </Layout.FlexColumn>
                <Layout.FlexColumn style={styles.overviewText}>
                  <Layout.FlexRow>
                    <Text>
                      {ci18n("Calculation period", "Calculation period")}
                    </Text>
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
                    <Text>Next fee statement</Text>
                    <Tooltip
                      title={i`Fees are deducted on your next pay cycle.`}
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
              </Layout.FlexRow>
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
          height: 244,
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
        marginLeft: {
          marginLeft: "24px",
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
        flexBasis: { flex: 1 },
        feeText: {
          background: "rgba(239, 244, 246, 1)",
          borderRadius: "8px",
          padding: "17px",
          fontSize: 14,
          lineHeight: "20px",
        },
        overviewNumber: {
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "24px",
        },
        overviewBigNumber: {
          fontSize: 24,
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
        margin8Style: {
          marginTop: "8px",
        },
        body: {
          width: "100%",
          gap: 16,
        },
        line: { width: 0, height: 192, strokeWidth: 1, stroke: "#DCDCDA" },
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
