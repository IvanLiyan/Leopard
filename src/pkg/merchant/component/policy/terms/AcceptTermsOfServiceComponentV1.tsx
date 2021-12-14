import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";

import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";

import {
  AcceptTermsOfService,
  MerchantTermsAgreedMutationsAcceptTermsOfServiceArgs,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

const ACCEPT_TERMS_OF_SERVICE_MUTATION = gql`
  mutation AcceptTermsOfServiceComponent_AcceptTermsOfServiceMutation(
    $input: AcceptTermsOfServiceInput!
  ) {
    currentUser {
      merchant {
        merchantTermsAgreed {
          acceptTermsOfService(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`;

type AcceptTermsOfServiceType = Pick<AcceptTermsOfService, "ok" | "message">;

type AccepTermsResponseType = {
  readonly currentUser: {
    readonly merchant: {
      readonly merchantTermsAgreed: {
        readonly acceptTermsOfService: AcceptTermsOfServiceType;
      };
    };
  };
};

const AcceptTermsOfServiceComponentV1 = () => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const [acceptTerms] = useMutation<
    AccepTermsResponseType,
    MerchantTermsAgreedMutationsAcceptTermsOfServiceArgs
  >(ACCEPT_TERMS_OF_SERVICE_MUTATION);
  let isSubmitting = false;

  const onSubmit = async () => {
    isSubmitting = true;

    const cancelLoading = () => (isSubmitting = false);

    // Todo: Update the tos version to be dynamic
    const { data } = await acceptTerms({
      variables: {
        input: {
          tosVersion: 4,
        },
      },
    });
    const ok =
      data?.currentUser?.merchant.merchantTermsAgreed.acceptTermsOfService.ok;
    const message =
      data?.currentUser?.merchant.merchantTermsAgreed.acceptTermsOfService
        .message;

    if (!ok) {
      cancelLoading();
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    await navigationStore.navigate("/");
    toastStore.positive(i`Successfully accepted the terms of service.`);
  };

  return (
    <div className={css(styles.submitContainer)}>
      <PrimaryButton onClick={onSubmit} isDisabled={isSubmitting}>
        Accept
      </PrimaryButton>
    </div>
  );
};

export default AcceptTermsOfServiceComponentV1;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        submitContainer: {
          display: "flex",
          alignItems: "baseline",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "flex-end",
          width: "100%",
        },
      }),
    [],
  );
};
