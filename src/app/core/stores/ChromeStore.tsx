/*
    stores/ChromeStore.ts

    Created by Lucas Liepert on 2/28/2022.
    Copyright © 2022-present ContextLogic Inc. All rights reserved.
*/

import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import { useQuery } from "@apollo/client";
import { StyleSheet } from "aphrodite";
import { gql } from "@gql";

import { css } from "@core/toolkit/styling";

import { Layout, LoadingIndicator } from "@ContextLogic/lego";
import Toast from "@core/components/Toast";
import Chrome from "../../chrome/components/chrome/Chrome";
import ChromeSideMenuButton from "../../chrome/components/chrome/side-menu/ChromeSideMenuButton";
import MerchantAppTopbar from "../../chrome/components/chrome/MerchantAppTopbar";
import { TopBarHeight } from "../../chrome/components/chrome/ChromeTopBar";
import {
  GetAlertsRequestType,
  GET_ALERTS_QUERY,
  SIDE_MENU_COUNTS_QUERY,
  SideMenuCounts,
  getNodeCount,
} from "../../chrome/toolkit";

import { useTheme } from "@core/stores/ThemeStore";
import { useUserStore } from "@core/stores/UserStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { ChromeBadgeSchema, ChromeNodeSchema, Datetime } from "@schema";
import { useTheme as useAtlasTheme } from "@ContextLogic/atlas-ui";

type ChromeContext = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChromeContext = createContext<ChromeContext>({
  isDrawerOpen: false,
  setIsDrawerOpen: () => {
    throw "Attempting to use un-instantiated ChromeStore";
  },
});

const BOTTOM_NODES: ReadonlySet<string> = new Set([
  "account",
  "settings",
  "more",
  "help",
]);

// TODO [lliepert]: remove reference to legacy store nomenclature (https://jira.wish.site/browse/MKL-55300)
// TODO [lliepert]: update with actual query once we have the gql finished
// TODO [lliepert]: bring back loading between pages
export const CHROME_STORE_INITIAL_QUERY = gql(`
  query ChromeStore_InitialQuery {
    chrome {
      merchantGraph {
        ...NodeElements
        children {
          ...NodeElements
          children {
            ...NodeElements
            children {
              ...NodeElements
              children {
                ...NodeElements
              }
            }
          }
        }
      }
    }
  }
`);

export const NODE_ELEMENTS_FIELDS = gql(`
  fragment NodeElements on ChromeNodeSchema {
    url
    path
    label
    overviewLabel
    badge {
      badgeType
      expiryDate {
        unix
        datetime
      }
    }
    nodeid
    keywords
    description
    searchPhrase
    showInSideMenu
    openInNewTab
    totalHits
    mostRecentHit {
      unix
      mmddyyyy
    }
    countSelectors
  }
`);

export type ChromeNavigationNode = Pick<
  ChromeNodeSchema,
  | "url"
  | "path"
  | "label"
  | "overviewLabel"
  | "nodeid"
  | "keywords"
  | "description"
  | "searchPhrase"
  | "showInSideMenu"
  | "openInNewTab"
  | "totalHits"
  | "countSelectors"
> & {
  readonly badge?:
    | (Pick<ChromeBadgeSchema, "badgeType"> & {
        readonly expiryDate?: Pick<Datetime, "datetime" | "unix"> | null;
      })
    | null;
  readonly mostRecentHit?: Pick<Datetime, "datetime" | "unix"> | null;
  readonly children?: ReadonlyArray<ChromeNavigationNode> | null;
};

export type ChromeStoreInitialQueryResponse = {
  // will update once gql is finished
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly chrome: {
    readonly merchantGraph: ChromeNavigationNode;
  };
};

