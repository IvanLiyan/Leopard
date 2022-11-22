import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Layout, PrimaryButton, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@core/components/Illustration";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  onClick: () => unknown;
};

const SuccessModalContent: React.FC<Props> = ({
  style,
  className,
  onClick,
}) => {
  const styles = useStylesheet();
  const description =
    i`Thank you for completing the questionnaire to become a Wish merchant. ` +
    i`A member of our team will follow up with you by e-mail about any next steps. ` +
    i`Please make sure to check your inbox for messages from Wish.`;

  return (
    <Layout.FlexColumn
      alignItems="center"
      style={[style, className, styles.root]}
    >
      <Illustration
        name="manCheering"
        alt="form submitted successfully"
        style={styles.illustration}
      />
      <Text style={styles.modalTitle} weight="bold">
        We have received your information
      </Text>
      <Text style={styles.modalDescription}>{description}</Text>
      <Layout.FlexColumn style={styles.buttonContainer} alignItems="center">
        <PrimaryButton
          style={styles.closeButton}
          onClick={() => {
            onClick();
          }}
        >
          {ci18n(
            "Text on button that merchants click to close the form",
            "Close",
          )}
        </PrimaryButton>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingLeft: 20,
          paddingRight: 20,
        },
        modalTitle: {
          paddingHorizontal: 25,
          marginTop: 35,
          "@media (max-width: 900px)": {
            fontSize: 20,
          },
          "@media (min-width: 900px)": {
            fontSize: 28,
          },
        },
        modalDescription: {
          marginTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          textAlign: "center",
          marginBottom: 50,
          "@media (max-width: 900px)": {
            fontSize: 15,
          },
          "@media (min-width: 900px)": {
            fontSize: 17,
          },
        },
        buttonContainer: {
          width: "75%",
          marginBottom: 25,
          marginTop: 15,
        },
        closeButton: {
          marginTop: 15,
          "@media (max-width: 900px)": {
            width: 225,
            height: 50,
          },
          "@media (min-width: 900px)": {
            width: 450,
            height: 50,
          },
        },
        illustration: {
          marginTop: 25,
        },
      }),
    [],
  );
};

export default observer(SuccessModalContent);
