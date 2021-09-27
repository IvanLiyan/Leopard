import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Layout, Switch, Popover } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import Chrome from "@merchant/component/nav/chrome/Chrome";
import AppLocaleSelector from "@merchant/component/AppLocaleSelector";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useEnvironmentStore } from "@merchant/stores/EnvironmentStore";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import { useThemeStore } from "@merchant/stores/ThemeStore";

/* Merchant Plus Components */
import MerchantPlus, {
  MerchantPlusMode,
} from "@plus/component/nav/MerchantPlus";

import { useTheme } from "@merchant/stores/ThemeStore";
import NotificationsButton from "./NotificationsButton";

/* Relative Imports */
import PlusUserAvatar from "@plus/component/nav/chrome/PlusUserAvatar";
import MerchantAppSearch from "./MerchantAppSearch";
import { useAppTopBarData } from "@toolkit/chrome";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const MerchantAppTopbar: React.FC<BaseProps> = ({
  style,
  className,
}: BaseProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const apolloStore = useApolloStore();
  const { isVerySmallScreen } = useDimenStore();
  const { isProd, env } = useEnvironmentStore();
  const { textBlack, textWhite } = useTheme();
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
    currentMerchant: { id: merchantId, isStoreMerchant, isMerchantPlus },
  } = data;
  const canToggleAdminEdit = su?.hasPermission || false;

  const hasMerchantId = merchantId != null;

  const canShowSideMenuButton = isVerySmallScreen && hasMerchantId;
  const canSeeUpdatesSwitch = isProd && canToggleAdminEdit;

  return (
    <Chrome.TopBar
      renderLogo={() => (
        <Layout.FlexRow>
          {canShowSideMenuButton && (
            <div
              onClick={() => {
                navigationStore.isDrawerOpen = !navigationStore.isDrawerOpen;
              }}
            >
              <Icon className={css(styles.burger)} name="burgerWhite" />
            </div>
          )}
          <Link href={isMerchantPlus ? "/plus/home" : "/"}>
            <MerchantPlus mode={appIconTheme} className={css(styles.logo)} />
          </Link>
        </Layout.FlexRow>
      )}
      renderSearch={
        hasMerchantId && !isVerySmallScreen
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
  );
};

export default observer(MerchantAppTopbar);

const useStylesheet = () => {
  const { isRTL: isRightToLeft } = useLocalizationStore();
  const { borderPrimary } = useTheme();
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
        },
        burger: {
          height: 40,
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
      }),
    [isRightToLeft, borderPrimary]
  );
};
