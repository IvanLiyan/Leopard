import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { H4, Layout } from "@ContextLogic/lego";
import TipsCard from "@merchant/component/wish-clips/resource-hub/TipsCard";
import Illustration from "@merchant/component/core/Illustration";
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

type Props = BaseProps;

const BestPracticesHeader: React.FC<Props> = ({ className, style }: Props) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <H4>What Makes a Successful Wish Clip</H4>
      <Layout.GridRow
        templateColumns="minmax(33%, 1fr) minmax(150px, 300px) minmax(33%, 1fr)"
        gap={"max(10px, 3%)"}
      >
        <Layout.FlexColumn
          style={styles.tipsCardColumn}
          justifyContent="space-evenly"
        >
          <TipsCard
            title={i`Vertical Orientation`}
            text={i`Wish Clips only displays vertically oriented videos`}
            illustration="verticalOrientationCircleIcon"
          />
          <TipsCard
            title={i`High Resolution`}
            text={i`Video should be high-resolution (at least 480p)`}
            illustration="highResCircleIcon"
          />
          <TipsCard
            title={i`Keep it short`}
            text={i`Keep videos less than ${30} seconds and up to ${50} MB`}
            illustration="timerCircleIcon"
          />
        </Layout.FlexColumn>
        {isSmallScreen || (
          <Illustration
            name="blankWishClipExampleScreenshot"
            alt={i`Screenshot of a blank Wish Clip in the Wish app`}
          />
        )}
        <Layout.FlexColumn
          style={styles.tipsCardColumn}
          justifyContent="space-evenly"
        >
          <TipsCard
            title={i`No extra graphics`}
            text={i`Avoid graphic overlays or animated effects`}
            illustration="phoneCircleIcon"
          />
          <TipsCard
            title={i`No audio (for now)`}
            text={i`Don't worry about audio now. Wish will be supporting it soon!`}
            illustration="muteCircleIcon"
          />
          <TipsCard
            title={i`Product alignment`}
            text={i`Video should align with photos and product descriptions`}
            illustration="givingHandCircleIcon"
          />
        </Layout.FlexColumn>
      </Layout.GridRow>
    </Layout.FlexColumn>
  );
};

export default observer(BestPracticesHeader);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 50,
          backgroundColor: surfaceLightest,
          padding: 50,
          borderRadius: 4,
        },
        tipsCardColumn: {
          gap: 20,
        },
      }),
    [surfaceLightest]
  );
};
