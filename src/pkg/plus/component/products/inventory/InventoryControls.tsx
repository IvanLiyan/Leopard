/*
 *
 * InventoryControls.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  NumericInput,
  ButtonGroup,
  NumericInputProps,
} from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

export type Props = NumericInputProps & {
  readonly onSave: () => unknown;
  readonly canSave: boolean;
};

const InventoryControls: React.FC<Props> = ({
  onSave,
  style,
  className,
  canSave,
  disabled,
  ...inputProps
}: Props) => {
  const styles = useStylesheet();
  return (
    <ButtonGroup className={css(styles.root, style, className)}>
      <NumericInput
        {...inputProps}
        disabled={disabled}
        className={css(styles.item, styles.input)}
      />
      <Button
        onClick={onSave}
        disabled={!canSave || disabled}
        className={css(styles.item)}
      >
        Save
      </Button>
    </ButtonGroup>
  );
};

export default InventoryControls;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
        },
        input: {},
        item: {
          flexGrow: 1,
          flexGasis: 0,
        },
      }),
    []
  );
