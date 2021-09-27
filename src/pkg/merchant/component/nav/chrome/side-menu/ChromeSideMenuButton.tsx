//
//  ChromeSideMenuButton.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, useCallback, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Chevron, Text } from "@ContextLogic/lego";
import NewBadge from "@merchant/component/nav/chrome/badges/NewBadge";
import BetaBadge from "@merchant/component/nav/chrome/badges/BetaBadge";
import NotificationCountBadge from "@merchant/component/nav/chrome/badges/NotificationCountBadge";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode, NavigationBadgeType } from "@toolkit/chrome";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

import { useNodeCount } from "@toolkit/chrome";
import { IconName } from "@ContextLogic/zeus";
import { Icon } from "@merchant/component/core";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly onClick?: () => unknown;
  readonly expand?: boolean;
  readonly expandable?: boolean;
  readonly leadingPadding?: number;
  readonly counts?: {
    readonly [key: string]: number;
  };
};

export const IconMappings: {
  readonly [key: string]: IconName;
} = {
  home: "home",
  products: "tag",
  orders: "shoppingCartArrow",
  support: "comment",
  performance: "barChart",
  infractions: "warning",
  advertising: "bullhorn",
  promotions: "ticket",
  payments: "card",
  overview_disputes: "gavel",
  fulfillment_services: "inbound",
  help: "help",
  settings: "gear",
  overview: "globalLookup",
};

export const ButtonPadding = 10;

const ChromeSideMenuButton: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    node,
    expand,
    counts,
    leadingPadding,
    expandable: allowExpansion,
    onClick,
    ...otherProps
  } = props;
  const [isHovering, setIsHovering] = useState(false);

  const styles = useStylesheet(props, isHovering);
  const { primary, textBlack } = useTheme();
  const navigationStore = useNavigationStore();

  const { label, children, url, badge, nodeid } = node;
  const icon = nodeid != null ? IconMappings[nodeid] : undefined;
  const expandable = allowExpansion && children.length > 0;
  const notificationCount = useNodeCount(node);

  const renderBadge = () => {
    if (notificationCount != null && notificationCount > 0) {
      return <NotificationCountBadge count={notificationCount} />;
    }

    if (badge == null) {
      return null;
    }
    const currentTime = new Date().getTime() / 1000;
    const { type, expiry_date: expiryDate } = badge;

    if (expiryDate < currentTime) {
      return null;
    }

    if (type == "BETA") {
      return <BetaBadge />;
    }

    if (type == "NEW") {
      return <NewBadge />;
    }

    return null;
  };

  return (
    <Layout.FlexColumn
      {...otherProps}
      style={[styles.root, className, style]}
      alignItems="stretch"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Layout.FlexRow
        style={styles.labelContainer}
        justifyContent="space-between"
        onClick={() => {
          if (onClick != null) {
            onClick();
          }
          // https://jira.wish.site/browse/MKL-43252
          navigationStore.navigate(url, {
            fullReload: nodeid == "pb-create-campaign",
          });
        }}
      >
        <Layout.FlexRow alignItems="center">
          {icon && (
            <Icon
              name={icon}
              size={20}
              className={css(styles.icon)}
              color={isHovering ? primary : textBlack}
            />
          )}
          <Text style={styles.label} weight="semibold">
            {label}
          </Text>
        </Layout.FlexRow>
        <Layout.FlexRow>
          {renderBadge()}
          {expandable && (
            <Chevron
              direction={expand ? "down" : "right"}
              style={styles.chevron}
            />
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>

      {expand && expandable && (
        <>
          {children.map((node) => (
            <ChromeSideMenuButton
              key={node.label}
              node={node}
              leadingPadding={ButtonPadding}
              onClick={onClick}
            />
          ))}
        </>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(ChromeSideMenuButton);

const useStylesheet = (
  { expand, leadingPadding = 0, node }: Props,
  isHovering: boolean
) => {
  const { textBlack, primary, primaryLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          pointerEvents: "auto",
          cursor: "pointer",
          backgroundColor: isHovering ? primaryLight : undefined,
          padding: "10px 0",
        },
        label: {
          wordWrap: "break-word",
          fontSize: 14,
          marginRight: 10,
          color: isHovering ? primary : textBlack,
          lineHeight: "unset",
        },
        labelContainer: {
          paddingLeft: leadingPadding + ButtonPadding,
          paddingRight: ButtonPadding,
          borderRadius: 4,
        },
        chevron: {
          height: 10,
          marginLeft: 10,
          pointerEvents: "none",
        },
        icon: {
          marginRight: 16,
        },
      }),
    [leadingPadding, textBlack, primary, primaryLight, isHovering]
  );
};

export const useHasNotificationBadge = (
  node: NavigationNode,
  badgeType: NavigationBadgeType
): boolean => {
  const getHasNotificationBadge: (
    arg0: NavigationNode
  ) => boolean = useCallback(
    ({ badge, children }: NavigationNode) => {
      const type = badge?.type;
      if (type == badgeType) {
        return true;
      }

      return children.some((child) => getHasNotificationBadge(child));
    },
    [badgeType]
  );

  return useMemo(() => getHasNotificationBadge(node), [
    node,
    getHasNotificationBadge,
  ]);
};
