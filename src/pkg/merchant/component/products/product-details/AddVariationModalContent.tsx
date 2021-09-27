//@flow
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */

/* Lego Components */
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput, OnTextChangeEvent } from "@ContextLogic/lego";

/* Merchant API */
import * as productApi from "@merchant/api/product";
import { NumericInput } from "@ContextLogic/lego";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import ProductDetailHeader from "@merchant/component/products/product-details/ProductDetailHeader";
import { CurrencyInput } from "@ContextLogic/lego";
import { RequiredValidator } from "@toolkit/validators";

export type AddVariationModalContentProps = BaseProps & {
  readonly onColorChange: (value: string) => unknown;
  readonly onSizeChange: (value: string) => unknown;
  readonly onSKUChange: (value: string) => unknown;
  readonly onInventoryChange: (value: number) => unknown;
  readonly onPriceChange: (value: number) => unknown;
  readonly onCostChange: (value: number) => unknown;
  readonly parentSKU: string;
  readonly cid: string;
  readonly productName: string;
  readonly currencyCode: string;
};

export type CreateVariationData = {
  readonly "parent-sku": string;
  color?: string;
  size?: string;
  sku?: string;
  quantity?: number;
  localized_price?: number;
  localized_cost?: number;
};

const AddVariationModalContent = (props: AddVariationModalContentProps) => {
  const styles = useStylesheet();
  const { userStore } = AppStore.instance();
  const isCostBased = userStore.isCostBased;

  const requiredValidator = new RequiredValidator();

  const {
    onColorChange,
    onSizeChange,
    onSKUChange,
    onInventoryChange,
    onPriceChange,
    onCostChange,
    currencyCode,
    cid,
    productName,
  } = props;

  const [inventory, setInventory] = useState(0);
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [skuValue, setSKUValue] = useState("");

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.content)}>
        <ProductDetailHeader productId={cid} productName={productName} />
      </div>
      <HorizontalField
        title={i`Color`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }) => onColorChange(text)}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Size`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }) => onSizeChange(text)}
        />
      </HorizontalField>

      <HorizontalField
        title={i`SKU`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <TextInput
          validators={[requiredValidator]}
          className={css(styles.textInput)}
          onChange={({ text }) => {
            onSKUChange(text);
            setSKUValue(text);
          }}
          value={skuValue}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Standard Inventory`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <NumericInput
          onChange={({ valueAsNumber }) => {
            const value = Math.max(1, Number(valueAsNumber));
            setInventory(value);
            onInventoryChange(value);
          }}
          value={Math.max(1, inventory)}
          incrementStep={1}
          className={css(styles.textInput)}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Price (${currencyCode})`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <CurrencyInput
          validators={isCostBased ? undefined : [requiredValidator]}
          currencyCode={currencyCode}
          value={price}
          onChange={({ text }: OnTextChangeEvent) => {
            const value = Math.max(0, Number(text));
            onPriceChange(value);
            setPrice(text);
          }}
          className={css(styles.textInput)}
        />
      </HorizontalField>

      {isCostBased && (
        <HorizontalField
          title={i`Cost (${currencyCode})`}
          titleWidth={150}
          centerTitleVertically
          className={css(styles.verticalMargin)}
        >
          <CurrencyInput
            validators={[requiredValidator]}
            currencyCode={currencyCode}
            value={cost}
            onChange={({ text }: OnTextChangeEvent) => {
              const value = Math.max(0, Number(text));
              onCostChange(value);
              setCost(text);
            }}
            className={css(styles.textInput)}
          />
        </HorizontalField>
      )}
    </div>
  );
};

export default observer(AddVariationModalContent);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          paddingLeft: 80,
          paddingRight: 80,
        },
        verticalMargin: {
          marginBottom: 20,
        },
        textInput: {
          flex: 1,
        },
        content: {
          marginTop: 20,
          marginBottom: 20,
        },
      }),
    []
  );
};

export class AddVariationModal extends Modal {
  contentProps: AddVariationModalContentProps;

  constructor(props: AddVariationModalContentProps) {
    super((onClose) => null);
    const { toastStore } = AppStore.instance();

    const newVariation: CreateVariationData = {
      "parent-sku": props.parentSKU,
      color: undefined,
      size: undefined,
      sku: undefined,
      quantity: undefined,
      localized_price: undefined,
      localized_cost: undefined,
    };

    const onColorChange = (value: string) => {
      newVariation.color = value;
    };

    const onSizeChange = (value: string) => {
      newVariation.size = value;
    };

    const onSKUChange = (value: string) => {
      newVariation.sku = value;
    };

    const onInventoryChange = (value: number) => {
      newVariation.quantity = value;
    };

    const onPriceChange = (value: number) => {
      newVariation.localized_price = value;
    };

    const onCostChange = (value: number) => {
      newVariation.localized_cost = value;
    };

    props = {
      ...props,
      onColorChange,
      onSizeChange,
      onPriceChange,
      onCostChange,
      onInventoryChange,
      onSKUChange,
    };

    this.contentProps = props;

    this.setHeader({ title: i`Add Variation` });
    this.setRenderFooter(() => (
      <ModalFooter
        action={{
          text: i`Save`,
          onClick: async () => {
            try {
              await productApi
                .addVariation({
                  cid: props.cid,
                  data_json: JSON.stringify(newVariation),
                })
                .call();
            } catch (e) {
              toastStore.error(e.msg);
              return;
            }
            toastStore.positive(i`You have successfully added a variation`);
          },
        }}
      />
    ));
    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.4);
  }

  renderContent() {
    const { contentProps } = this;
    return <AddVariationModalContent {...contentProps} />;
  }
}
