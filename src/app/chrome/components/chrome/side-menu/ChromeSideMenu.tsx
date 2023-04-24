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
import posed, { PoseGroup } from "react-pose";

/* Lego Components */
import { TopBarHeight } from "@chrome/components/chrome/ChromeTopBar";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Relative Imports */
import ChromeSideMenuTextLabel from "./ChromeSideMenuTextLabel";
import ChromeSideMenuDrawer, {
  SideMenuDrawerSize,
} from "./ChromeSideMenuDrawer";

import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SideMenuCounts } from "@chrome/toolkit";
import { Layout } from "@ContextLogic/lego";
import {
  ChromeNavigationNode,
  useChromeContext,
} from "@core/stores/ChromeStore";
import { useTheme as useAtlasTheme } from "@ContextLogic/atlas-ui";

type Props = BaseProps & {
  readonly tree: ChromeNavigationNode | null | undefined;
  readonly counts?: SideMenuCounts;
  readonly sideMenuWidth: number;
  readonly renderIcon?: (args: {
    readonly node: ChromeNavigationNode;
  }) => ReactNode;
  readonly backgroundColor?: string;
  readonly isRightToLeft?: boolean;
  readonly enableDrawer?: boolean;
  readonly renderBottomAnchor?: (
    onClick: (node: ChromeNavigationNode) => void,
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
    sideMenuWidth,
  } = props;
  const contentRef = useRef<HTMLElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<ChromeNavigationNode | null>(
    null,
  );
  const { isDrawerOpen, setIsDrawerOpen } = useChromeContext();

  const drawerOpen =
    enableDrawer &&
    selectedNode != null &&
    (selectedNode.children ?? []).length > 0;

  const styles = useStylesheet({
    ...props,
    drawerOpen,
  });

  const children: ReadonlyArray<ChromeNavigationNode> = tree
    ? (tree.children ?? []).filter((child) => child.showInSideMenu)
    : [];

  const SideMenuContentContainer = useMemo(
    () =>
      posed.nav({
        open: isRightToLeft ? { marginRight: 0 } : { marginLeft: 0 },
        closed: isRightToLeft
          ? { marginRight: -sideMenuWidth }
          : { marginLeft: -sideMenuWidth },
        transition: { duration: 200 },
      }),
    [isRightToLeft, sideMenuWidth],
  );

  const DrawerContentContainer = useMemo(
    () =>
      posed.nav({
        open: isRightToLeft ? { marginRight: 0 } : { marginLeft: 0 },
        closed: isRightToLeft
          ? { marginRight: -SideMenuDrawerSize - 2 }
          : { marginLeft: -SideMenuDrawerSize - 2 },
        transition: { duration: 200 },
      }),
    [isRightToLeft],
  );

  const OverlayContainer = useMemo(
    () =>
      posed.div({
        enter: { opacity: 0.8 },
        exit: { opacity: 0 },
        transition: { duration: 200 },
      }),
    [],
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

  const renderSideMenuChild = (node: ChromeNavigationNode) => {
    if (renderIcon) {
      return renderIcon({ node });
    }
    return <ChromeSideMenuTextLabel key={node.label} node={node} />;
  };

  const onNodeClicked = (node: ChromeNavigationNode) => {
    setSelectedNode(node);
  };

  const onOverlayClick = () => {
    closeDrawer();
    setIsDrawerOpen(false);
  };

  return (
    <PoseGroup flipMove={false}>
      {isDrawerOpen && (
        <OverlayContainer
          key="overlay"
          className={css(styles.overlay)}
          onClick={onOverlayClick}
        ></OverlayContainer>
      )}
      <SideMenuContentContainer
        className={css(styles.root, className, style)}
        ref={contentRef}
        pose={isDrawerOpen ? "open" : "closed"}
        key="sideMenu"
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
            withParent={false}
          >
            {selectedNode && drawerOpen && tree != null && (
              <ChromeSideMenuDrawer
                tree={selectedNode}
                counts={counts}
                onNodeClick={(node: ChromeNavigationNode) => {
                  if (
                    (node.path != null || node.url != null) &&
                    (node.children ?? []).length == 0
                  ) {
                    closeDrawer();
                    setIsDrawerOpen(false);
                  }
                }}
              />
            )}
          </DrawerContentContainer>
        )}
      </SideMenuContentContainer>
    </PoseGroup>
  );
};

export default observer(ChromeSideMenu);

const useStylesheet = ({
  drawerOpen,
  backgroundColor,
  isRightToLeft = false,
  sideMenuWidth,
}: Props & {
  readonly drawerOpen: boolean;
}) => {
  const { borderPrimary, surfaceLightest, modalBackground } = useTheme();
  const { zIndex } = useAtlasTheme();

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
          pointerEvents: "none",
          zIndex: zIndex.appBar,
          display: "flex",
          alignItems: "stretch",
          // Reason: Overlay has to take up the whole page width.
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "100%",
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
        overlay: {
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: modalBackground,
          pointerEvents: "auto",
          zIndex: zIndex.appBar,
        },
      }),
    [
      drawerOpen,
      backgroundColor,
      isRightToLeft,
      borderPrimary,
      sideMenuWidth,
      surfaceLightest,
      modalBackground,
      zIndex.appBar,
    ],
  );
};
