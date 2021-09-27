/*
 *
 * SpendRevenue.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";

type Props = BaseProps & {
  readonly productState: BoostedProductsRowState;
  readonly isFreeBudgetMerchant: boolean;
};

const SpendRevenue: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    productState: {
      initialData: {
        lifetimeStats: { gmv, spend },
      },
    },
    isFreeBudgetMerchant,
  } = props;
  const styles = useStylesheet();
  if (isFreeBudgetMerchant) {
    return (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.values)}>{gmv.display}</div>
      </div>
    );
  }

  const ratio = gmv.amount > 0 ? spend.amount / gmv.amount : 0;
  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.values)}>
        {spend.display} / {gmv.display}
      </div>
      <div className={css(styles.ratio)}>
        ({numeral(ratio).format("0.00%")})
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        },
        values: {
          color: textBlack,
          fontSize: 14,
        },
        ratio: {
          color: textDark,
          fontSize: 14,
          opacity: 0.8,
          marginTop: 7,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(SpendRevenue);
