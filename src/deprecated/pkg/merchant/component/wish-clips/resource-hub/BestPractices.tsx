import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout } from "@ContextLogic/lego";
import MakeASuccessfulWishClip from "@merchant/component/wish-clips/resource-hub/MakeASuccessfulWishClip";
import VideoLeaderboard from "@merchant/component/wish-clips/resource-hub/VideoLeaderboard";

type Props = BaseProps;

const BestPractices: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <MakeASuccessfulWishClip />
      <VideoLeaderboard />
    </Layout.FlexColumn>
  );
};

export default observer(BestPractices);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 50,
        },
      }),
    []
  );
};
