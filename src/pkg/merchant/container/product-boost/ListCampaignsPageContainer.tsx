import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import Campaigns from "@merchant/component/product-boost/list-campaign/Campaigns";
import ListCampaignsPageHeader from "@merchant/component/product-boost/list-campaign/ListCampaignsPageHeader";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const ListCampaignsPageContainer = () => {
  const styles = useStyleSheet();

  const [campaignCountResponse, refreshCampaignCountRequest] = useRequest(
    productBoostApi.getProductBoostCampaignCount({})
  );
  const [statsResponse, refreshStatsRequest] = useRequest(
    productBoostApi.getMerchantSpendingStats({})
  );

  const campaignCount = campaignCountResponse?.data?.campaign_count || 0;
  const maxAllowedSpending = statsResponse?.data?.max_allowed_spending || 0;

  return (
    <div className={css(styles.root)}>
      <ListCampaignsPageHeader
        response={statsResponse?.data}
        campaignCount={campaignCount}
      />
      <Campaigns
        className={css(styles.content)}
        onUpdateCampaignCount={refreshCampaignCountRequest}
        onUpdateAllowedSpending={refreshStatsRequest}
        maxAllowedSpending={maxAllowedSpending}
      />
    </div>
  );
};

const useStyleSheet = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
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

export default observer(ListCampaignsPageContainer);
