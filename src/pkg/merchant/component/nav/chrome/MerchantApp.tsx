import React, { useMemo, useRef, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Toast from "@merchant/component/core/Toast";
import Chrome from "@merchant/component/nav/chrome/Chrome";
import { TopBarHeight } from "@merchant/component/nav/chrome/ChromeTopBar";

import { Layout, LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import MerchantAppTopbar from "./MerchantAppTopbar";
import PlusSideMenuButton from "@plus/component/nav/chrome/PlusSideMenuButton";
import ChromeSideMenuButton from "./side-menu/ChromeSideMenuButton";

import { NavigationDrivenContainer } from "@toolkit/loadable/loadable";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  GetAlertsRequestType,
  GET_ALERTS_QUERY,
  NavigationNode,
} from "@toolkit/chrome";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { useDeviceStore } from "@merchant/stores/DeviceStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useQuery } from "react-apollo";
import { useApolloStore } from "@merchant/stores/ApolloStore";

type Props = BaseProps & {};

const BOTTOM_NODES: ReadonlySet<string> = new Set([
  "account",
  "settings",
  "more",
  "help",
]);

const MerchantApp: React.FC<Props> = ({ style, className }: Props) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const {
    userGraph: tree,
    isDrawerOpen,
    currentPath,
    currentContainer,
    isNavyBlueNav,
    progressiveLoadingStatus,
  } = useNavigationStore();
  const { isVerySmallScreen } = useDeviceStore();
  const { isPlusUser, loggedInMerchantUser } = useUserStore();
  const { isRTL: isRightToLeft } = useLocalizationStore();
  const { client } = useApolloStore();

  useEffect(() => {
    const { current: containerNode } = contentRef;
    if (!containerNode) {
      return;
    }

    const pageContentDump = document.getElementById("initial-page-content");
    if (pageContentDump) {
      containerNode.innerHTML = pageContentDump.innerHTML;
    }
  }, [contentRef]);

  const hideSideMenu =
    (isVerySmallScreen && !isDrawerOpen) || !loggedInMerchantUser?.merchant_id;
  const sideMenuWidth = hideSideMenu ? 0 : 210;
  const styles = useStylesheet({ sideMenuWidth });

  const bottomNodes: ReadonlyArray<NavigationNode> | null = useMemo(() => {
    if (tree == null) {
      return null;
    }
    return tree.children.filter(
      (node) => node.nodeid != null && BOTTOM_NODES.has(node.nodeid)
    );
  }, [tree]);

  const filteredTree: NavigationNode | null | undefined = useMemo(() => {
    if (tree == null) {
      return null;
    }
    return {
      ...tree,
      children: tree.children.filter(
        (node) => node.nodeid != null && !BOTTOM_NODES.has(node.nodeid)
      ),
    };
  }, [tree]);

  const { data, loading: isLoadingIssues } = useQuery<
    GetAlertsRequestType,
    void
  >(GET_ALERTS_QUERY, { client, skip: loggedInMerchantUser == null });

  const { surfaceLightest } = useTheme();

  const loadingScreen = (
    <div className={css(styles.loadingScreen)}>
      <LoadingIndicator type="spinner" size={40} />
    </div>
  );

  if (!isNavyBlueNav || (currentContainer && !currentContainer.showChrome)) {
    return <NavigationDrivenContainer />;
  }

  // Need DOM work in order to get old Backbone.js pages
  // to render inside the chrome's content.
  /* eslint-disable local-rules/no-dom-manipulation */
  /* eslint-disable react/forbid-dom-props */
  return (
    <Chrome className={css(style, className)}>
      <Chrome.Content
        sideMenuWidth={sideMenuWidth}
        isRightToLeft={isRightToLeft}
        alerts={data?.currentUser.alerts}
      >
        <Layout.FlexColumn className={css(styles.content)} alignItems="stretch">
          {currentContainer ? (
            <NavigationDrivenContainer />
          ) : (
            <div
              ref={contentRef}
              className={css(styles.contentInner)}
              style={{
                padding:
                  currentPath != "/" &&
                  loggedInMerchantUser != null &&
                  progressiveLoadingStatus == null
                    ? "20px"
                    : undefined,
              }}
              id="page-content"
            />
          )}
          <div className={css(styles.toastContainer)}>
            <Toast contentAlignment="left" />
          </div>
          {(progressiveLoadingStatus == "IN_PROGRESS" || isLoadingIssues) &&
            loadingScreen}
        </Layout.FlexColumn>
      </Chrome.Content>
      <Chrome.SideMenu
        tree={filteredTree}
        sideMenuWidth={sideMenuWidth}
        backgroundColor={surfaceLightest}
        renderIcon={({ node }) =>
          isPlusUser ? (
            <PlusSideMenuButton node={node} />
          ) : (
            <ChromeSideMenuButton node={node} />
          )
        }
        isRightToLeft={isRightToLeft}
        enableDrawer={!isPlusUser}
        renderBottomAnchor={(onNodeClicked) => {
          if (bottomNodes == null || bottomNodes.length == 0) {
            return null;
          }
          return (
            <Layout.FlexColumn>
              {bottomNodes.map((node) => {
                if (isPlusUser) {
                  return (
                    <PlusSideMenuButton
                      node={node}
                      key={node.label}
                      expandWhenActive={false}
                    />
                  );
                }

                return (
                  <div key={node.label} onClick={() => onNodeClicked(node)}>
                    <ChromeSideMenuButton node={node} key={node.label} />
                  </div>
                );
              })}
            </Layout.FlexColumn>
          );
        }}
      />
      <MerchantAppTopbar />
    </Chrome>
  );
};

export default observer(MerchantApp);

const useStylesheet = ({
  sideMenuWidth,
}: {
  readonly sideMenuWidth: number;
}) => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          position: "relative",
        },
        toast: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        },
        contentInner: {
          position: "relative",
        },
        toastContainer: {
          position: "fixed",
          top: TopBarHeight,
          right: 0,
          left: sideMenuWidth,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          zIndex: 999999,
        },
        pinnedFooter: {
          position: "fixed",
          left: sideMenuWidth,
          bottom: 0,
          right: 0,
        },
        loadingScreen: {
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: pageBackground,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [sideMenuWidth, pageBackground]
  );
};
