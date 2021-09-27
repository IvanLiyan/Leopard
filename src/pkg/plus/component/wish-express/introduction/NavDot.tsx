import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  selected?: boolean;
  onClick?: () => unknown;
};

const NavDot: React.FC<Props> = (props: Props) => {
  const { className, style, onClick } = props;
  const styles = useStylesheet(props);

  return (
    <div className={css(styles.root, className, style)} onClick={onClick} />
  );
};

export default observer(NavDot);

const useStylesheet = ({ selected, onClick }: Props) => {
  const { primary, primaryLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 8,
          height: 8,
          borderRadius: "50%",
          cursor: onClick ? "pointer" : undefined,
          backgroundColor: selected ? primary : primaryLight,
        },
      }),
    [selected, onClick, primary, primaryLight],
  );
};
