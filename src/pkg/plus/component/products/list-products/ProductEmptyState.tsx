/*
 *
 * ProductEmptyState.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/26/2020, 9:35:00 AM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantSchema } from "@schema/types";

import HowToAddProductsCard from "./HowToAddProductsCard";
import WishExpressIntroductionBanner from "./WishExpressIntroductionBanner";

type Props = BaseProps & {
  readonly canManageShipping: MerchantSchema["canManageShipping"];
};

const ProductEmptyState: React.FC<Props> = (props: Props) => {
  const { className, style, canManageShipping } = props;
  const styles = useStylesheet(props);

  return (
    <div className={css(className, style)}>
      <HowToAddProductsCard className={css(styles.card)} />
      {canManageShipping && (
        <WishExpressIntroductionBanner className={css(styles.card)} />
      )}
    </div>
  );
};

export default observer(ProductEmptyState);

const useStylesheet = (props: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        card: {
          margin: "15px 0px",
        },
      }),
    []
  );
};
