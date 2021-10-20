import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { UserEntityType } from "@schema/types";

import { useTheme } from "@stores/ThemeStore";

export type AccountTypeLabelProps = BaseProps & {
  readonly entityType: UserEntityType | null | undefined;
};

const AccountTypeLabel = ({ entityType }: AccountTypeLabelProps) => {
  const { textWhite, primary } = useTheme();
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      {entityType === "INDIVIDUAL" ? i`Individual` : i`Business`}
      <Popover
        position="top"
        popoverMaxWidth={250}
        popoverContent={
          i`Your Wish store is validated for unlimited sales and ` +
          i`additional merchant features to run and grow your store! `
        }
      >
        <Label
          textColor={textWhite}
          backgroundColor={primary}
          width={112}
          style={{ marginLeft: 12 }}
        >
          Validated
        </Label>
      </Popover>
    </div>
  );
};

export default observer(AccountTypeLabel);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 16,
          color: textBlack,
          display: "flex",
        },
      }),
    [textBlack],
  );
};
