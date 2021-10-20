import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { NavSideMenu } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type StepsSideMenuItemProps = BaseProps & {
  readonly title: string;
  readonly selected: boolean;
  readonly complete: boolean;
  readonly show: boolean;
  readonly onClick?: () => unknown;
};

export type StepsSideMenuProps = BaseProps & {
  readonly items: ReadonlyArray<StepsSideMenuItemProps>;
};

const StepsSideMenuItem = ({
  title,
  selected,
  complete,
  show,
  onClick,
}: StepsSideMenuItemProps) => {
  const styles = useStylesheet();

  if (!show) {
    return null;
  }

  const icon = complete ? (
    <Icon name="cyanCheckmark" style={css(styles.icon)} />
  ) : (
    <div className={css(styles.icon, styles.circle)} />
  );

  const textStyle = !selected ? css(styles.unSelectedText) : css({});

  const titleNode = () => (
    <div className={css(styles.row)}>
      {icon}
      <div className={css(textStyle, styles.text)}>{title}</div>
    </div>
  );

  return (
    <NavSideMenu.Item title={titleNode} selected={selected} onClick={onClick} />
  );
};

const StepsSideMenu = ({ items, className, style }: StepsSideMenuProps) => {
  const styles = useStylesheet();

  return (
    <Card style={css(styles.card, className, style)}>
      <NavSideMenu>
        {items.map((item) => (
          <StepsSideMenuItem
            title={item.title}
            selected={item.selected}
            complete={item.complete}
            show={item.show}
            onClick={item.onClick}
            key={item.title}
          />
        ))}
      </NavSideMenu>
    </Card>
  );
};

export default observer(StepsSideMenu);

const useStylesheet = () => {
  const { borderPrimary, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          maxWidth: 280,
          padding: "24px 0px",
        },
        row: {
          display: "flex",
          alignItems: "center",
        },
        icon: {
          flexShrink: 0,
          height: 24,
          width: 24,
          marginRight: 16,
          border: `solid 1px transparent`,
        },
        circle: {
          borderColor: borderPrimary,
          borderRadius: "50%",
        },
        unSelectedText: {
          color: textLight,
        },
        text: {
          whiteSpace: "normal",
        },
      }),
    [borderPrimary, textLight],
  );
};
