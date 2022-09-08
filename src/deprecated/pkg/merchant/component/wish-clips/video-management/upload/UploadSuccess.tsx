import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H5, Text } from "@ContextLogic/lego";

/* Merchant Components */
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const UploadSuccess = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]} alignItems="center">
      <Illustration
        name="uploadStatusComplete"
        alt="uploadStatusComplete"
        style={styles.illustration}
      />
      <H5 style={styles.text}>You Did It!</H5>
      <Text style={styles.bodyText}>
        Once your video has been approved for use by our Content Moderation
        Team, it will be made available on Wish Clips and other channels. If we
        encounter any issues during our review process, you will be notified
        immediately.
      </Text>
      <Text weight="semibold">Average review time: {48} hours</Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        illustration: {
          height: 150,
          marginBottom: 28,
        },
        text: {
          marginBottom: 10,
        },
        bodyText: {
          textAlign: "center",
          marginBottom: 10,
        },
      }),
    []
  );
};

export default observer(UploadSuccess);
