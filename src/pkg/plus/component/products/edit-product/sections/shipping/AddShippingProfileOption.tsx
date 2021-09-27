/*
 *
 * AddShippingProfileOption.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { H6 } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

import CreateShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/CreateShippingProfileModal";
import { MAX_OPTIONS_PER_COUNTRY } from "@plus/model/ShippingProfileState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const AddShippingProfileOption = (props: Props) => {
  const styles = useStylesheet();
  const { className, style } = props;

  return (
    <div
      className={css(styles.root, className, style)}
      onClick={() => new CreateShippingProfileModal({}).render()}
    >
      <div className={css(styles.iconContainer)}>
        <Icon name="plusIconDarkPalace" className={css(styles.icon)} />
      </div>
      <div className={css(styles.content)}>
        <H6 className={css(styles.name)}>Add a new shipping profile</H6>
        <div className={css(styles.description)}>
          Customize shipping with up to {MAX_OPTIONS_PER_COUNTRY} rates for each
          destination.
        </div>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          padding: "15px 15px",
          cursor: "pointer",
          alignItems: "stretch",
          transition: "opacity 0.3s linear",
          opacity: 1,
          ":hover": {
            opacity: 0.6,
          },
        },
        iconContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 20,
        },
        icon: {
          width: 18,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 10,
        },
        name: {
          paddingBottom: 2,
        },
        description: {
          marginRight: 5,
        },
      }),
    [],
  );
};

export default observer(AddShippingProfileOption);
