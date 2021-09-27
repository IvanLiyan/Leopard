import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Components */
import CreateDailyBudgetCampaignContent from "@merchant/component/product-boost/daily-budget-campaign/CreateDailyBudgetCampaignContent";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { useRequest } from "@toolkit/api";

const CreateDailyBudgetCampaignContainer = () => {
  const styles = useStyleSheet();

  const logger = useLogger(
    "PRODUCT_BOOST_CREATE_DAILY_BUDGET_CAMPAIGN_PAGE_VIEW"
  );
  useEffect(() => {
    logger.info({});
  }, [logger]);

  const [maxSpendingResponse] = useRequest(
    productBoostApi.getMerchantSpendingStats({})
  );

  const data = maxSpendingResponse?.data;
  if (data == null) {
    return <LoadingIndicator />;
  }

  const maxAllowedSpending = data.max_allowed_spending;
  const maxSpendingBreakdown = data.max_spending_breakdown;
  const isPayable = data.is_payable;

  return (
    <div className={css(styles.root)}>
      <CreateDailyBudgetCampaignContent
        maxAllowedSpending={maxAllowedSpending}
        maxSpendingBreakdown={maxSpendingBreakdown}
        isPayable={isPayable}
      />
    </div>
  );
};

const useStyleSheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
      }),
    [pageBackground]
  );
};

export default observer(CreateDailyBudgetCampaignContainer);
