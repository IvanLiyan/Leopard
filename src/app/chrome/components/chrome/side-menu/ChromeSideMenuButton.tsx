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
import NewBadge from "@chrome/components/chrome/badges/NewBadge";
import BetaBadge from "@chrome/components/chrome/badges/BetaBadge";
import NotificationCountBadge from "@chrome/components/chrome/badges/NotificationCountBadge";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode, SideMenuCounts, getNodeCount } from "@chrome/toolkit";
import { ChromeBadgeType } from "@schema";

import { IconName } from "@ContextLogic/zeus";
import Icon from "@core/components/Icon";

import Link from "@core/components/Link";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly onClick?: (clickedNode: NavigationNode) => unknown;
  readonly expand?: boolean;
  readonly expandable?: boolean;
  readonly leadingPadding?: number;
  readonly counts?: SideMenuCounts;
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
  videos: "camera",
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
  const { primary, textDark } = useTheme();

  const {
    label,
    children,
    url,
    badge,
    nodeid,
    open_in_new_tab: openInNewTab,
  } = node;
  const icon = nodeid != null ? IconMappings[nodeid] : undefined;
  const expandable = allowExpansion && children?.length > 0;
  const notificationCount = counts && getNodeCount(node, counts);

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
    >
      <Link href={url} fadeOnHover={false} openInNewTab={openInNewTab}>
        <Layout.FlexRow
          style={styles.labelContainer}
          justifyContent="space-between"
          onClick={
            openInNewTab
              ? undefined
              : () => {
                  if (onClick != null) {
                    onClick(node);
                  }
                }
          }
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Layout.FlexRow alignItems="center">
            {icon && (
              <Icon
                name={icon}
                size={20}
                className={css(styles.icon)}
                color={isHovering ? primary : textDark}
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
      </Link>

      {expand && expandable && (
        <>
          {children.map((node) => (
            <ChromeSideMenuButton
              key={node.label}
              node={node}
              leadingPadding={ButtonPadding}
              onClick={onClick}
              counts={counts}
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
  isHovering: boolean,
) => {
  const { textDark, primary, primaryLight } = useTheme();
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
          color: isHovering ? primary : textDark,
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
    [leadingPadding, textDark, primary, primaryLight, isHovering],
  );
};

export const useHasNotificationBadge = (
  node: NavigationNode,
  badgeType: ChromeBadgeType,
): boolean => {
  const getHasNotificationBadge: (arg0: NavigationNode) => boolean =
    useCallback(
      ({ badge, children }: NavigationNode) => {
        const type = badge?.type;
        if (type == badgeType) {
          return true;
        }

        return children.some((child) => getHasNotificationBadge(child));
      },
      [badgeType],
    );

  return useMemo(
    () => getHasNotificationBadge(node),
    [node, getHasNotificationBadge],
  );
};