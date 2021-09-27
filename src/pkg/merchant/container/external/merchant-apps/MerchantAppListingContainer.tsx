import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import MerchantAppShow from "@merchant/component/external/merchant-apps/MerchantAppShow";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Merchant Model */
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import { APIResponse } from "@toolkit/api";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

const MerchantAppListingContainer = () => {
  const navigationStore = useNavigationStore();
  const [showState, setShowState] = useState(new MerchantAppGlobalState());
  const [isLoading, setIsLoading] = useState(true);

  const { clientId } = usePathParams("/merchant_apps/:clientId");

  useEffect(() => {
    const fetchData = async () => {
      const resp: APIResponse<merchantAppsApi.GetSingleAppListingResponse> = await merchantAppsApi
        .getSingleAppListing({
          client_id: clientId,
        })
        .call();

      const merchantApp = resp.data?.merchant_app;
      const mergedProps = {
        ...merchantApp,
        already_added: resp.data?.already_added,
      };

      if (merchantApp) {
        setShowState(new MerchantAppGlobalState({ props: mergedProps }));
        setIsLoading(false);
      } else {
        const { toastStore } = AppStore.instance();
        toastStore.error(i`App not found`);
      }
    };

    if (clientId) {
      fetchData();
    } else {
      navigationStore.navigate("/merchant_apps");
    }
  }, [clientId, navigationStore]);

  return (
    <MerchantAppShow
      showState={showState}
      clientId={clientId}
      isLoading={isLoading}
    />
  );
};

export default observer(MerchantAppListingContainer);
