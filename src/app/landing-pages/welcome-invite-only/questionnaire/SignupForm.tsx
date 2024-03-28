import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, LoadingIndicator, Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ContactInfo from "./ContactInfo";
import StoreDetails from "./StoreDetails";
import MerchantDetails from "./MerchantDetails";
import CNOnlyDetails from "./CNOnlyDetails";
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";
import { useSardineConstants } from "@core/stores/SardineStore";
import {
  SARDINE_FLOW,
  initAndUpdatedateSardineSDK,
} from "@core/toolkit/sardineSDK";

type SignupFormProps = BaseProps & {
  readonly isLoading?: boolean;
  readonly submissionState: MerchantLeadSubmissionState;
};

const SignupForm = (props: SignupFormProps) => {
  const { className, style, submissionState, isLoading } = props;
  const styles = useStylesheet();

  const { sardineHost, sardineClientId, sardineSessionKey } =
    useSardineConstants();

  useEffect(() => {
    const effect = async () => {
      try {
        await initAndUpdatedateSardineSDK(
          SARDINE_FLOW.SIGNUP,
          sardineHost,
          sardineClientId,
          sardineSessionKey,
          null,
        );
      } catch (error) {
        // Want a console log here for debugging purpose
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    void effect();
  }, [sardineHost, sardineClientId, sardineSessionKey]);

  return (
    <Layout.FlexColumn alignItems="center" style={[className, style]}>
      <Text style={styles.formTitle} weight="bold">
        Request Access to Wish for Merchants
      </Text>
      <Text style={styles.formSubtitle}>
        Tell us about your business and how it&#39;s doing
      </Text>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Layout.FlexColumn alignItems="stretch">
          <ContactInfo submissionState={submissionState} />
          {submissionState.isCNMerchant && (
            <CNOnlyDetails submissionState={submissionState} />
          )}
          <StoreDetails submissionState={submissionState} />
          <MerchantDetails submissionState={submissionState} />
        </Layout.FlexColumn>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        formTitle: {
          textAlign: "center",
          marginTop: 50,
          "@media (max-width: 900px)": {
            fontSize: 23,
          },
          "@media (min-width: 900px)": {
            fontSize: 28,
          },
        },
        formSubtitle: {
          textAlign: "center",
          marginBottom: 35,
          "@media (max-width: 900px)": {
            fontSize: 15,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
          },
        },
      }),
    [],
  );
};

export default observer(SignupForm);
