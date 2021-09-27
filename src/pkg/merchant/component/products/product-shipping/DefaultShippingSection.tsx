/*
 *
 * DestinationSection.tsx
 *
 * Created by Joyce Ji on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Link } from "@ContextLogic/lego";

import { useTheme } from "@merchant/stores/ThemeStore";

import { Field, CurrencyInput, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator } from "@toolkit/validators";

/* Types Imports */
import ProductShippingEditState from "@merchant/model/products/ProductShippingEditState";

/* Constants */
import { MERCHANT_PRODUCT_SHIPPING_TEST_ID } from "@merchant/toolkit/testing";

type Props = {
  readonly editState: ProductShippingEditState;
};

const DefaultShippingSection: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { editState } = props;

  const {
    productId,
    warehouseId,
    primaryCurrency,
    forceValidation,
    showTTDColumn,
    showVariationShippingLink,
  } = editState;
  const defaultShippingPrice = editState.getDefaultShippingPrice(warehouseId);

  return (
    <div className={css(styles.root)}>
      {showTTDColumn && (
        <Markdown
          text={
            i`Set your Default Shipping Price to ship your product to all ` +
            i`destinations enabled for your merchant account. You may also ` +
            i`customize the value for each destination below. However, the ` +
            i`Default Shipping Price will apply to any new destination added ` +
            i`to your shipping settings. [Edit shipping settings](${"/shipping-settings"})`
          }
        />
      )}

      <div className={css(styles.form)}>
        <Field
          className={css(styles.field)}
          title={i`Default Shipping Price`}
          description={
            i`The Default Shipping Price will be used for any new destination ` +
            i`countries added unless a Standard Shipping Price has been set. `
          }
        >
          <CurrencyInput
            value={defaultShippingPrice?.toString()}
            placeholder="0.00"
            className={css(styles.input)}
            currencyCode={primaryCurrency}
            hideCheckmarkWhenValid
            onChange={({ textAsNumber }) =>
              editState.setDefaultShippingPrice(
                textAsNumber ?? NaN,
                warehouseId
              )
            }
            debugValue={(Math.random() * 10).toFixed(2).toString()}
            forceValidation={forceValidation}
            validators={
              editState.wasDefaultShippingSet ? [new RequiredValidator()] : []
            }
            disabled={editState.isSubmitting}
            data-testid={
              MERCHANT_PRODUCT_SHIPPING_TEST_ID.DEFAULT_SHIPPING_PRICE
            }
          />
        </Field>
      </div>
      {showVariationShippingLink && (
        <Link href={`/product-variation-shipping/${productId}`} openInNewTab>
          View variation shipping price
        </Link>
      )}
    </div>
  );
};

export default observer(DefaultShippingSection);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        field: {
          display: "flex",
          flexDirection: "row",
          marginTop: 10,
          width: "100%",
        },
        input: {
          paddingLeft: "20px",
          alignSelf: "flex-start",
          width: 130,
        },
        body: {
          color: textDark,
          marginBottom: 16,
        },
        form: {
          padding: 15,
        },
      }),
    [textDark]
  );
};
