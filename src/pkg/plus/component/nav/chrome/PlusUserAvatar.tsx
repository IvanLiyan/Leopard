import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { motion, AnimatePresence } from "framer-motion";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";
import { zendeskCategoryURL } from "@toolkit/url";

import { Card, Chevron, LoadingIndicator } from "@ContextLogic/lego";
import { Link, Layout } from "@ContextLogic/lego";

/* Merchant Store */
import { useEnvironmentStore } from "@stores/EnvironmentStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useTheme } from "@stores/ThemeStore";
import { useApolloStore } from "@stores/ApolloStore";
import { useExperiment } from "@stores/ExperimentStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useAppTopBarData } from "@toolkit/chrome";
import { useUIStateBool } from "@toolkit/ui-state";

/* Plus Components */
import SwitchNavBackTutorialModal from "@plus/component/home/SwitchNavBackTutorialModal";

const PlusUserAvatar: React.FC<BaseProps> = ({
  style,
  className,
}: BaseProps) => {
  const styles = useStylesheet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { negative, textDark, surfaceLightest } = useTheme();
  const { data, loading: isLoadingData } = useAppTopBarData();
  const navigationStore = useNavigationStore();
  const { client } = useApolloStore();

  const isMerchantPlus = data?.currentMerchant?.isMerchantPlus;

  const { bucket: phase2Bucket, isLoading: isLoadingPhase2Bucket } =
    useExperiment("md_new_nav_phase_2");

  const {
    value: prefersNewNav,
    update: setPrefersNewNav,
    isLoading: isLoadingPrefersNewNav,
  } = useUIStateBool("PREFERS_NEW_NAV", { client });

  const {
    value: hasDismissedSwitchNavBackTutorial,
    isLoading: isLoadingDismissSwitchNav,
  } = useUIStateBool("DISMISSED_SWITCH_NAV_BACK_TUTORIAL", { client });

  useEffect(() => {
    if (
      isLoadingPrefersNewNav ||
      isLoadingDismissSwitchNav ||
      isLoadingPhase2Bucket ||
      hasDismissedSwitchNavBackTutorial ||
      isLoadingData ||
      isMerchantPlus
    ) {
      return;
    }

    new SwitchNavBackTutorialModal().render();
  }, [
    hasDismissedSwitchNavBackTutorial,
    isLoadingPhase2Bucket,
    isLoadingPrefersNewNav,
    isLoadingDismissSwitchNav,
    isMerchantPlus,
    isLoadingData,
  ]);

  const isLoading =
    isLoadingPrefersNewNav ||
    isLoadingDismissSwitchNav ||
    isLoadingPhase2Bucket ||
    isLoadingData;

  if (data == null || isLoading) {
    return (
      <LoadingIndicator type="spinner" size={15} color={surfaceLightest} />
    );
  }

  const {
    currentUser: { firstName },
    currentMerchant,
  } = data;

  const isStoreMerchant = currentMerchant?.isStoreMerchant;
  const faqText = i`FAQ`;
  const plusFaqLink = isStoreMerchant
    ? "https://localfaq.wish.com/hc/en-us"
    : zendeskCategoryURL("360004143274");

  const canSwitchNavs =
    !isMerchantPlus &&
    ((phase2Bucket !== "treatment" && prefersNewNav) ||
      phase2Bucket === "treatment");

  const onSwitchNavigation = async () => {
    await setPrefersNewNav(false);
    await navigationStore.reload({ fullReload: true });
  };

  const renderPopoverContent = () => {
    return (
      <Card>
        <Layout.FlexColumn
          className={css(styles.dropdownContent)}
          alignItems="stretch"
        >
          <div className={css(styles.item)}>
            <Link
              href={isMerchantPlus ? "/plus/settings/account" : "/settings"}
              fadeOnHover={false}
              style={{ color: textDark }}
            >
              Account Settings
            </Link>
          </div>
          <div className={css(styles.item)}>
            <Link
              href={isMerchantPlus ? plusFaqLink : "/faq"}
              fadeOnHover={false}
              style={{ color: textDark }}
            >
              {faqText}
            </Link>
          </div>
          {canSwitchNavs && (
            <div className={css(styles.item, styles.divider)}>
              <Link
                onClick={onSwitchNavigation}
                fadeOnHover={false}
                style={{ fontWeight: weightSemibold, color: textDark }}
              >
                Switch to original navigation
              </Link>
            </div>
          )}
          <div className={css(styles.item, styles.divider)}>
            <Link
              href="/logout"
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
        <Chevron color="black" direction="down" className={css(styles.arrow)} />
      </Layout.FlexRow>
      {dropdownOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            exit={{ opacity: 0, y: -5 }}
            className={css(styles.dropdown)}
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
          top: 65,
          right: isRightToLeft ? undefined : 35,
          left: isRightToLeft ? 35 : undefined,
          backgroundColor: surfaceLightest,
          borderRadius: 4,
          // Need the width @ 170
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 170,
          zIndex: 999999,
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
