/*
 *
 * SetBudgetInput.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { NumericInput } from "@ContextLogic/lego";
import { OnChangeEvent } from "@ContextLogic/lego";
import {
  Validator,
  RequiredValidator,
  MinMaxValueValidator,
} from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import * as fonts from "@toolkit/fonts";

import { useTheme } from "@stores/ThemeStore";

import { BoostableProduct } from "@toolkit/marketing/boost-products";
import BoostProductsState from "@plus/model/BoostProductsState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly boostableProduct: BoostableProduct;
  readonly boostState: BoostProductsState;
};

const SetBudgetInput: React.FC<Props> = ({
  style,
  className,
  boostState,
  boostableProduct,
}: Props) => {
  const {
    product: { id: productId },
  } = boostableProduct;
  const { currencyCode, forceValidation, isSubmitting, dailyMinBudget } =
    boostState;
  const styles = useStylesheet();
  const [validationError, setValidationError] = useState<
    string | null | undefined
  >(undefined);
  const budget = boostState.getProductBudget(productId);

  const validators: ReadonlyArray<Validator> = useMemo(() => {
    const minimumBudgetDisplay = formatCurrency(dailyMinBudget, currencyCode);
    return [
      new RequiredValidator(),
      new MinMaxValueValidator({
        customMessage: i`Budget must be at least ${minimumBudgetDisplay}`,
        minAllowedValue: dailyMinBudget,
        maxAllowedValue: undefined,
      }),
    ];
  }, [currencyCode, dailyMinBudget]);

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.content)}>
        {getCurrencySymbol(currencyCode)}
        <NumericInput
          value={budget}
          incrementStep={1}
          className={css(styles.input)}
          onChange={({ valueAsNumber }: OnChangeEvent) => {
            if (valueAsNumber != null && !isNaN(valueAsNumber)) {
              boostState.setProductBudget(productId, valueAsNumber);
            }
          }}
          disabled={isSubmitting}
          forceValidation={forceValidation}
          validators={validators}
          onValidityChanged={({ isValid, errorMessage }) => {
            setValidationError(errorMessage);
          }}
          showValidationStatus={false}
        />
      </div>
      {validationError && (
        <div className={css(styles.errorText)}>{validationError}</div>
      )}
    </div>
  );
};

export default observer(SetBudgetInput);

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        content: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        input: {
          marginLeft: 5,
        },
        errorText: {
          fontSize: 11,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          animationDuration: "300ms",
          cursor: "default",
          wordWrap: "break-word",
          wordBreak: "break-all",
          whiteSpace: "normal",
          marginLeft: 10,
        },
      }),
    [negative],
  );
};
