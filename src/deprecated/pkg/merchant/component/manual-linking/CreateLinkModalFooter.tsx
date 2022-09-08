import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";

/* Lego Toolkit */
import { Layout, PrimaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import CreateLinkState from "@merchant/model/manual-linking/CreateLinkState";

/* Component */
import { CreateLinkModalProps } from "@merchant/component/manual-linking/CreateLinkModal";

type InitialProps = BaseProps &
  CreateLinkModalProps & {
    readonly editState: CreateLinkState;
    readonly closeModal: () => void;
  };

/**
 * Manual linking create link modal footer - display button based on current step:
 *  1. For authentication step, display button to submit credentials for authentication
 *  2. For verification step, display button to submit verification code and conclude the flow
 */
const CreateLinkModalFooter: React.FC<InitialProps> = ({
  editState,
  closeModal,
  refetchLinkedStores,
}) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const {
    currentStep,
    isAuthenticating,
    isVerifying,
    canAuthenticate,
    canVerify,
  } = editState;

  const renderAuthenticationFooter = () => {
    return (
      <PrimaryButton
        style={styles.button}
        onClick={async () => {
          await editState.authenticateLinking();
        }}
        isDisabled={!canAuthenticate}
        isLoading={isAuthenticating}
      >
        Enter
      </PrimaryButton>
    );
  };

  const renderVerificationFooter = () => {
    return (
      <PrimaryButton
        style={styles.button}
        onClick={async () => {
          await editState.completeLinking();

          if (editState.isCompleted) {
            closeModal();
            toastStore.positive(
              i`Nice job. You successfully linked your stores.`
            );
            refetchLinkedStores();
          }
        }}
        isDisabled={!canVerify}
        isLoading={isVerifying}
      >
        Submit
      </PrimaryButton>
    );
  };

  return (
    <Layout.FlexRow
      alignItems="center"
      justifyContent="flex-end"
      style={styles.root}
    >
      {currentStep === "AUTHENTICATE"
        ? renderAuthenticationFooter()
        : renderVerificationFooter()}
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: 24,
        },
        button: {
          borderRadius: 100,
          height: 40,
        },
      }),
    [borderPrimary]
  );
};

export default observer(CreateLinkModalFooter);