export const ChromeProvider: React.FC<{
  readonly initialData?: ChromeStoreInitialQueryResponse;
}> = ({ children, initialData }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const styles = useStylesheet();
  const { surfaceLightest } = useTheme();
  const { loggedInMerchantUser } = useUserStore();
  const { isRTL } = useLocalizationStore();

  const {
    data: alerts,
    loading: isLoadingIssues,
    refetch: refetchAlerts,
  } = useQuery<GetAlertsRequestType, void>(GET_ALERTS_QUERY, {
    skip: loggedInMerchantUser == null,
  });

  const { data: counts, refetch: refetchCounts } = useQuery<
    SideMenuCounts,
    void
  >(SIDE_MENU_COUNTS_QUERY, { skip: loggedInMerchantUser == null });

  useEffect(() => {
    if (loggedInMerchantUser != null) {
      void (async () => await refetchAlerts())();
      void (async () => await refetchCounts())();
    }
  }, [loggedInMerchantUser, refetchAlerts, refetchCounts]);

  const tree = initialData?.chrome?.merchantGraph;

  const bottomNodes: ReadonlyArray<ChromeNavigationNode> | null =
    useMemo(() => {
      if (tree == null) {
        return null;
      }
      return (tree?.children ?? []).filter(
        (node) => node.nodeid != null && BOTTOM_NODES.has(node.nodeid),
      );
    }, [tree]);

  const filteredTree: ChromeNavigationNode | null | undefined = useMemo(() => {
    if (tree == null) {
      return null;
    }
    return {
      ...tree,
      children: (tree?.children ?? []).filter(
        (node) => node.nodeid != null && !BOTTOM_NODES.has(node.nodeid),
      ),
    };
  }, [tree]);

  const disableMenu = !loggedInMerchantUser?.merchantId; // ||
  // !loggedInMerchantUser?.can_access_home;

  const hasNotifications =
    filteredTree && counts && getNodeCount(filteredTree, counts) > 0;

  // TODO [lliepert]: looks like we're not showing chrome until
  // the get alerts query resolves; this is really slow rn so it's hiding
  // chrome when we don't need to be (can just pop the alerts in after)
  // fix this (https://jira.wish.site/browse/MKL-58592)

  return (
    <ChromeContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      {tree == null ? (
        <Layout.FlexColumn alignItems="stretch">
          {children}
          <div className={css(styles.toastContainerWithoutChrome)}>
            <Toast />
          </div>
        </Layout.FlexColumn>
      ) : (
        <Chrome>
          <Chrome.Content
            sideMenuWidth={0}
            isRightToLeft={isRTL}
            alerts={alerts?.currentUser.alerts}
          >
            <Layout.FlexColumn style={styles.content} alignItems="stretch">
              {children}
              <div className={css(styles.toastContainer)}>
                <Toast contentAlignment="left" />
              </div>
              {isLoadingIssues && (
                <div className={css(styles.loadingScreen)}>
                  <LoadingIndicator type="spinner" size={40} />
                </div>
              )}
            </Layout.FlexColumn>
          </Chrome.Content>
          <Chrome.SideMenu
            enableDrawer
            tree={filteredTree}
            counts={counts}
            backgroundColor={surfaceLightest}
            sideMenuWidth={210}
            renderIcon={({ node }) => (
              <ChromeSideMenuButton node={node} counts={counts} />
            )}
            isRightToLeft={isRTL}
            renderBottomAnchor={(onNodeClicked) => {
              if (bottomNodes == null || bottomNodes.length == 0) {
                return null;
              }
              return (
                <Layout.FlexColumn>
                  {bottomNodes.map((node) => {
                    return (
                      <div key={node.label} onClick={() => onNodeClicked(node)}>
                        <ChromeSideMenuButton
                          node={node}
                          key={node.label}
                          counts={counts}
                        />
                      </div>
                    );
                  })}
                </Layout.FlexColumn>
              );
            }}
          />
          <MerchantAppTopbar
            tree={tree}
            disableMenu={disableMenu}
            showMenuDot={hasNotifications || false}
          />
        </Chrome>
      )}
    </ChromeContext.Provider>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  const { zIndex } = useAtlasTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          position: "relative",
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
        toastContainer: {
          position: "fixed",
          top: TopBarHeight,
          right: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          zIndex: zIndex.appBar,
        },
        toastContainerWithoutChrome: {
          position: "fixed",
          right: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          zIndex: zIndex.appBar,
        },
      }),
    [pageBackground, zIndex.appBar],
  );
};

export const useChromeContext = (): ChromeContext => {
  const chromeContext = useContext(ChromeContext);
  return chromeContext;
};
