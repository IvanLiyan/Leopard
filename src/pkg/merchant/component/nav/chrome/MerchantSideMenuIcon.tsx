//
//  ChromeSideMenuIcon.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

import { useHasNotificationBadge } from "@merchant/component/nav/chrome/side-menu/ChromeSideMenuButton";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { IconName } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode, useNodeCount } from "@toolkit/chrome";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly onMouseOver?: () => unknown;
  readonly counts?: {
    readonly [key: string]: number;
  };
  readonly isSelected?: boolean;
  readonly onMouseLeave?: () => unknown;
};

type IconSet = { readonly selected: IconName; readonly notSelected: IconName };

const IconMappings: {
  [key: string]: IconSet;
} = {
  home: {
    selected: "homeSelected",
    notSelected: "homeNotSelected",
  },
  products: {
    selected: "productsSelected",
    notSelected: "productsNotSelected",
  },
  orders: {
    selected: "ordersSelected",
    notSelected: "ordersNotSelected",
  },
  tickets: {
    selected: "ticketsSelected",
    notSelected: "ticketsNotSelected",
  },
  performance: {
    selected: "performanceSelected",
    notSelected: "performanceNotSelected",
  },
  infractions: {
    selected: "infractionsSelected",
    notSelected: "infractionsNotSelected",
  },
  "product-boost": {
    selected: "pbSelected",
    notSelected: "pbNotSelected",
  },
  logistics: {
    selected: "fbwFbsSelected",
    notSelected: "fbwFbsNotSelected",
  },
  "early-payments": {
    selected: "earlyPaymentSelected",
    notSelected: "earlyPaymentNotSelected",
  },
};

type NumberType = number;
export default observer((props: Props) => {
  const {
    children,
    className,
    style,
    node,
    counts,
    isSelected,
    ...otherProps
  } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [tooltipTop, setTooltipTop] = useState<NumberType | null>(null);
  const styles = useStylesheet({ ...props, tooltipTop });
  const { nodeid, url, label } = node;
  if (nodeid == null) {
    return null;
  }

  const iconSet = IconMappings[nodeid];
  if (!iconSet) {
    return null;
  }

  const { selected, notSelected } = iconSet;

  const notificationCount = useNodeCount(node);
  const hasBetaChild = useHasNotificationBadge(node, "BETA");
  const hasNewChild = useHasNotificationBadge(node, "NEW");

  const renderDot = () => {
    if (notificationCount || hasBetaChild || hasNewChild) {
      return <div className={css(styles.dot, styles.notificationDot)} />;
    }

    return null;
  };

  return (
    <div
      className={css(className, style)}
      ref={rootRef}
      onMouseOver={() => {
        const { current } = rootRef;
        const rect = offset(current);
        if (rect == null) {
          return null;
        }
        setTooltipTop(rect.top);
      }}
      onMouseLeave={() => {
        setTooltipTop(null);
      }}
    >
      <Link
        className={css(styles.root)}
        href={url}
        fadeOnHover={false}
        {...otherProps}
      >
        {isSelected && <div className={css(styles.leftBar)} />}
        <Icon
          name={selected}
          className={css(styles.icon)}
          style={{ display: isSelected ? "block" : "none" }}
        />
        <Icon
          name={notSelected}
          className={css(styles.icon)}
          style={{ display: isSelected ? "none" : "block" }}
        />
        {renderDot()}
        {tooltipTop != null && (
          <div className={css(styles.nameLabel)}>{label}</div>
        )}
      </Link>
    </div>
  );
});

const offset = (el: HTMLDivElement | null | undefined) => {
  const { documentElement } = document;
  if (documentElement == null || el == null) {
    return null;
  }
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || documentElement.scrollLeft,
    scrollTop = window.pageYOffset || documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

const useStylesheet = ({
  tooltipTop,
}: Props & {
  tooltipTop: number | null | undefined;
}) => {
  const redDotSize = 5;
  const { isRTL: isRightToLeft } = useLocalizationStore();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: "center",
          cursor: "pointer",
          opacity: 0.5,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: "5px 0px",
          position: "relative",
          overflow: "visible",
        },
        icon: {
          height: 40,
        },
        leftBar: {
          position: "absolute",
          left: 0,
          top: 10,
          bottom: 10,
          width: 3,
          backgroundColor: palettes.palaceBlues.DarkPalaceBlue,
        },
        dot: {
          position: "absolute",
          right: 15,
          top: 10,
          height: redDotSize,
          width: redDotSize,
          borderRadius: redDotSize,
        },
        notificationDot: {
          backgroundColor: palettes.reds.DarkRed,
        },
        nameLabel: {
          position: "fixed",
          top: tooltipTop ? tooltipTop + 10 : 10,
          left: isRightToLeft ? undefined : 50,
          right: isRightToLeft ? 50 : undefined,
          padding: "3px 7px",
          borderRadius: 12,
          fontSize: 13,
          backgroundColor: palettes.textColors.LightInk,
          color: palettes.textColors.White,
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
      }),
    [redDotSize, tooltipTop, isRightToLeft]
  );
};
