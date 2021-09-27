/*
 *
 * EnabledSwitch.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Switch } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";

type Props = BaseProps & {
  readonly productState: BoostedProductsRowState;
};

const EnabledSwitch: React.FC<Props> = (props: Props) => {
  const { productState } = props;
  const { isActive, isSaving } = productState;
  const styles = useStylesheet();

  const onToggle = async (to: boolean) => {
    await productState.toggleIsActive(to);
  };

  return (
    <Switch
      style={css(styles.switch)}
      isOn={isActive}
      onToggle={onToggle}
      showText={false}
      disabled={isSaving}
    />
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        productsCell: {
          display: "flex",
          alignItems: "center",
          margin: "12px 0px",
          maxWidth: "100%",
        },
        showEyeballOnHover: {
          ":last-child > :last-child": {
            opacity: 0,
          },
          ":hover": {
            opacity: 1,
            transition: "opacity 0.3s linear",
          },
        },
        image: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        popover: {
          margin: 24,
        },
        markdown: {
          margin: 12,
        },
        switch: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        },
        name: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    []
  );

export default observer(EnabledSwitch);
