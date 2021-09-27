import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { css } from "@toolkit/styling";
import { Illustration } from "@merchant/component/core";
import RemitPopover from "./RemitPopover";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {};

const WishRemitIcon: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  return (
    <RemitPopover remitTypes={["WISH_REMIT"]}>
      <Illustration
        name="blueCheckmark"
        alt="blue checkmark"
        className={css(styles.root, style, className)}
      />
    </RemitPopover>
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
    [],
  );
export default WishRemitIcon;
