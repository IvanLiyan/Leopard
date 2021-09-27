import React from "react";
import { LoadingIndicator } from "@ContextLogic/lego";
import { useOrderTaxData } from "@toolkit/orders/tax";
import OrderTaxCell from "./OrderTaxCell";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly orderId: string;
};

const OrderTaxCellWrapper: React.FC<Props> = (props: Props) => {
  const { orderId } = props;
  const { data } = useOrderTaxData(orderId);

  if (data == null) {
    return <LoadingIndicator type="spinner" size={12} />;
  }

  const order = data.fulfillment?.order;
  const salesTaxData = order?.tax?.salesTax;

  return <OrderTaxCell orderId={orderId} salesTaxData={salesTaxData} />;
};

export default OrderTaxCellWrapper;
