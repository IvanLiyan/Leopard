import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import DuplicateAutomatedModalContent from "@merchant/component/product-boost/modals/DuplicateAutomatedModalContent";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Store */
import {
  useProductBoostMerchantInfo,
  useProductBoostProperty,
} from "@merchant/stores/product-boost/ProductBoostContextStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const DuplicateAutomatedCampaignContainer = () => {
  const styles = useStyleSheet();

  const { cid: campaignId } = usePathParams(
    "/product-boost/duplicate-automated-campaign/:cid",
  );
  const [campaignResponse] = useRequest(
    productBoostApi.getProductBoostDuplicateAutomatedCampaignInfo({
      campaign_id: campaignId,
    }),
  );

  const campaignInfo = campaignResponse?.data;

  const [maxSpendingResponse] = useRequest(
    productBoostApi.getMerchantSpendingStats({}),
  );

  const maxSpendingData = maxSpendingResponse?.data;

  const productBoostMerchantInfoResult = useProductBoostMerchantInfo();
  const productBoostCampaignInfoResult = useProductBoostProperty();
  const minStartDateUnix =
    productBoostCampaignInfoResult?.campaignProperty.minStartDate.unix || 0;
  const maxStartDateUnix =
    productBoostCampaignInfoResult?.campaignProperty.maxStartDate.unix || 0;
  const minStartDate = new Date(minStartDateUnix * 1000);
  const maxStartDate = new Date(maxStartDateUnix * 1000);
  const maxNumWeeks =
    productBoostCampaignInfoResult?.campaignProperty.maxNumWeeks || 0;
  const allowMaxboost =
    productBoostMerchantInfoResult?.marketing.currentMerchant.allowMaxboost ||
    false;

  if (
    campaignInfo == null ||
    maxSpendingData == null ||
    productBoostMerchantInfoResult == null ||
    productBoostCampaignInfoResult == null
  ) {
    return null;
  }

  const {
    campaign_name: campaignName,
    start_time: startDate,
    end_time: endDate,
    max_budget: maxBudget,
    localized_currency: currencyCode,
    product_count: productCount,
  } = campaignInfo;

  const {
    max_allowed_spending: maxAllowedSpending,
    max_spending_breakdown: maxSpendingBreakdown,
    is_payable: isPayable,
  } = maxSpendingData;

  return (
    <div className={css(styles.root)}>
      <DuplicateAutomatedModalContent
        campaignId={campaignId}
        campaignName={campaignName}
        startDate={startDate}
        endDate={endDate}
        maxBudget={maxBudget}
        maxSpendingBreakdown={maxSpendingBreakdown}
        maxAllowedSpending={maxAllowedSpending}
        isPayable={isPayable}
        productCount={productCount}
        dupSource={8}
        onClose={() => {}}
        currencyCode={currencyCode}
        minStartDate={minStartDate}
        maxStartDate={maxStartDate}
        maxNumWeeks={maxNumWeeks}
        allowMaxboost={allowMaxboost}
      />
    </div>
  );
};

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontFamily: "Proxima",
          backgroundColor: "white",
        },
      }),
    [],
  );
};

export default observer(DuplicateAutomatedCampaignContainer);
