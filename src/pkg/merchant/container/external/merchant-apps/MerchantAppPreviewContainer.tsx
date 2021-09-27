import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import MerchantAppShow from "@merchant/component/external/merchant-apps/MerchantAppShow";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { MerchantAppPreviewState } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

export default observer(() => {
  const [showState, setShowState] = useState(new MerchantAppGlobalState());
  const [previewState, setPreviewState] = useState(
    new MerchantAppPreviewState(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await merchantAppsApi.getMerchantApp({}).call();
      const merchantApp = resp.data?.merchant_app;
      const isDisabled = resp.data?.is_disabled;

      if (merchantApp && typeof isDisabled !== "undefined") {
        setShowState(new MerchantAppGlobalState({ props: merchantApp }));
        setPreviewState(
          new MerchantAppPreviewState({ merchantApp, isDisabled }),
        );
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MerchantAppShow
      previewState={previewState}
      showState={showState}
      isLoading={isLoading}
    />
  );
});
