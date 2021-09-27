/*
 *
 * ShippingProfileSummary.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/25/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { H6 } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

import { ShippingProfileSchema } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly name: ShippingProfileSchema["name"];
  readonly description: ShippingProfileSchema["description"];
  readonly isExpress: boolean;
};

const ShippingProfileSummary = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, name, description, isExpress } = props;

  return (
    <div className={css(styles.root, className, style)}>
      <H6 className={css(styles.name)}>{name}</H6>
      <div className={css(styles.descriptionContainer)}>
        <div className={css(styles.description)}>{description}</div>
        {isExpress && (
          <Illustration
            name="wishExpressWithoutText"
            alt="express shipping"
            className={css(styles.badge)}
          />
        )}
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
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 10,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          cursor: "pointer",
        },
        name: {
          paddingBottom: 2,
        },
        descriptionContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        description: {
          marginRight: 5,
        },
        badge: {
          height: 20,
        },
      }),
    []
  );
};

export default observer(ShippingProfileSummary);
