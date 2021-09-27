import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import StateLabel from "@merchant/component/merchant-review/StateLabel";
import MetaInfo from "@merchant/component/merchant-review/MetaInfo";
import MerchantInfo from "@merchant/component/merchant-review/MerchantInfo";
import MaterialSummary from "@merchant/component/merchant-review/MaterialSummary";
import ReviewMessages from "@merchant/component/merchant-review/ReviewMessages";
import DetectedDuplicateName from "@merchant/component/merchant-review/DetectedDuplicateName";
import Reply from "@merchant/component/merchant-review/Reply";

/* Merchant API */
import * as reauthApi from "@merchant/api/reauthentication";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const ReauthenticationDetailContainer = () => {
  const appStore = AppStore.instance();
  const { ticketId } = usePathParams("/reauthentication-detail/:ticketId");
  const [resp] = useRequest(reauthApi.requestReauthDetail({ ticketId }));
  const state = resp?.data?.state;
  const isMerchant = resp?.data?.isMerchant;
  const hasDetectedDuplicateName = resp?.data?.hasDetectedDuplicateName;
  const canReply = resp?.data?.canReply;
  const reauthType = resp?.data?.reauthType;

  const styles = useStyleSheet(isMerchant, appStore);

  const bodyATOText = useMemo(() => {
    if (state === "new") {
      return (
        i`We think someone else may have accessed your Wish Merchant account.` +
        i` Please verify your identity.` +
        i` During re-authentication, your payment will be temporily withheld.`
      );
    } else if (state === "awaitingAdmin") {
      return (
        i`You have submitted the re-authentication materials.` +
        i` We will review them and inform you the result as soon as possible.` +
        i` During re-authentication, your payment will be temporily withheld.`
      );
    } else if (state === "awaitingMerchant") {
      return (
        i`We have reviewed your re-authentication materials,` +
        i` some of them are not qualified.` +
        i` Please check the comments of Wish support,` +
        i` and correct the materials as requested.` +
        i` During re-authentication, your payment will be temporily withheld.`
      );
    } else if (state === "rejected") {
      return (
        i`We have reviewed your re-authentication materials,` +
        i` but we cannot eliminate the possibility that your account has been` +
        i` unexpectedly taken. Your payment is temporily withheld.` +
        i` Please check the comment of Wish support for details.`
      );
    }
  }, [state]);

  const bodyRegInfoText = useMemo(() => {
    if (state == null) {
      return null;
    }

    if (state === "awaitingAdmin") {
      return (
        i`Thank you for submitting additional store registration information` +
        i` as requested. Your submission is being reviewed by Wish, and you` +
        i` will be notified of the review result on this page as soon as it` +
        i` is available.`
      );
    } else if (state === "awaitingMerchant") {
      return (
        i`We have detected that your store is at risk.` +
        i` Please submit additional information for your store to continue` +
        i` operating. To protect your account safety,` +
        i` Wish will temporarily withhold your store's payment until the` +
        i` additional information you submit is validated.` +
        i` To prevent your account from being disabled,` +
        i` please submit additional information timely.` +
        i` Thank you for your cooperation!`
      );
    } else if (state === "approved") {
      return (
        i`Thank you for submitting additional store registration information` +
        i` as requested. Your submission has been reviewed and approved by` +
        i` Wish. You may now continue operating your store, and your payments` +
        i` are no longer withheld.`
      );
    } else if (state === "rejected") {
      return (
        i`Thank you for submitting additional store registration information` +
        i` as requested. Your submission has been reviewed and rejected by` +
        i` Wish. Your merchant account has been disabled.`
      );
    }
  }, [state]);

  const renderMerchantHeaderTitle = () => {
    return (
      <div className={css(styles.titleContainer)}>
        <Text weight="bold" className={css(styles.titleText)}>
          Re-authentication
        </Text>
        <StateLabel state={state || "new"} />
      </div>
    );
  };

  const renderHeader = () => {
    let bodyText: string | null | undefined = "";
    if (reauthType == "ATO") {
      bodyText = bodyATOText;
    } else if (reauthType == "registration_info") {
      bodyText = bodyRegInfoText;
    }
    if (isMerchant) {
      return (
        <WelcomeHeader
          title={() => renderMerchantHeaderTitle()}
          body={bodyText || ""}
          illustration="submitDispute"
          paddingY="31px"
        />
      );
    }
    return (
      <Text
        weight="bold"
        className={css(styles.adminTitleContainer, styles.titleText)}
      >
        Review materials of re-authentication
      </Text>
    );
  };

  const data = resp?.data;
  if (
    data == null ||
    state == null ||
    isMerchant == null ||
    canReply == null ||
    reauthType == null
  ) {
    return <LoadingIndicator />;
  }

  const {
    metaInfo,
    merchantInfo,
    materialSummary,
    reviewMessages,
    detectedDuplicateName,
    reply,
  } = data;

  const metaInfoComponent = !isMerchant && (
    <MetaInfo style={styles.card} {...metaInfo} />
  );
  const merchantInfoComponent = !isMerchant && (
    <MerchantInfo style={styles.card} {...merchantInfo} />
  );
  const materialSummaryComponent = !isMerchant && (
    <MaterialSummary style={styles.card} {...materialSummary} />
  );
  const duplicatedMerchantAttributesComponent = !isMerchant &&
    hasDetectedDuplicateName && (
      <DetectedDuplicateName style={styles.card} {...detectedDuplicateName} />
    );
  const replyComponent = !isMerchant && canReply && (
    <Reply style={styles.card} {...reply} />
  );
  return (
    <>
      {renderHeader()}
      <div className={css(styles.pageContent)}>
        {metaInfoComponent}
        {merchantInfoComponent}
        {materialSummaryComponent}
        {duplicatedMerchantAttributesComponent}
        <ReviewMessages style={styles.card} {...reviewMessages} />
        {replyComponent}
      </div>
    </>
  );
};

const useStyleSheet = (
  isMerchant: null | undefined | boolean,
  appStore: AppStore
) => {
  const { dimenStore } = appStore;
  let useMerchantStyle = true;
  if (isMerchant != null) {
    useMerchantStyle = isMerchant;
  }

  return useMemo(
    () =>
      StyleSheet.create({
        titleContainer: {
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
        },
        titleText: {
          fontSize: 24,
          lineHeight: 1.25,
          color: palettes.textColors.Ink,
          marginRight: 8,
        },
        adminTitleContainer: {
          margin: `40px ${dimenStore.pageGuideX} 24px`,
        },
        pageContent: {
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
          marginBottom: dimenStore.pageGuideBottom,
          backgroundColor: palettes.textColors.White,
          position: useMerchantStyle ? "relative" : undefined,
          top: useMerchantStyle ? "-31px" : undefined,
        },
        card: {
          marginBottom: 24,
        },
      }),
    [useMerchantStyle, dimenStore]
  );
};

export default observer(ReauthenticationDetailContainer);
