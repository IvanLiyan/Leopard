import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { css } from "@toolkit/styling";

import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {};
const ConfirmedDeliveryIcon: React.FC<Props> = ({
  style,
  className,
  ...props
}: Props) => {
  const styles = useStylesheet();
  return (
    <Popover
      popoverContent={i`Confirmed delivery required`}
      position="top center"
    >
      <Illustration
        name="confirmedDeliveryCheckmark"
        alt={i`Orders should be shipped with confirmed delivery`}
        className={css(styles.root, style, className)}
        {...props}
      />
    </Popover>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 25,
          height: 25,
        },
      }),
    []
  );
export default ConfirmedDeliveryIcon;
