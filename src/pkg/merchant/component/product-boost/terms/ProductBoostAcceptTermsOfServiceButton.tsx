import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import {
  MarketingServiceMutationsAcceptTosArgs,
  ProductBoostAcceptTos,
} from "@schema/types";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";

import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const ACCEPT_TERMS_OF_SERVICE_MUTATION = gql`
  mutation ProductBoostAcceptTermsOfServiceButton_AcceptProductBoostTos(
    $input: ProductBoostAcceptTOSInput!
  ) {
    marketing {
      acceptTos(input: $input) {
        ok
        message
      }
    }
  }
`;

type ProductBoostAcceptTosType = Pick<ProductBoostAcceptTos, "ok" | "message">;

type ProductBoostAcceptTosResponseType = {
  readonly marketing: {
    readonly acceptTos: ProductBoostAcceptTosType;
  };
};

type ProductBoostAcceptTermsOfServiceButtonProps = BaseProps & {
  readonly tosVersion: number;
  readonly isMerchantPlus?: boolean;
};

const ProductBoostAcceptTermsOfServiceButton = (
  props: ProductBoostAcceptTermsOfServiceButtonProps,
) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const { tosVersion, isMerchantPlus, className } = props;
  const [acceptTerms] = useMutation<
    ProductBoostAcceptTosResponseType,
    MarketingServiceMutationsAcceptTosArgs
  >(ACCEPT_TERMS_OF_SERVICE_MUTATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);

    const cancelLoading = () => setIsSubmitting(false);

    const { data } = await acceptTerms({
      variables: { input: { tosVersion } },
    });
    const ok = data?.marketing.acceptTos.ok;
    const message = data?.marketing.acceptTos.message;

    if (!ok) {
      cancelLoading();
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    if (isMerchantPlus) {
      await navigationStore.navigate("/plus/marketing/manage");
    } else {
      await navigationStore.navigate("/product-boost/create");
    }
    toastStore.positive(i`Successfully accepted the terms of service.`);
  };

  return (
    <div className={css(styles.submitContainer, className)}>
      <PrimaryButton onClick={onSubmit} isDisabled={isSubmitting}>
        Accept
      </PrimaryButton>
    </div>
  );
};

export default ProductBoostAcceptTermsOfServiceButton;

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
