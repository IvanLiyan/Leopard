import React from "react";
import { observer } from "mobx-react";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useDeviceStore } from "@merchant/stores/DeviceStore";
import { useRouteStore } from "@merchant/stores/RouteStore";

const BlueAppRedirectContainer = () => {
  const navigationStore = useNavigationStore();
  const {
    queryParams: { deeplink },
  } = useRouteStore();
  const { isiOS, isAndroid } = useDeviceStore();

  if (deeplink && (isiOS || isAndroid)) {
    navigationStore.navigate(deeplink);
    return null;
  }

  return (
    <div>
      <h1>Please click the link in a mobile phone.</h1>
    </div>
  );
};

export default observer(BlueAppRedirectContainer);
