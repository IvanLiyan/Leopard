import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { pageBackground } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import EditPageContent from "@merchant/component/product-boost/edit-campaign/EditPageContent";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Toolkit */
import { useRequest } from "@toolkit/api";
/* Merchant Store */
import {
  ProductBoostCampaignSchema,
  ProductBoostPropertyProvider,
  RefundAssurancePromo,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useProductBoostProperty } from "@merchant/stores/product-boost/ProductBoostContextStore";

type InitialData = {
  readonly marketing: {
    readonly campaign: ProductBoostCampaignSchema | null;
    readonly currentMerchant: {
      readonly refundAssuranceConstants: RefundAssurancePromo;
    };
  };
};

type EditCampaignPageProps = {
  readonly initialData: InitialData;
};

const EditCampaignContainer = ({ initialData }: EditCampaignPageProps) => {
  const styles = useStyleSheet();
  const { routeStore } = AppStore.instance();
  const property = useProductBoostProperty();
  const toastStore = useToastStore();

  const { cid: campaignId } = usePathParams("/product-boost/edit/:cid");
  const pid = routeStore.queryParams.product_id;

  const {
    marketing: {
      campaign,
      currentMerchant: { refundAssuranceConstants },
    },
  } = initialData;

  const maxSpendingArgs = {
    currency: campaign === null ? "USD" : campaign.localizedCurrency,
    campaign_id: campaignId,
  };

  // TODO: move this to graphql
  const [maxSpendingResponse] = useRequest(
    productBoostApi.getMerchantSpendingStats(maxSpendingArgs)
  );

  // Racing condition when failed to load campaign
  if (campaign == null) {
    toastStore.negative(i`Please refresh the page or try again.`);
    return null;
  }

  const maxSpendingData = maxSpendingResponse?.data;

  if (maxSpendingData == null) {
    return null;
  }

  if (property == null) {
    return null;
  }

  const { campaignProperty } = property;
  return (
    <ProductBoostPropertyProvider pbContext={{ campaignProperty }}>
      <div className={css(styles.root)}>
        <EditPageContent
          campaign_id={campaignId}
          {...maxSpendingResponse?.data}
          product_ids={pid}
          campaignDict={campaign}
          refundAssurancePromo={refundAssuranceConstants}
        />
      </div>
    </ProductBoostPropertyProvider>
  );
};

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
      }),
    []
  );
};

export default observer(EditCampaignContainer);
