/*
 *
 * WishExpressTimeToDoorBadge.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/27/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Color from "color";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { Illustration } from "@merchant/component/core";
import { zendeskURL } from "@toolkit/url";
import { Popover } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly expectedTimeToDoor: number | null | undefined;
  readonly supportsWishExpress: boolean;
};

const WishExpressTimeToDoorBadge: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, expectedTimeToDoor, supportsWishExpress } = props;

  const popoverContent = supportsWishExpress
    ? i`Products have the option to be enabled ` +
      i`for Wish Express when delivered to this country ` +
      i`and within this time frame. [View FAQ](${zendeskURL("231264967")})`
    : i`Wish Express is not offered in this country yet.`;
  return (
    <Popover
      popoverContent={popoverContent}
      position="top center"
      popoverMaxWidth={200}
    >
      <div className={css(styles.root, style, className)}>
        {supportsWishExpress && expectedTimeToDoor != null ? (
          <div className={css(styles.label)}>
            <Illustration
              name="wishExpressTruck"
              className={css(styles.icon)}
              alt={i`Wish express orders must ship within ${expectedTimeToDoor} days`}
            />
            <div className={css(styles.text)}>{expectedTimeToDoor} days</div>
          </div>
        ) : (
          <span>--</span>
        )}
      </div>
    </Popover>
  );
};

const useStylesheet = () => {
  const { textDark, wishExpressOrange } = useTheme();
  const backgroundColor = new Color(wishExpressOrange).alpha(0.5).toString();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        label: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "5px 9px",
          backgroundColor,
          borderRadius: 15,
        },
        icon: {
          height: 20,
          marginRight: 7,
        },
        text: {
          color: textDark,
          fontWeight: fonts.weightNormal,
          fontSize: 14,
        },
      }),
    [textDark, backgroundColor],
  );
};

export default observer(WishExpressTimeToDoorBadge);
