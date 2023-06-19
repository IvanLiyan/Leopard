import React, { useState } from "react";
import { observer } from "mobx-react";

import { Pager } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import ProductQualityRefundTable from "@performance/migrated/wss-order-metrics-components/ProductQualityRefundTable";
import {
  metricsDataMap,
  WSS_MISSING_SCORE_INDICATOR,
} from "@performance/migrated/toolkit/stats";
import UserRatingTable from "@performance/migrated/wss-order-metrics-components/UserRatingTable";
import { useTheme } from "@core/stores/ThemeStore";
import { useQuery } from "@apollo/client";
import {
  UNDERPERFORMING_PRODUCTS_TABLE_QUERY,
  UnderperformingProductsTableQueryResponse,
} from "@performance/api/underperformingProductsTableQuery";

type Tab = "PRODUCT_QUALITY_REFUND" | "USER_RATING";

const UnderperformingProductsTable: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("PRODUCT_QUALITY_REFUND");
  const { borderPrimary } = useTheme();

  const { data } = useQuery<UnderperformingProductsTableQueryResponse>(
    UNDERPERFORMING_PRODUCTS_TABLE_QUERY,
    {
      fetchPolicy: "no-cache",
    },
  );

  const productRefundCount =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productQualityRefund
      ?.totalCount;
  const userRatingCount =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productRating
      ?.totalCount;

  const productQualityFormatter = (metric: number) =>
    metricsDataMap.productQualityRefundRate({
      productQualityRefundRate: metric,
    }).currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR;
  const userRatingFormatter = (metric: number) =>
    metricsDataMap.userRating({ userRating: metric }).currentScoreDisplay ??
    WSS_MISSING_SCORE_INDICATOR;

  return (
    <Pager
      onTabChange={(tab: Tab) => {
        void setCurrentTab(tab);
      }}
      selectedTabKey={currentTab}
      tabsRowStyle={{
        borderBottom: `solid 1px ${borderPrimary}`,
        marginBottom: "8px",
      }}
    >
      <Pager.Content
        tabKey="PRODUCT_QUALITY_REFUND"
        titleValue={`${ci18n(
          "title of tab on page",
          "Product Quality Refund",
        )}${productRefundCount ? ` (${productRefundCount})` : ""}`}
      >
        <ProductQualityRefundTable
          formatter={productQualityFormatter}
          showOnlyUnderperformingProducts
        />
      </Pager.Content>
      <Pager.Content
        tabKey="USER_RATING"
        titleValue={`${ci18n("title of tab on page", "User Rating")}${
          userRatingCount ? ` (${userRatingCount})` : ""
        }`}
      >
        <UserRatingTable
          formatter={userRatingFormatter}
          showOnlyUnderperformingProducts
        />
      </Pager.Content>
    </Pager>
  );
};

export default observer(UnderperformingProductsTable);
