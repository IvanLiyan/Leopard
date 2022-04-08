import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";

/* Lego Toolkit */
import { Button, Layout, PrimaryButton, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import DeleteLinkState from "@merchant/model/manual-linking/DeleteLinkState";

type InitialProps = BaseProps & {
  readonly deleteState: DeleteLinkState;
  readonly refetchLinkedStores: () => Promise<void>;
  readonly closeModal: () => void;
};

/**
 * Manual linking - delete link modal content
 */
const DeleteLinkModalContent: React.FC<InitialProps> = ({
  style,
  className,
  deleteState,
  refetchLinkedStores,
  closeModal,
}) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const { displayName, deleteLink, isDeleting } = deleteState;

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Text style={styles.title}>
        Are you sure you want to remove the link to {displayName}?
      </Text>
      <Layout.FlexRow
        style={styles.buttonContainer}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button style={styles.secondaryButton} onClick={closeModal}>
          Cancel
        </Button>
        <PrimaryButton
          style={styles.primaryButton}
          onClick={async () => {
            await deleteLink();

            if (deleteState.isDeleted) {
              closeModal();
              toastStore.positive(
                i`You’ve successfully removed the linked store. If you need to re-link this ` +
                  i`store, or add any other linked stores, then click the button below.`
              );
              refetchLinkedStores();
            }
          }}
          isLoading={isDeleting}
        >
          Remove
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, secondaryDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          padding: 24,
          fontSize: 16,
          color: textBlack,
        },
        buttonContainer: {
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
          gap: 16,
        },
        secondaryButton: {
          borderRadius: 100,
          color: secondaryDark,
          height: 40,
        },
        primaryButton: {
          borderRadius: 100,
          height: 40,
        },
      }),
    [textBlack, secondaryDark, borderPrimary]
  );
};

export default observer(DeleteLinkModalContent);
