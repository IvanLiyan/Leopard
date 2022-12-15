/* moved from
 * @plus/component/nav/chrome/PlusUserAvatar.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@apollo/client";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { weightSemibold } from "@core/toolkit/fonts";

import { Card, Chevron, LoadingIndicator } from "@ContextLogic/lego";
import { Layout } from "@ContextLogic/lego";

/* Merchant Store */
import { useEnvironmentStore } from "@core/stores/EnvironmentStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useTheme } from "@core/stores/ThemeStore";
import { useUserStore } from "@core/stores/UserStore";
import { useToastStore } from "@core/stores/ToastStore";

/* Toolkit */
import {
  LOGIN_AS_USER_MUTATION,
  LoginAsUserResponseType,
  LoginAsUserRequestType,
} from "@chrome/admin-toolkit";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ByUserIdInput } from "@schema";

import { useAppTopBarData } from "@chrome/toolkit";

import Link from "@core/components/Link";
import { merchFeURL } from "@core/toolkit/url";

const PlusUserAvatar: React.FC<BaseProps> = ({
  style,
  className,
}: BaseProps) => {
  const styles = useStylesheet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickLoginDropdownOpen, setQuickLoginDropdownOpen] = useState(false);
  const { negative, textDark, textWhite, surfaceLightest } = useTheme();
  const { data, loading: isLoadingData } = useAppTopBarData();
  const navigationStore = useNavigationStore();
  const toastStore = useToastStore();
  const { isDev, isStaging } = useEnvironmentStore();
  const { recentUsers } = useUserStore();

  const useLightIcon = isDev || isStaging;

  const [loginAs] = useMutation<
    LoginAsUserResponseType,
    LoginAsUserRequestType
  >(LOGIN_AS_USER_MUTATION);

  const isLoading = isLoadingData;

  if (data == null || isLoading) {
    return (
      <LoadingIndicator type="spinner" size={15} color={surfaceLightest} />
    );
  }

  const {
    currentUser: { firstName },
  } = data;

  const onQuickLoginClick = async (id: string) => {
    if (id == "me") {
      await navigationStore.navigate(merchFeURL("/switchsu"));
    } else {
      const input: ByUserIdInput = {
        id,
      };
      const { data } = await loginAs({ variables: { input } });
      if (data == null) {
        toastStore.error(i`Something went wrong`);
        return;
      }
      const { ok, error } = data.authentication.loginAs.user;
      if (ok) {
        await navigationStore.navigate(merchFeURL("/"), { fullReload: true });
      } else {
        toastStore.error(error || i`Something went wrong`);
      }
    }
  };

  const renderQuickLoginPopoverContent = () => (
    <Card>
      <Layout.FlexColumn
        className={css(styles.dropdownContent)}
        alignItems="stretch"
      >
        {recentUsers.map((rsu) => (
          <div className={css(styles.item)} key={rsu.id}>
            <Link
              // TODO [lliepert]: confirm this void behavior
              onClick={void (async () => await onQuickLoginClick(rsu.id))}
              key={rsu.id}
              fadeOnHover={false}
              style={{ color: textDark }}
            >
              {rsu.displayName}
            </Link>
          </div>
        ))}
      </Layout.FlexColumn>
    </Card>
  );

  const renderPopoverContent = () => {
    return (
      <Card>
        <Layout.FlexColumn
          className={css(styles.dropdownContent)}
          alignItems="stretch"
        >
          <div className={css(styles.item)}>
            <Link
              href={merchFeURL("/settings")}
              fadeOnHover={false}
              style={{ color: textDark }}
            >
              Account Settings
            </Link>
          </div>
          <div className={css(styles.item)}>
            <Link
              href={merchFeURL("/faq")}
              fadeOnHover={false}
              style={{ color: textDark }}
            >
              Help Center
            </Link>
          </div>
          {recentUsers.length > 0 && (
            <div
              className={css(styles.item, styles.divider)}
              onMouseLeave={() => setQuickLoginDropdownOpen(false)}
            >
              {quickLoginDropdownOpen && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    exit={{ opacity: 0, y: -5 }}
                    className={css(styles.dropdown, styles.dropdownQuickLogin)}
                  >
                    {renderQuickLoginPopoverContent()}
                  </motion.div>
                </AnimatePresence>
              )}
              <Link
                onMouseEnter={() => setQuickLoginDropdownOpen(true)}
                fadeOnHover={false}
                style={{ color: textDark }}
              >
                {`Quick Login As...`}
              </Link>
            </div>
          )}
          <div className={css(styles.item, styles.divider)}>
            <Link
              href={merchFeURL("/logout")}
              fadeOnHover={false}
              style={{ fontWeight: weightSemibold, color: negative }}
            >
              Logout
            </Link>
          </div>
        </Layout.FlexColumn>
      </Card>
    );
  };

  return (
    <div
      className={css(style, className)}
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      <Layout.FlexRow className={css(styles.anchor)}>
        {firstName || i`Account`}
        <Chevron
          color={useLightIcon ? textWhite : textDark}
          direction="down"
          className={css(styles.arrow)}
        />
      </Layout.FlexRow>
      {dropdownOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            exit={{ opacity: 0, y: -5 }}
            className={css(styles.dropdown, styles.dropdownMain)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {renderPopoverContent()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default observer(PlusUserAvatar);

const useStylesheet = () => {
  const { isRTL: isRightToLeft } = useLocalizationStore();
  const { textDark, textBlack, surfaceLightest, surfaceLight } = useTheme();
  const { env } = useEnvironmentStore();
  const textColor = useMemo(() => {
    switch (env) {
      case "fe_qa_staging":
      case "sandbox":
      case "stage":
        return surfaceLight;
      default:
        return textBlack;
    }
  }, [env, textBlack, surfaceLight]);

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
        },
        anchor: {
          color: textColor,
          cursor: "pointer",
        },
        arrow: {
          marginLeft: 5,
          height: 10,
        },
        dropdown: {
          position: "absolute",
          backgroundColor: surfaceLightest,
          borderRadius: 4,
          // Need the width @ 170
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 170,
          zIndex: 999999,
        },
        dropdownMain: {
          top: 65,
          right: isRightToLeft ? undefined : 35,
          left: isRightToLeft ? 35 : undefined,
        },
        dropdownQuickLogin: {
          right: 170,
        },
        dropdownContent: {
          padding: "7px 0px",
        },
        item: {
          padding: "7px 15px",
          color: textDark,
          fontSize: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          cursor: "pointer",
          ":hover": {
            backgroundColor: surfaceLight,
          },
        },
        divider: {
          borderTop: `1px solid ${surfaceLight}`,
        },
      }),
    [isRightToLeft, surfaceLightest, textDark, surfaceLight, textColor],
  );
};
