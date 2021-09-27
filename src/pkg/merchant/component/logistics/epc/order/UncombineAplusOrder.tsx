import React from "react";
import { observer } from "mobx-react";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import UncombineAplusOrderGeneralModal from "./UncombineAplusOrderGeneralModal";

type UncombineOrderProps = BaseProps & {
  readonly uncombineSuccess: () => unknown | null | undefined;
  readonly orderId: string;
  readonly isValueOrder?: boolean;
  readonly productId?: string;
  readonly isUnityOrder?: boolean;
  readonly estimatedWishPostShipping?: number;
  readonly shipping?: number;
  readonly currency: string;
};

const UncombineAplusOrder = (props: UncombineOrderProps) => {
  const {
    uncombineSuccess,
    orderId,
    isValueOrder,
    productId,
    isUnityOrder,
    estimatedWishPostShipping,
    shipping,
    currency,
  } = props;

  const onClick = () => {
    new UncombineAplusOrderGeneralModal({
      orderId,
      uncombineSuccess,
      isValueOrder: isValueOrder || false,
      productId,
      isUnityOrder: isUnityOrder || false,
      estimatedWishPostShipping,
      shipping,
      currency,
    }).render();
  };

  return <div onClick={onClick}>Remove from A+ Program</div>;
};

export default observer(UncombineAplusOrder);
