import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, Switch, Popover } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Icon from "@core/components/Icon";
import Link from "@deprecated/components/Link";
import { useApolloStore } from "@core/stores/ApolloStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useEnvironmentStore } from "@core/stores/EnvironmentStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useThemeStore, useTheme } from "@core/stores/ThemeStore";
import {
  ChromeNavigationNode,
  useChromeContext,
} from "@core/stores/ChromeStore";
import { ci18n } from "@core/toolkit/i18n";
import { css } from "@core/toolkit/styling";
import { merchFeUrl } from "@core/toolkit/router";

import { useAppTopBarData } from "@chrome/toolkit";
import { SearchStoreProvider } from "@chrome/search/searchStore";
import AppLocaleSelector from "@chrome/components/AppLocaleSelector";
import WishLogo, { WishLogoMode } from "@chrome/components/WishLogo";

import Chrome from "./Chrome";
import NotificationsButton from "./NotificationsButton";
import PlusUserAvatar from "./PlusUserAvatar";
import MerchantAppSearch from "./MerchantAppSearch";
import LaunchToQmsBtn from "../LaunchToQmsBtn";
import { getUrl } from "@core/toolkit/qoo10redirect";

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

  const appIconTheme: WishLogoMode = useMemo(() => {
    switch (env) {
      case "fe_qa_staging":
      case "sandbox":
      case "stage":
        return "white";
      default:
        return "ink";
    }
  }, [env]);

  const { data } = useAppTopBarData();
  if (data == null) {
    return null;
  }

  const {
    su,
    currentMerchant: {
      id: merchantId,
      isStoreMerchant,
      canAccessHome,
      isQoo10Candidate,
      isQoo10Registered,
    },
  } = data;

  const canToggleAdminEdit = su?.hasPermission || false;

  const hasMerchantId = merchantId != null;
  const canSeeUpdatesSwitch = isProd && canToggleAdminEdit;

  const launchToQms = async () => {
    if (isQoo10Registered) {
      try {
        const res = await getUrl({ name: "DEFAULT" });
        const redirectUrl: string | undefined = res?.currentMerchant
          ?.redirectToQoo10?.redirectUrl as string;
        window.open(redirectUrl, "_blank");
      } catch {
        return false;
      }
    } else {
      window.open("https://plus.wish.com/welcome_wish_merchant", "_blank");
    }
  };

  return (
    <SearchStoreProvider tree={tree}>
      <Chrome.TopBar
        renderLogo={() => (
          <Layout.FlexRow>
            {!disableMenu && (
              <Layout.FlexColumn
                alignItems="center"
                style={styles.burgerContainer}
                onClick={() => {
                  setIsDrawerOpen((cur: boolean) => !cur);
                }}
                role="button"
                aria-label={ci18n(
                  "Description of a button that toggles the nav",
                  "Toggle navigation",
                )}
                data-cy="hamburger-icon"
              >
                <Icon
                  style={styles.burger}
                  name="menu"
                  size={20}
                  color={appIconTheme === "white" ? textWhite : textDark}
                />
                {showMenuDot && <div className={css(styles.dot)} />}
              </Layout.FlexColumn>
            )}
            <Link href={merchFeUrl("/home")}>
              <WishLogo mode={appIconTheme} style={styles.logo} />
            </Link>
            {isQoo10Candidate && (
              <Link
                onClick={(event) => {
                  event.preventDefault();
                  void launchToQms();
                }}
              >
                <LaunchToQmsBtn style={styles.logo} />
              </Link>
            )}
          </Layout.FlexRow>
        )}
        renderSearch={
          hasMerchantId && canAccessHome && !isVerySmallScreen
            ? () => <MerchantAppSearch />
            : undefined
        }
        backgroundColor={topbarBackground}
        style={[styles.root, style, className]}
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
                style={styles.item}
              />
            </Popover>
          )}
          {!isStoreMerchant && <NotificationsButton style={styles.item} />}
          <PlusUserAvatar style={[styles.avatar, styles.item]} />
          <AppLocaleSelector
            textColor={appIconTheme == "white" ? textWhite : textBlack}
            style={styles.item}
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
          cursor: "pointer",
        },
        burger: {
          height: 20,
          marginRight: 15,
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
