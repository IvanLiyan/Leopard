import { Layout, Popover } from "@ContextLogic/lego";
import { PopoverContent } from "@ContextLogic/lego/component/Popover";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Icon } from "@ContextLogic/zeus";
import { useTheme } from "@core/stores/ThemeStore";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly popoverContent: PopoverContent | null | undefined;
  readonly isActive?: boolean;
  readonly count?: number;
};

const PopoverFilterButton: React.FC<Props> = ({
  style,
  className,
  popoverContent,
  isActive,
  count,
}) => {
  const { primary, textBlack } = useTheme();
  const styles = useStylesheet();
  return (
    <Popover
      style={[className, style]}
      on="click"
      position="bottom center"
      popoverContent={popoverContent}
      closeOnEscape
      closeOnMouseLeave={false}
    >
      <Layout.FlexRow>
        <Icon
          style={{ cursor: "pointer" }}
          name="filter"
          size={20}
          colors={isActive ? { color1: primary } : { color1: textBlack }}
        />
        {count != null && isActive && (
          <Layout.FlexRow
            style={styles.bubble}
            justifyContent="center"
            alignItems="center"
          >
            {count > 99 ? "99+" : count}
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>
    </Popover>
  );
};

const useStylesheet = () => {
  const { surfaceDarkest, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        bubble: {
          fontSize: 10,
          position: "relative",
          minWidth: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: surfaceDarkest,
          color: textWhite,
          textAlign: "center",
          left: -8,
          top: -8,
          zIndex: 100,
          padding: "0px 2px",
        },
      }),
    [surfaceDarkest, textWhite],
  );
};

export default observer(PopoverFilterButton);
