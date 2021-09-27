import React, { useMemo } from "react";
import { observer } from "mobx-react";

import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { CurrencyInput } from "@ContextLogic/lego";

import RightCard from "@plus/component/products/edit-product/RightCard";
import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type BrandCardProps = BaseProps & {
  readonly editState: ProductEditState;
};

const BrandCard = (props: BrandCardProps) => {
  const { className, style, editState } = props;
  const { primaryCurrency, isSubmitting } = editState;

  const styles = useStylesheet();
  return (
    <RightCard
      className={css(className, style)}
      title={i`Reference Price`}
      description={
        i`Please refer to our ` +
        i`[Product Reference Price Policy](${"/policy/listing#2.13"}) ` +
        i`when you enter a Reference Price. [Learn more](${zendeskURL(
          "360016868094"
        )})`
      }
      contentContainerStyle={css(styles.root)}
      isOptional
    >
      <CurrencyInput
        value={editState.msrp?.toString() || ""}
        placeholder="0.00"
        currencyCode={primaryCurrency}
        hideCheckmarkWhenValid
        onChange={({ textAsNumber }) => editState.setMsrp(textAsNumber)}
        debugValue={(Math.random() * 100).toFixed(2).toString()}
        disabled={isSubmitting}
      />
    </RightCard>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
      }),
    []
  );

export default observer(BrandCard);
