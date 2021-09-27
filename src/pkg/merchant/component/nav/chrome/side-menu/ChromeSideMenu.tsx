//
//  ChromeSideMenu.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import posed from "react-pose";

/* Lego Components */
import { TopBarHeight } from "@merchant/component/nav/chrome/ChromeTopBar";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import ChromeSideMenuTextLabel from "./ChromeSideMenuTextLabel";
import ChromeSideMenuDrawer, {
  SideMenuDrawerSize,
} from "./ChromeSideMenuDrawer";

import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode } from "@toolkit/chrome";
import { Layout } from "@ContextLogic/lego";

type Props = BaseProps & {
  readonly tree: NavigationNode | null | undefined;
  readonly counts?: {
    readonly [key: string]: number;
  };
  readonly sideMenuWidth: number;
  readonly renderIcon?: (args: { readonly node: NavigationNode }) => ReactNode;
  readonly backgroundColor?: string;
  readonly isRightToLeft?: boolean;
  readonly enableDrawer?: boolean;
  readonly renderBottomAnchor?: (
    onClick: (node: NavigationNode) => void
  ) => ReactNode;
};

const ChromeSideMenu: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    tree,
    counts,
    renderIcon,
    isRightToLeft,
    enableDrawer = true,
    renderBottomAnchor,
  } = props;
  const contentRef = useRef<HTMLElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NavigationNode | null>(null);

  const drawerOpen =
    enableDrawer && selectedNode != null && selectedNode.children.length > 0;

  const styles = useStylesheet({
    ...props,
    drawerOpen,
  });

  const children: ReadonlyArray<NavigationNode> = tree
    ? tree.children.filter((child) => child.show_in_side_menu)
    : [];

  const DrawerContentContainer = useMemo(
    () =>
      posed.nav({
        open: isRightToLeft ? { marginRight: "0%" } : { marginLeft: "0%" },
        closed: isRightToLeft
          ? { marginRight: "-100%" }
          : { marginLeft: "-100%" },
        transition: { duration: 300 },
      }),
    [isRightToLeft]
  );

  const closeDrawer = useCallback(() => {
    if (!enableDrawer) {
      return;
    }
    setSelectedNode(null);
  }, [enableDrawer, setSelectedNode]);

  useEffect(() => {
    const { current: containerNode } = contentRef;
    if (!containerNode) {
      return;
    }

    const listener = (evt: Event) => {
      const targetEl: HTMLElement | null = evt.target as HTMLElement;
      if (containerNode.contains(targetEl)) {
        return;
      }
      closeDrawer();
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [closeDrawer]);

  const renderSideMenuChild = (node: NavigationNode) => {
    if (renderIcon) {
      return renderIcon({ node });
    }
    return (
      <ChromeSideMenuTextLabel key={node.label} node={node} counts={counts} />
    );
  };

  const onNodeClicked = (node: NavigationNode) => {
    setSelectedNode(node);
  };

  return (
    <Layout.FlexRow
      className={css(styles.root, className, style)}
      ref={contentRef}
      alignItems="stretch"
    >
      <Layout.FlexColumn
        className={css(styles.buttonsContainer)}
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Layout.FlexColumn
          className={css(styles.buttonsInnerContainer)}
          alignItems="stretch"
        >
          {children.map((node) => {
            return (
              <div key={node.label} onClick={() => onNodeClicked(node)}>
                {renderSideMenuChild(node)}
              </div>
            );
          })}
        </Layout.FlexColumn>
        {renderBottomAnchor && (
          <div className={css(styles.bottomAnchor)}>
            {renderBottomAnchor(onNodeClicked)}
          </div>
        )}
      </Layout.FlexColumn>
      {enableDrawer && (
        <DrawerContentContainer
          key="drawer"
          pose={drawerOpen ? "open" : "closed"}
          className={css(styles.expandedDrawer)}
        >
          {selectedNode && drawerOpen && tree != null && (
            <ChromeSideMenuDrawer
              tree={selectedNode}
              counts={counts}
              onNodeClick={(node: NavigationNode) => {
                if (
                  (node.path != null || node.url != null) &&
                  node.children.length == 0
                ) {
                  closeDrawer();
                }
              }}
            />
          )}
        </DrawerContentContainer>
      )}
    </Layout.FlexRow>
  );
};

export default observer(ChromeSideMenu);

const useStylesheet = ({
  drawerOpen,
  sideMenuWidth,
  backgroundColor,
  isRightToLeft = false,
}: Props & {
  readonly drawerOpen: boolean;
}) => {
  const { borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          top: TopBarHeight,
          left: isRightToLeft ? undefined : 0,
          right: isRightToLeft ? 0 : undefined,
          bottom: 0,
          position: "fixed",
          overflowX: "hidden",
          pointerEvents: drawerOpen ? "auto" : "none",
          zIndex: 999999,
        },
        buttonsContainer: {
          position: "relative",
          width: sideMenuWidth,
          borderRight: drawerOpen ? undefined : `solid 1px ${borderPrimary}`,
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: backgroundColor || surfaceLightest,
        },
        buttonsInnerContainer: {
          position: "relative",
          paddingTop: 10,
        },
        bottomAnchor: {
          paddingBottom: 5,
        },
        expandedDrawer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflowY: "auto",
          overflowX: "hidden",
          pointerEvents: "auto",
          backgroundColor: surfaceLightest,
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          zIndex: -1,
          // Reason: have to standardize the width due to design
          // eslint-disable-next-line local-rules/no-frozen-width
          width: SideMenuDrawerSize,
        },
      }),
    [
      drawerOpen,
      sideMenuWidth,
      backgroundColor,
      isRightToLeft,
      borderPrimary,
      surfaceLightest,
    ]
  );
};
