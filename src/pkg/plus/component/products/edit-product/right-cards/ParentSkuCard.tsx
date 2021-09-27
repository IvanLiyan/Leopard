import React, { useMemo } from "react";
import { observer } from "mobx-react";

import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { TextInput } from "@ContextLogic/lego";

import RightCard from "@plus/component/products/edit-product/RightCard";
import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ParentSkuCardProps = BaseProps & {
  readonly editState: ProductEditState;
};

const ParentSkuCard = (props: ParentSkuCardProps) => {
  const { className, style, editState } = props;
  const { isSubmitting } = editState;
  const variation = editState.variationsList[0];
  const styles = useStylesheet();
  return (
    <RightCard
      className={css(className, style)}
      title={i`Parent SKU`}
      description={
        i`Unique identifier for your product to facilitate CSV ` +
        i`functionality. Parent SKU is the same for all variations. ` +
        i`If not provided during creation, parent SKU will default ` +
        i`to the first variation SKU.`
      }
      contentContainerStyle={css(styles.root)}
    >
      <TextInput
        onChange={({ text }) => editState.setSku(text)}
        value={editState.sku || ""}
        placeholder={variation?.sku ? variation.sku : i`Enter the Parent SKU`}
        height={40}
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
    [],
  );

export default observer(ParentSkuCard);
