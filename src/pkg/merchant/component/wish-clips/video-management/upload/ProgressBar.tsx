import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  ProgressBar as LegoProgressBar,
  SecondaryButton,
  PrimaryButton,
  Text,
  SecondaryButtonProps,
  PrimaryButtonProps,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Component */
import Icon from "@merchant/component/core/Icon";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly progress: number;
  readonly onBackProps: SecondaryButtonProps | null;
  readonly onNextProps: (PrimaryButtonProps & { text: string }) | null;
};

const ProgressBar = (props: Props) => {
  const { className, style, progress, onBackProps, onNextProps } = props;
  const styles = useStylesheet();
  const { borderPrimaryDark, borderPrimaryLight, primary, positiveDark } =
    useTheme();

  return (
    <Layout.FlexRow style={[className, style]} justifyContent="space-between">
      <Layout.FlexColumn>
        <Layout.FlexRow style={styles.progressBarText}>
          <Icon
            name="checkCircle"
            color={progress >= 1 ? positiveDark : borderPrimaryDark}
            style={styles.icon}
          />
          <Text weight="semibold">
            {progress >= 1 ? i`Upload Completed` : i`Upload in progess`}
          </Text>
        </Layout.FlexRow>
        <LegoProgressBar
          progress={progress}
          transitionDurationMs={600}
          color={progress >= 1 ? positiveDark : primary}
          backgroundColor={borderPrimaryLight}
          minWidth={224}
        />
      </Layout.FlexColumn>

      <Layout.FlexRow>
        {onBackProps && (
          <SecondaryButton
            style={styles.cancel}
            {...onBackProps}
            padding="5px 12px"
          />
        )}
        {onNextProps && (
          <PrimaryButton {...onNextProps}>{onNextProps.text}</PrimaryButton>
        )}
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        cancel: {
          marginRight: 8,
        },
        icon: {
          marginRight: 8,
        },
        progressBarText: {
          marginBottom: 8,
        },
      }),
    []
  );
};

export default observer(ProgressBar);
