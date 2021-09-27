/* eslint-disable filenames/match-regex */
import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWWarehouseSelectionProps = BaseProps & {
  readonly title: string | (() => ReactNode);
  readonly description: string;
  readonly value: number;
  readonly isSelected: boolean;
  readonly onSelect: (value: number) => unknown;
};

const FBWWarehouseSelection = (props: FBWWarehouseSelectionProps) => {
  const { title, description, value, isSelected, onSelect } = props;
  const styles = useStylesheet(isSelected);
  return (
    <Card className={css(styles.warehouse)}>
      <CheckboxField
        title={title}
        checked={isSelected}
        onChange={() => onSelect(value)}
      />
      <Markdown text={description} className={css(styles.description)} />
    </Card>
  );
};

export default observer(FBWWarehouseSelection);

const useStylesheet = (isSelected: boolean) => {
  return useMemo(
    () =>
      StyleSheet.create({
        warehouse: {
          display: "block",
          padding: "16px 24px",
          ":hover": {
            boxShadow: "0 2px 10px 0 #afc7d133",
          },
          border: isSelected
            ? "solid 1px #2fb7ec"
            : "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        },
        description: {
          lineHeight: 1.43,
          color: palettes.textColors.LightInk,
          padding: "4px 0 0 26px",
        },
        productBoost: {
          lineHeight: 1.43,
          color: palettes.cyans.Cyan,
          padding: "4px 0 0 26px",
        },
      }),
    [isSelected]
  );
};
