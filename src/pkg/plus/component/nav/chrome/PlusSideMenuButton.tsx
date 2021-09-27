import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { AnimatePresence, motion } from "framer-motion";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";

import PlusSideMenuInnerButton from "./PlusSideMenuInnerButton";

/* Type Imports */
import { IconName } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode } from "@toolkit/chrome";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly onMouseOver?: () => unknown;
  readonly counts?: {
    readonly [key: string]: number;
  };
  readonly expandWhenActive?: boolean;
};

type IconSet = { readonly selected: IconName; readonly notSelected: IconName };

export const IconMappings: {
  [key: string]: IconSet;
} = {
  home: {
    selected: "zHome",
    notSelected: "zHome",
  },
  products: {
    selected: "zTag",
    notSelected: "zTag",
  },
  orders: {
    selected: "zPickUp",
    notSelected: "zPickUp",
  },
  support: {
    selected: "zComment",
    notSelected: "zComment",
  },
  performance: {
    selected: "zBarChart",
    notSelected: "zBarChart",
  },
  infractions: {
    selected: "zWarning",
    notSelected: "zWarning",
  },
  "product-boost": {
    selected: "zProductBoost",
    notSelected: "zProductBoost",
  },
  marketing: {
    selected: "zProductBoost",
    notSelected: "zProductBoost",
  },
  "collection-boost": {
    selected: "zCategories",
    notSelected: "zCategories",
  },
  logistics: {
    selected: "zInbound",
    notSelected: "zInbound",
  },
  "early-payments": {
    selected: "zCard",
    notSelected: "zCard",
  },
  payments: {
    selected: "zCard",
    notSelected: "zCard",
  },
  account: {
    selected: "zUser",
    notSelected: "zUser",
  },
  more: {
    selected: "zMoreHorizontal",
    notSelected: "zMoreHorizontal",
  },
};

const PlusSideMenuButton: React.FC<Props> = (props: Props) => {
  const { className, style, node, expandWhenActive = true } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { nodeid, url, label } = node;
  const isActive = useIsActive(node);
  const styles = useStylesheet({ isHovered, isActive });

  if (nodeid == null) {
    return null;
  }

  const iconSet = IconMappings[nodeid];

  const visibleChildren = node.children.filter(
    (child) => child.show_in_side_menu
  );
  const isOpen = expandWhenActive && isActive && visibleChildren.length > 0;

  return (
    <div
      className={css(styles.root, className, style)}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className={css(styles.labelContainer)}
        href={url}
        fadeOnHover={false}
      >
        {isActive && <div className={css(styles.leftBar)} />}
        {iconSet && (
          <div className={css(styles.iconContainer)}>
            <Icon
              name={iconSet.selected}
              className={css(styles.icon)}
              style={{ display: isActive ? "block" : "none" }}
            />
            <Icon
              name={iconSet.notSelected}
              className={css(styles.icon)}
              style={{ display: isActive ? "none" : "block" }}
            />
          </div>
        )}
        <div className={css(styles.nameLabel)}>{label}</div>
      </Link>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={css(styles.children)}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto" },
              collapsed: { height: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            {visibleChildren.map((child) => (
              <PlusSideMenuInnerButton
                className={css(styles.child)}
                key={child.label}
                node={child}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default observer(PlusSideMenuButton);

const useIsActive = (currentNode: NavigationNode): boolean => {
  const { pageSearchResult } = useNavigationStore();
  return useMemo(() => {
    if (!pageSearchResult) {
      return false;
    }
    const { payload } = pageSearchResult;
    if (!payload) {
      return false;
    }

    if (
      payload.node.nodeid == currentNode.nodeid ||
      payload.node.url == currentNode.url
    ) {
      return true;
    }

    return payload.parents.some((parent) => {
      const isMatch =
        (parent.nodeid != null && parent.nodeid == currentNode.nodeid) ||
        (parent.url != null && parent.url == currentNode.url);
      return isMatch;
    });
  }, [currentNode, pageSearchResult]);
};

const useStylesheet = ({
  isHovered,
  isActive,
}: {
  readonly isHovered: boolean;
  readonly isActive: boolean;
}) => {
  const redDotSize = 5;
  const { negative, primary, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        labelContainer: {
          cursor: "pointer",
          pointerEvents: "auto",
          position: "relative",
          maxHeight: 40,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          padding: "10px 10px",
          ":hover": {
            opacity: 0.6,
          },
        },
        icon: {
          height: 25,
        },
        iconContainer: {
          width: 40,
          marginRight: 10,
        },
        leftBar: {
          position: "absolute",
          left: 0,
          top: 10,
          bottom: 10,
          width: 3,
          backgroundColor: primary,
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
          backgroundColor: negative,
        },
        nameLabel: {
          fontWeight: fonts.weightSemibold,
          fontSize: 16,
          color: isActive ? primary : textLight,
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        children: {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        child: {
          margin: "10px 10px 10px 60px",
        },
      }),
    [redDotSize, isActive, negative, primary, textLight]
  );
};
