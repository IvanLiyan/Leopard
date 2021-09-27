/*
 *
 * ProductBudgetInput.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/16/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

import { Validator, MinMaxValueValidator } from "@toolkit/validators";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import * as fonts from "@toolkit/fonts";

/* Lego Components */
import { NumericInput, ButtonGroup } from "@ContextLogic/lego";
import { OnChangeEvent } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PickedMerchantProperty } from "@toolkit/marketing/boosted-products";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";

import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly productState: BoostedProductsRowState;
  readonly merchantProperty: PickedMerchantProperty;
  readonly refetchProducts: () => void;
};

const ProductBudgetInput: React.FC<Props> = ({
  style,
  className,
  productState,
  merchantProperty,
  refetchProducts,
}: Props) => {
  const styles = useStylesheet();
  const {
    initialData: { dailyPromotionBudget },
    isRemoved,
  } = productState;

  const [validationError, setValidationError] = useState<
    string | null | undefined
  >(undefined);
  const [currentValue, setCurrentValue] = useState<number>(
    dailyPromotionBudget.amount
  );
  const [lastSubmission, setLastSubmission] = useState<number>(
    dailyPromotionBudget.amount
  );

  const onSave = async () => {
    await productState.updateBudget(currentValue);
    setLastSubmission(currentValue);
  };

  const canSave = currentValue != lastSubmission;
  const disabled = productState.isSaving || isRemoved;

  const validators: ReadonlyArray<Validator> = useMemo(() => {
    const {
      dailyMinBudget,
      spending: { budgetAvailable },
    } = merchantProperty;
    const maximumBudget = dailyPromotionBudget.amount + budgetAvailable.amount;
    const maximumBudgetDisplay = formatCurrency(
      maximumBudget,
      dailyPromotionBudget.currencyCode
    );
    return [
      new MinMaxValueValidator({
        customMessage: i`Budget should be between ${dailyMinBudget.display} and ${maximumBudgetDisplay}`,
        minAllowedValue: dailyMinBudget.amount,
        maxAllowedValue: maximumBudget,
      }),
    ];
  }, [
    merchantProperty,
    dailyPromotionBudget.amount,
    dailyPromotionBudget.currencyCode,
  ]);

  return (
    <div className={css(styles.root, style, className)}>
      <ButtonGroup>
        <NumericInput
          value={currentValue}
          disabled={disabled}
          incrementStep={1}
          onChange={({ valueAsNumber }: OnChangeEvent) => {
            setCurrentValue(Math.max(valueAsNumber || 0, 0));
          }}
          style={{ width: "95%" }}
          validators={validators}
          onValidityChanged={({ isValid, errorMessage }) => {
            setValidationError(errorMessage);
          }}
          showValidationStatus={false}
        />
        <Button
          onClick={onSave}
          disabled={!canSave || disabled || validationError != null}
          className={css(styles.item)}
        >
          Save
        </Button>
      </ButtonGroup>
      {validationError && (
        <div className={css(styles.errorText)}>{validationError}</div>
      )}
    </div>
  );
};

export default ProductBudgetInput;

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
        item: {
          flexGrow: 1,
          flexBasis: 0,
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
        },
      }),
    [negative]
  );
};
