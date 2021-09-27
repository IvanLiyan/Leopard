import React from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import MerchantAppUpdate from "@merchant/component/external/merchant-apps/MerchantAppUpdate";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

export default observer(() => {
  const { routeStore } = useStore();
  return (
    <MerchantAppUpdate
      fromRejectedChange={routeStore.queryParams.continuePrevious == "true"}
    />
  );
});
