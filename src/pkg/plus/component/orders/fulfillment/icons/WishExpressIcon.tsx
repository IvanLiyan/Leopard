import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { css } from "@toolkit/styling";
import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";

import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import DeliveryDeadlinePopover from "./DeliveryDeadlinePopover";

type Props = BaseProps & {
  readonly deliveryDeadline?: string | null | undefined;
};
const WishExpressIcon: React.FC<Props> = ({
  style,
  className,
  deliveryDeadline,
  ...props
}: Props) => {
  const styles = useStylesheet();
  return (
    <Popover
      popoverContent={
        deliveryDeadline
          ? () => (
              <DeliveryDeadlinePopover deliveryDeadline={deliveryDeadline} />
            )
          : undefined
      }
      position="right center"
    >
      <Illustration
        name="wishExpressWithoutText"
        alt={i`Orders should be shipped with express shipping`}
        className={css(styles.root, style, className)}
        {...props}
      />
    </Popover>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 25,
          height: 25,
        },
        popoverRoot: {
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 250,
        },
        title: {
          fontWeight: fonts.weightSemibold,
          fontSize: 16,
          color: textDark,
        },
        deadline: {
          margin: "5px 0px",
          fontWeight: fonts.weightSemibold,
          fontSize: 16,
          color: textDark,
        },
        body: {
          marginTop: 5,
          fontWeight: fonts.weightNormal,
          fontSize: 16,
          color: textDark,
        },
        link: {
          margin: "2px 0px",
        },
      }),
    [textDark]
  );
};

export default WishExpressIcon;
