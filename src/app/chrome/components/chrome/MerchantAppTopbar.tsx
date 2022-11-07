import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Switch, Popover } from "@ContextLogic/lego";
import Chrome from "./Chrome";
import AppLocaleSelector from "../AppLocaleSelector";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Merchant Store */
import { useApolloStore } from "@core/stores/ApolloStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useEnvironmentStore } from "@core/stores/EnvironmentStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useThemeStore } from "@core/stores/ThemeStore";

/* Merchant Plus Components */
import MerchantPlus, { MerchantPlusMode } from "../MerchantPlus";

import { useTheme } from "@core/stores/ThemeStore";
import NotificationsButton from "./NotificationsButton";

/* Relative Imports */
import PlusUserAvatar from "./PlusUserAvatar";
import MerchantAppSearch from "./MerchantAppSearch";
import { useAppTopBarData } from "../../toolkit";
import {
  ChromeNavigationNode,
  useChromeContext,
} from "@core/stores/ChromeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";

import Link from "@core/components/Link";
import { SearchStoreProvider } from "@chrome/search/searchStore";

type MerchantAppTopbarProps = BaseProps & {
  readonly disableMenu?: boolean;
  readonly showMenuDot?: boolean;
  readonly tree: ChromeNavigationNode;
};

const MerchantAppTopbar: React.FC<MerchantAppTopbarProps> = ({
  style,
  className,
  disableMenu,
  showMenuDot,
  tree,
}: MerchantAppTopbarProps) => {
  const styles = useStylesheet();
  const { setIsDrawerOpen } = useChromeContext();
  const apolloStore = useApolloStore();
  const { isVerySmallScreen } = useDeviceStore();
  const { isProd, env } = useEnvironmentStore();
  const { textBlack, textWhite, textDark } = useTheme();
  const { topbarBackground } = useThemeStore();

  const appIconTheme: MerchantPlusMode = useMemo(() => {
    switch (env) {
      case "fe_qa_staging":
      case "sandbox":
      case "stage":
        return "white";
      default:
        return "default";
    }
  }, [env]);

  const { data } = useAppTopBarData();
  if (data == null) {
    return null;
  }

  const {
    su,
    currentMerchant: { id: merchantId, isStoreMerchant, canAccessHome },
  } = data;
  const canToggleAdminEdit = su?.hasPermission || false;

  const hasMerchantId = merchantId != null;
  const canSeeUpdatesSwitch = isProd && canToggleAdminEdit;

  return (
    <SearchStoreProvider tree={tree}>
      <Chrome.TopBar
        renderLogo={() => (
          <Layout.FlexRow>
            {!disableMenu && (
              <div
                onClick={() => {
                  setIsDrawerOpen((cur: boolean) => !cur);
                }}
                className={css(styles.burgerContainer)}
              >
                <Icon
                  className={css(styles.burger)}
                  name="menu"
                  size={20}
                  color={appIconTheme === "white" ? textWhite : textDark}
                />
                {showMenuDot && <div className={css(styles.dot)} />}
              </div>
            )}
            <Link href="/home">
              <MerchantPlus mode={appIconTheme} className={css(styles.logo)} />
            </Link>
          </Layout.FlexRow>
        )}
        renderSearch={
          hasMerchantId && canAccessHome && !isVerySmallScreen
            ? () => <MerchantAppSearch />
            : undefined
        }
        backgroundColor={topbarBackground}
        className={css(styles.root, style, className)}
      >
        <Layout.FlexRow>
          {canSeeUpdatesSwitch && (
            <Popover
              popoverContent={
                apolloStore.adminUpdatesAllowed
                  ? `Updates allowed`
                  : `Updates off`
              }
              position="bottom center"
            >
              <Switch
                onToggle={(isOn) => {
                  if (isOn) {
                    apolloStore.allowAdminUpdates();
                  } else {
                    apolloStore.blockAdminUpdates();
                  }
                }}
                isOn={apolloStore.adminUpdatesAllowed}
                showText={false}
                className={css(styles.item)}
              />
            </Popover>
          )}
          {!isStoreMerchant && (
            <NotificationsButton className={css(styles.item)} />
          )}
          <PlusUserAvatar className={css(styles.avatar, styles.item)} />
          <AppLocaleSelector
            textColor={appIconTheme == "white" ? textWhite : textBlack}
            className={css(styles.item)}
          />
        </Layout.FlexRow>
      </Chrome.TopBar>
    </SearchStoreProvider>
  );
};

export default observer(MerchantAppTopbar);

const useStylesheet = () => {
  const { isRTL: isRightToLeft } = useLocalizationStore();
  const { borderPrimary, negativeDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderBottom: `solid 1px ${borderPrimary}`,
        },
        avatar: {
          marginRight: isRightToLeft ? undefined : 15,
          marginLeft: isRightToLeft ? 15 : undefined,
        },
        logo: {
          marginLeft: 7,
          minWidth: 120,
        },
        burgerContainer: {
          position: "relative",
          flexShrink: 0,
        },
        burger: {
          height: 20,
          marginRight: 15,
          cursor: "pointer",
        },
        notification: {
          height: 15,
        },
        switchText: {
          marginLeft: 5,
        },
        item: {
          marginLeft: 20,
        },
        dot: {
          height: 6,
          width: 6,
          borderRadius: 3,
          backgroundColor: negativeDark,
          position: "absolute",
          left: 18,
          top: -3,
        },
      }),
    [isRightToLeft, borderPrimary, negativeDark],
  );
};
