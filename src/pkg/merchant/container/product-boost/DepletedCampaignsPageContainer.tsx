import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { Route } from "react-router-dom";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import DepletedCampaigns from "@merchant/component/product-boost/list-campaign/DepletedCampaigns";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { useRequest } from "@toolkit/api";

const DepletedCampaignsPageLogTableName = "PB_BUDGET_DEPLETION_SOURCE";
//From AddBudgetNotificationSource
const LowBudgetCampaignPageSource = 2;

const DepletedCampaignsPageContainer = () => {
  const styles = useStyleSheet();
  const { queryParams } = AppStore.instance().routeStore;

  const [depletedCampaignsResponse] = useRequest(
    productBoostApi.listProductBoostDepletedCampaigns({})
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { productBoostStore } = AppStore.instance();
    const { userStore } = AppStore.instance();
    const { queryParams } = AppStore.instance().routeStore;
    const campaigns = depletedCampaignsResponse?.data?.campaigns;
    if (campaigns) {
      campaigns.forEach((campaign) =>
        productBoostStore.registerCampaign(
          new CampaignModel({
            id: campaign.campaign_id,
            budget: campaign.max_budget.toFixed(2),
            startDate: new Date(campaign.start_time),
            endDate: new Date(campaign.end_time),
            localizedCurrency: campaign.localized_currency,
            minBudgetToAdd: campaign.min_budget_to_add,
            maxBudgetToAdd: campaign.max_budget_to_add,
            isBonusBudgetCampaign: campaign.is_bonus_budget_campaign,
            bonusBudgetRate: campaign.bonus_budget_rate,
            bonusBudget: campaign.localized_bonus_budget,
            bonusBudgetType: campaign.bonus_budget_type,
            usedBonusBudget: campaign.localized_used_bonus_budget,
          })
        )
      );
      setIsLoading(false);
    }
    logger.log(DepletedCampaignsPageLogTableName, {
      merchant_id: userStore.loggedInMerchantUser.id,
      action: "clicked",
      noti_id: queryParams.noti_id,
      from_noti: parseInt(queryParams.from_noti) || LowBudgetCampaignPageSource,
    });
  }, [depletedCampaignsResponse]);

  const campaigns = depletedCampaignsResponse?.data?.campaigns || [];

  return (
    <div className={css(styles.root)}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Route
          path="/product-boost/depleted-campaigns"
          render={(props) => (
            <DepletedCampaigns
              {...props}
              campaigns={campaigns}
              className={css(styles.content)}
              fromNoti={
                queryParams.from_noti ? parseInt(queryParams.from_noti) : null
              }
            />
          )}
        />
      )}
    </div>
  );
};

const useStyleSheet = () => {
  const pageX = AppStore.instance().dimenStore.pageGuideXForPageWithTable;
  const { pageGuideBottom } = dimen;

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        content: {
          padding: `20px ${pageX} ${pageGuideBottom} ${pageX}`,
        },
      }),
    [pageX, pageGuideBottom]
  );
};

export default observer(DepletedCampaignsPageContainer);
