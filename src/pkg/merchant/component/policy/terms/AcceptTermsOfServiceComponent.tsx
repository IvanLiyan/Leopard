import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation } from "@apollo/react-hooks";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Maybe, TermsOfServiceRegionType } from "@schema/types";

/* Lego Components */
import { PrimaryButton, Layout, Text } from "@ContextLogic/lego";

import { useToastStore } from "@stores/ToastStore";

import { MerchantTermsAgreedMutationsAcceptTermsOfServiceArgs } from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import {
  ACCEPT_TERMS_OF_SERVICE_MUTATION,
  AcceptTermsResponseType,
} from "@toolkit/policy/terms-of-service";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

type AcceptTermsOfServiceComponentProps = BaseProps & {
  readonly isDisabled?: boolean;
  readonly hasFooter?: boolean;
  readonly onAccept?: () => void;
  readonly tosVersion: number | undefined;
  readonly tosRegion: Maybe<TermsOfServiceRegionType> | undefined;
};

const AcceptTermsOfServiceComponent = (
  props: AcceptTermsOfServiceComponentProps,
) => {
  const {
    isDisabled = false,
    hasFooter = false,
    onAccept,
    tosVersion,
    tosRegion,
  } = props;
  const styles = useStylesheet({ hasFooter });
  const toastStore = useToastStore();

  const [acceptTerms] = useMutation<
    AcceptTermsResponseType,
    MerchantTermsAgreedMutationsAcceptTermsOfServiceArgs
  >(ACCEPT_TERMS_OF_SERVICE_MUTATION);

  const onSubmit = async () => {
    if (!tosVersion) {
      toastStore.negative(i`Something went wrong`);
      return;
    }

    const { data } = await acceptTerms({
      variables: {
        input: {
          tosVersion,
          tosRegion,
        },
      },
    });
    const ok =
      data?.currentUser?.merchant.merchantTermsAgreed.acceptTermsOfService.ok;
    const message =
      data?.currentUser?.merchant.merchantTermsAgreed.acceptTermsOfService
        .message;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    onAccept && onAccept();
  };

  return (
    <Layout.FlexColumn style={styles.submitContainer} alignItems="center">
      <PrimaryButton
        onClick={onSubmit}
        isDisabled={isDisabled}
        className={css(styles.acceptButton)}
      >
        Accept Terms of Service
      </PrimaryButton>
      <Text style={styles.scrollPrompt}>
        Please read and scroll to the bottom to accept.
      </Text>
    </Layout.FlexColumn>
  );
};

export default observer(AcceptTermsOfServiceComponent);

const useStylesheet = ({ hasFooter }: { readonly hasFooter: boolean }) => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        submitContainer: {
          width: "100%",
          backgroundColor: surfaceLightest,
          position: "sticky",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
          bottom: hasFooter ? 41 : 0,
        },
        acceptButton: {
          height: 30,
          marginTop: 16,
        },
        scrollPrompt: {
          marginTop: 8,
          marginBottom: 16,
        },
      }),
    [surfaceLightest, hasFooter],
  );
};
