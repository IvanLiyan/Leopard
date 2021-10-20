import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
/* Lego Components */
import { LoadingIndicator, Markdown, PrimaryButton } from "@ContextLogic/lego";
/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
/* Toolkit */
import { useRequest } from "@toolkit/api";
import { zendeskURL } from "@toolkit/url";
/* Stores */
import { useTheme } from "@stores/ThemeStore";
/* Merchant Components */
import BudgetBreakDownTable from "@merchant/component/product-boost/BudgetBreakDownTable";
import ProductBoostHeader from "@merchant/component/product-boost/ProductBoostHeader";
import ProductBoostBanner from "@merchant/component/product-boost/ProductBoostBanner";
/* Merchant Store */
import DeviceStore from "@stores/DeviceStore";
/* Merchant API */
import {
  BannerLocation,
  BannerType,
  getBannerInfo,
  GetMerchantSpendingStatsResponse,
} from "@merchant/api/product-boost";

import { MaxSpendingBreakdown } from "@merchant/model/product-boost/Campaign";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ListCampaignsPageHeaderProps = BaseProps & {
  readonly response: GetMerchantSpendingStatsResponse | null | undefined;
  readonly campaignCount: number;
};

const ListCampaignsPageHeader = (props: ListCampaignsPageHeaderProps) => {
  const { isSmallScreen, pageGuideXForPageWithTable } = DeviceStore.instance();
  const pageX = pageGuideXForPageWithTable;

  const styles = useStyleSheet(pageX, isSmallScreen);
  const { response } = props;
  const [bannerInfoResponse] = useRequest(getBannerInfo());
  if (!response) {
    return <LoadingIndicator style={{ minHeight: 215 }} />;
  }

  const { campaignCount } = props;

  const maxSpendingBreakdown: MaxSpendingBreakdown =
    response?.max_spending_breakdown || {
      balance: 0,
      bonus: 0,
      current_unpaid: 0,
      product_boost_balance: 0,
      bonus_reason: 0,
      is_payable: false,
      max_spending: 0,
      currency: "USD",
    };
  const maxAllowedSpending = response?.max_allowed_spending || 0;
  const isPayable = response?.is_payable || false;
  const { currency: currencyCode } = maxSpendingBreakdown;

  const statsColumns = [
    {
      columnTitle: i`Total campaigns`,
      columnStats: `${campaignCount}`,
    },
    {
      columnTitle: i`Your maximum budget`,
      columnStats: `${formatCurrency(maxAllowedSpending, currencyCode)}`,
      popoverContent: () => {
        return (
          <div className={css(styles.popoverContent)}>
            <BudgetBreakDownTable
              maxAllowedSpending={maxAllowedSpending}
              maxSpendingBreakdown={maxSpendingBreakdown}
              isPayable={isPayable}
              expended
              hideInfoButton
            />
          </div>
        );
      },
    },
  ];

  const shouldDisplayFBWPromotion =
    bannerInfoResponse?.data?.fbw_promotion_display || false;
  const shouldDisplayRefundAssuranceBanner =
    bannerInfoResponse?.data?.refund_assurance.display || false;

  return (
    <div className={css(styles.root)}>
      {shouldDisplayRefundAssuranceBanner && (
        <ProductBoostBanner
          type={BannerType.refundAssurance}
          fromPage={BannerLocation.listCampaignPage}
          className={css(styles.banner)}
        />
      )}
      {shouldDisplayFBWPromotion && !shouldDisplayRefundAssuranceBanner && (
        <ProductBoostBanner
          type={BannerType.fbwDiscount}
          fromPage={BannerLocation.listCampaignPage}
          className={css(styles.banner)}
        />
      )}
      <ProductBoostHeader
        title={i`ProductBoost Campaigns`}
        body={() => (
          <div className={css(styles.headerContainer)}>
            <Markdown
              className={css(styles.text)}
              openLinksInNewTab
              text={i`Create campaigns and boost the impressions of your products! [Learn more](${zendeskURL(
                "360018979833",
              )})`}
            />
            <PrimaryButton
              className={css(styles.createCampaignButton)}
              href="/product-boost/v2/create"
              openInNewTab
            >
              Create Campaign
            </PrimaryButton>
          </div>
        )}
        statsColumns={statsColumns}
        paddingX={pageX}
      />
    </div>
  );
};

const useStyleSheet = (pageX: string | number, isSmallScreen: boolean) => {
  const { textBlack, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: "white",
        },
        headerContainer: {
          display: "flex",
          justifyContent: "space-between",
        },
        link: {
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: 8,
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          fontWeight: fonts.weightNormal,
        },
        banner: {
          margin: `20px ${pageX} 10px ${pageX}`,
        },
        createCampaignButton: {
          backgroundColor: primary,
          borderRadius: 4,
          fontSize: 16,
          lineHeight: 1.5,
        },
        popoverContent: {
          minWidth: !isSmallScreen ? 410 : undefined,
        },
      }),
    [pageX, isSmallScreen, textBlack, primary],
  );
};

export default ListCampaignsPageHeader;
