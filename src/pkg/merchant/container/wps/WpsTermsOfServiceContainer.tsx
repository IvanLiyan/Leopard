/*
 * WpsTermsOfServiceContainer.tsx
 *
 * Created by Jonah Dlin on Tue Apr 20 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useLazyQuery, useMutation } from "react-apollo";

/* External Libraries */
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

/* Merchant Components */
import TermsOfUseCard from "@merchant/component/wps/terms-of-service/TermsOfUseCard";
import PrivacyPolicyCard from "@merchant/component/wps/terms-of-service/PrivacyPolicyCard";
import TosBanner from "@merchant/component/wps/create-shipping-label/create-shipping-label-cards/TosBanner";

/* Merchant Plus Components */
import PageGuide from "@plus/component/nav/PageGuide";

/* Toolkit */
import { css } from "@toolkit/styling";
import {
  PrivacyPolicySectionId,
  TermsOfUseSectionId,
} from "@toolkit/wps/terms-of-service";
import {
  AcceptTosInputType,
  AcceptTosResponseType,
  ACCEPT_TOS,
  GetTosAcceptedResponseType,
  GET_TOS_ACCEPTED,
} from "@toolkit/wps/create-shipping-label";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { useToastStore } from "@stores/ToastStore";
import { useUserStore } from "@stores/UserStore";

const WpsTermsOfServiceContainer = () => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const { isLoggedIn } = useUserStore();

  useMountEffect(() => {
    configureAnchors({ offset: 0, scrollDuration: 200 });
  });

  const [getTosAcceptance, { data, loading: loadingQuery, refetch }] =
    useLazyQuery<GetTosAcceptedResponseType, {}>(GET_TOS_ACCEPTED, {
      fetchPolicy: "no-cache",
    });

  const [acceptTos, { loading: loadingMutation }] = useMutation<
    AcceptTosResponseType,
    AcceptTosInputType
  >(ACCEPT_TOS);

  useMountEffect(async () => {
    if (isLoggedIn) {
      await getTosAcceptance();
    }
  });

  const isWpsChecked =
    data?.currentMerchant?.merchantTermsAgreed?.wpsTermsOfService
      ?.agreedWpsTos || false;

  const handleWpsClick = async () => {
    const response = await acceptTos({ variables: { tos: "WPS" } });
    if (
      response.data?.currentMerchant?.merchantTermsAgreed
        ?.actOnWpsTermsOfService.ok
    ) {
      toastStore.positive(i`Successfully accepted WPS Terms`);
      await refetch();
    }
  };

  const hasAcceptedBothTos = isWpsChecked;
  const isDisabled = loadingQuery || loadingMutation;

  const showTos =
    isLoggedIn && data?.currentMerchant != null && !hasAcceptedBothTos;

  // divs required to wrap custom functional components for ScrollableAnchor
  return (
    <div className={css(styles.root)}>
      <PageGuide relaxed>
        {showTos && (
          <TosBanner
            className={css(styles.card)}
            isWpsChecked={isWpsChecked}
            onCheckWps={handleWpsClick}
            disableCheckboxes={isDisabled}
            hideWpsLinks
          />
        )}

        <ScrollableAnchor id={TermsOfUseSectionId}>
          <div className={css(styles.card)}>
            <TermsOfUseCard />
          </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={PrivacyPolicySectionId}>
          <div className={css(styles.card)}>
            <PrivacyPolicyCard />
          </div>
        </ScrollableAnchor>
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { pageGuideX } = useDeviceStore();
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          marginTop: 20,
          marginLeft: pageGuideX,
          marginRight: pageGuideX,
          color: textBlack,
        },
        card: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
      }),
    [pageGuideX, textBlack],
  );
};

export default observer(WpsTermsOfServiceContainer);
