import React, { useMemo, useEffect } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { useTheme } from "@core/stores/ThemeStore";
import { Button } from "@ContextLogic/atlas-ui";
import Image from "@core/components/Image";
import { css } from "@core/toolkit/styling";
import PageRoot from "@core/components/PageRoot";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import { zendeskURL } from "@core/toolkit/url";
/* Lego Components */
import { Layout, Text, LoadingIndicator } from "@ContextLogic/lego";
/* Model */
import { useQuery } from "@apollo/client";
import store, {
  MERCHANT_LISTING_FEE_DATA,
  MerchantListingFeeResponse,
} from "@listing-fees/toolkit";
import { ci18n } from "@core/toolkit/i18n";
import Link from "@deprecated/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
import ManageProductsSteps from "@listing-fees/components/ManageProductsSteps";
import FeeCalculationCard from "@listing-fees/components/FeeCalculationCard";
import ListingFeesSection from "@listing-fees/components/ListingFeesSection";
import ListingFeesOverview from "@listing-fees/components/ListingFeesOverview";
import commonStyles from "@performance-cn/styles/common.module.css";

const ListingFeesPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const learnMoreLink = zendeskURL("19882610247195");
  const { data, loading } = useQuery<MerchantListingFeeResponse>(
    MERCHANT_LISTING_FEE_DATA,
  );

  useEffect(() => {
    if (data) {
      store.updateListingFeesData(data);
      store.feeCalculationData(data);
    }
  }, [data]);

  return (
    <PageRoot style={styles.root}>
      <PageHeader
        title={i`Listing Fees`}
        relaxed
        illustration={() => (
          <Image
            src="/md/images/product-listing/listing_fees_banner.svg"
            alt={ci18n("alt text for an image", "product listing fees banner")}
            width={247}
            height={168}
          />
        )}
      >
        <Layout.FlexRow>
          <Text>
            View Listing Fees based on your number of active product listings
            and Wish Standards status.
          </Text>
          <Link
            href={learnMoreLink}
            underline
            openInNewTab
            style={{ marginLeft: 10 }}
          >
            Learn more
          </Link>
        </Layout.FlexRow>
      </PageHeader>
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <ListingFeesSection title={i`Overview`}>
          {loading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            <ListingFeesOverview></ListingFeesOverview>
          )}
        </ListingFeesSection>
        <ManageProductsSteps></ManageProductsSteps>
        <div className={css(styles.card)}>
          <Layout.FlexRow justifyContent="space-between">
            <Layout.FlexColumn>
              <Text style={styles.title} weight="bold">
                Learn more about your performance metrics
              </Text>
              <Text style={styles.marginButtom}>
                Check your product listings quantities, performance, and find
                ways to optimize your inventory
              </Text>
              <Button
                className={css(styles.metricsButton)}
                secondary
                href={merchFeUrl(`/md/performance`)}
              >
                View details
              </Button>
            </Layout.FlexColumn>
            <Image
              src="/md/images/product-listing/listing_fees_content.svg"
              alt={ci18n(
                "alt text for an image",
                "product listing fees content",
              )}
              width={246}
              height={150}
            />
          </Layout.FlexRow>
        </div>
        <ListingFeesSection title={i`Fee Calculation`}>
          {loading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            <Layout.GridRow
              templateColumns="repeat(4, 1fr)"
              smallScreenTemplateColumns="repeat(2, 1fr)"
              alignItems="flex-start"
              style={styles.body}
            >
              {store.feePolicyConfig.map((item) => (
                <FeeCalculationCard
                  key={item.wssTierName}
                  freeThreshold={item.freeThreshold}
                  feeAmount={item.excessItemUnitPrice.amount}
                  feeCurrency={item.excessItemUnitPrice.currencyCode}
                  level={store.levelText(item.wssTierLevel)}
                ></FeeCalculationCard>
              ))}
            </Layout.GridRow>
          )}
        </ListingFeesSection>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          background: "#fff",
        },
        section: {
          marginTop: 32,
        },
        title: {
          fontSize: 28,
          color: textBlack,
        },
        subtitle: {
          marginTop: 8,
        },
        card: {
          padding: 32,
          borderRadius: 8,
          with: "100%",
          height: 176,
          background: "#F7F7F5",
          marginTop: 65,
          marginBottom: 65,
        },
        metricsButton: {
          width: "113px",
          height: "40px",
          fontSize: "14px",
          color: "#0E161C",
          // paddingTop: "24px",
        },
        marginButtom: {
          marginBottom: 24,
        },
        body: {
          gap: 16,
        },
      }),
    [textBlack],
  );
};

export default observer(ListingFeesPage);
