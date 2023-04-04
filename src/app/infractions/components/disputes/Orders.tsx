/* This file adapts the migrated InfractionDisputeForm for the new warnings UI */
import React from "react";
import { observer } from "mobx-react";
import { useInfractionContext } from "@infractions/InfractionContext";
import InfractionDisputeForm from "./orders/InfractionDisputeForm";
import { PickedMerchantWarningSchema } from "./orders/order-disputes";

const MerchantLevelDispute: React.FC = () => {
  const {
    infraction: { id, type, title, order },
    ordersDisputeAdapter: { countriesWeShipTo, proofs },
  } = useInfractionContext();

  if (!order) {
    return null;
  }

  const merchantWarning: PickedMerchantWarningSchema = {
    id,
    reason: {
      reason: type,
      text: title,
    },
    proofs,
  };

  return (
    <InfractionDisputeForm
      orderId={order.orderId}
      countries={countriesWeShipTo}
      infraction={merchantWarning}
    />
  );
};

export default observer(MerchantLevelDispute);
