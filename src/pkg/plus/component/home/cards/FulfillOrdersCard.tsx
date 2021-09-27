import React, { useEffect } from "react";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { cni18n } from "@legacy/core/i18n";
import { PrimaryButton } from "@ContextLogic/lego";
/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { FulfillmentSchema, MerchantSchema } from "@schema/types";

import HomePageCard from "./HomePageCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const GET_ORDER_COUNT = gql`
  query GetUnfulfilledOrderCount {
    fulfillment {
      actionRequiredOrderCount
    }
    currentMerchant {
      daysToFulfill
    }
  }
`;

type ResponseType = {
  readonly fulfillment: Pick<FulfillmentSchema, "actionRequiredOrderCount">;
  readonly currentMerchant: Pick<MerchantSchema, "daysToFulfill">;
};

type Props = BaseProps & {
  readonly setVisible: (arg0: boolean) => unknown;
};

const FulfillOrdersCard: React.FC<Props> = ({
  style,
  className,
  setVisible,
}: Props) => {
  const { data } = useQuery<ResponseType, void>(GET_ORDER_COUNT);
  const actionRequiredOrderCount: number | null | undefined =
    data?.fulfillment.actionRequiredOrderCount;
  const daysToFulfill = data?.currentMerchant.daysToFulfill;

  const visible =
    actionRequiredOrderCount != null && actionRequiredOrderCount > 0;

  useEffect(() => {
    setVisible(visible);
  }, [setVisible, visible]);

  if (!visible) {
    return null;
  }

  const title = cni18n(
    "'Fulfill' here is a VERB. Means to ship the order",
    actionRequiredOrderCount,
    "An order needs to be fulfilled",
    "**%1$s orders** need to be fulfilled",
    actionRequiredOrderCount
  );
  return (
    <HomePageCard
      style={css(style, className)}
      title={title}
      description={
        i`Fulfill your orders by adding tracking information within ` +
        i`${daysToFulfill} days from when the orders are released.`
      }
      illustration="merchantPlusMarkOrdersShippedTask"
      titleBolded={false}
    >
      <PrimaryButton href="/plus/orders/unfulfilled">View orders</PrimaryButton>
    </HomePageCard>
  );
};

export default FulfillOrdersCard;
