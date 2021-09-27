import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyValue } from "@schema/types";

export type VariationType = {
  readonly price: Pick<CurrencyValue, "amount" | "display">;
};

type Props = BaseProps & {
  readonly variations: ReadonlyArray<VariationType>;
};

const ProductsPriceRange = ({ variations }: Props) => {
  const minPrice: VariationType = useMemo(
    () =>
      variations.reduce((a, b) => (b.price.amount < a.price.amount ? b : a)),
    [variations]
  );

  const maxPrice: VariationType = useMemo(
    () =>
      variations.reduce((a, b) => (b.price.amount > a.price.amount ? b : a)),
    [variations]
  );

  if (variations.length === 1) {
    return <>{variations[0].price.display}</>;
  }

  return <>{`${minPrice.price.display} - ${maxPrice.price.display}`}</>;
};

export default observer(ProductsPriceRange);
