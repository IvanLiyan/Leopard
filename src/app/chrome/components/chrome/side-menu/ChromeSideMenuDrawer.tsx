//
//  ChromeSideMenuDrawer.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { Text, Layout } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import ChromeSideMenuButton, { ButtonPadding } from "./ChromeSideMenuButton";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode, SideMenuCounts } from "@chrome/toolkit";

type Props = BaseProps & {
  readonly tree: NavigationNode;
  readonly onNodeClick?: (node: NavigationNode) => void;
  readonly counts?: SideMenuCounts;
};

export const SideMenuDrawerSize = 230;

type NodeSet = Set<NavigationNode>;

const ChromeSideMenuDrawer: React.FC<Props> = ({
  className,
  style,
  tree,
  counts,
  onNodeClick,
}: Props) => {
  const [expandedNodes, setExpandedNodes] = useState<NodeSet>(new Set());
  const styles = useStylesheet();

  const children = tree.children.filter((child: any) => child.showInSideMenu);
  return (
    <Layout.FlexColumn
      className={css(styles.root, className, style)}
      alignItems="stretch"
    >
      <Text className={css(styles.title)} weight="medium">
        {tree.label}
      </Text>
      {children.map((node: any) => {
        const expanded = expandedNodes.has(node);
        return (
          <ChromeSideMenuButton
            key={node.label}
            node={node}
            onClick={(clickedNode: NavigationNode) => {
              if (onNodeClick != null) {
                onNodeClick(clickedNode);
              }

              const canExpand = node.children.length > 0;
              if (!canExpand) {
                return;
              }

              const newSet = new Set(expandedNodes);
              if (expanded) {
                newSet.delete(node);
              } else {
                newSet.add(node);
              }
              setExpandedNodes(newSet);
            }}
            expand={expanded}
            counts={counts}
            expandable
          />
        );
      })}
    </Layout.FlexColumn>
  );
};

export default observer(ChromeSideMenuDrawer);

const useStylesheet = () => {
  const { surfaceLightest, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: `0px ${ButtonPadding}px 80px ${ButtonPadding}px`,
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: surfaceLightest,
        },
        title: {
          margin: "20px 10px 10px 10px",
          textTransform: "uppercase",
          fontSize: 13,
          color: textLight,
        },
      }),
    [surfaceLightest, textLight],
  );
};
