import React, { useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { NavSideMenu as SideMenu } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal, weightBold } from "@toolkit/fonts";

/* Merchant Components */
import OperationBadge from "@merchant/component/external/api-explorer-v3/OperationBadge";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import ApiExplorerStore from "@merchant/stores/v3-api-explorer/ApiExplorerStore";
import {
  MenuItem,
  MenuSubItem,
} from "@merchant/stores/v3-api-explorer/ApiExplorerStore";
import { useTheme, useThemeStore } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

export type NavbarProps = BaseProps & {
  readonly store: ApiExplorerStore;
};

const Navbar = (props: NavbarProps) => {
  const { store, className, style } = props;
  const { menuItems, baseUrl } = store;
  const styles = useStylesheet();
  const rootStyle = css(style, className);

  const [expandedList, setExpandedList] = useState<Array<boolean>>(
    menuItems.map(() => false)
  );
  const navigationStore = useNavigationStore();

  const setMenuItemExpanded = (index: number, expanded: boolean) => {
    setExpandedList([
      ...expandedList.slice(0, index),
      expanded,
      ...expandedList.slice(index + 1),
    ]);
  };

  const renderMenuItemTitle = (title: string, httpVerb: string) => {
    return (
      <>
        <OperationBadge className={css(styles.itemTitleTag)} type={httpVerb} />
        <span className={css(styles.itemTitleText)}>{title}</span>
      </>
    );
  };

  return (
    <SideMenu style={rootStyle}>
      <div className={css(styles.title)}>
        <span>API Explorer</span>
      </div>
      {menuItems &&
        menuItems.map(({ title, subItems, tag }: MenuItem, index: number) => (
          <SideMenu.Section
            title={title}
            key={tag}
            expanded={expandedList[index]}
            onExpandToggled={(expanded: boolean) => {
              setMenuItemExpanded(index, expanded);
            }}
            prefixedPadding={20}
          >
            {subItems &&
              subItems.map(
                (
                  { title, httpVerb, operationId }: MenuSubItem,
                  idx: number
                ) => (
                  <SideMenu.Item
                    key={operationId}
                    title={() => {
                      return renderMenuItemTitle(title, httpVerb);
                    }}
                    style={styles.itemTitleContent}
                    onClick={() => {
                      navigationStore.pushPath(
                        `${baseUrl || ""}/${operationId}`
                      );
                    }}
                  />
                )
              )}
          </SideMenu.Section>
        ))}
    </SideMenu>
  );
};
export default observer(Navbar);

const useStylesheet = () => {
  const { textWhite, textBlack } = useTheme();
  const { primary: wishBlue } = useThemeStore().currentAppTheme("MERCHANT");

  return StyleSheet.create({
    title: {
      textAlign: "center",
      backgroundColor: wishBlue,
      marginBottom: 28,
      display: "flex",
      justifyContent: "center",
      lineHeight: "50px",
      color: textBlack,
      fontSize: 28,
      fontWeight: weightBold,
    },
    logo: {
      padding: 30,
    },
    itemTitleContent: {
      display: "flex",
      justifyContent: "space-between",
    },
    itemTitleTag: {
      lineHeight: "13px",
      marginRight: 6,
      marginTop: 2,
      width: 32,
      height: 13,
      fontSize: 11,
      color: textWhite,
    },
    itemTitleText: {
      verticalAlign: "middle",
      overflow: "hidden",
      textOverflow: "hidden",
      width: "calc(100% - 38px)",
      fontSize: 13,
      fontWeight: weightNormal,
      whiteSpace: "normal",
    },
  });
};
