import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import RejectionReasons from "@merchant/component/wish-clips/resource-hub/RejectionReasons";
import PreviouslyDeclinedVideos from "@merchant/component/wish-clips/resource-hub/PreviouslyDeclinedVideos";
import { Layout } from "@ContextLogic/lego";

type Props = BaseProps;

const ThingsToAvoid: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <RejectionReasons />
      <PreviouslyDeclinedVideos />
    </Layout.FlexColumn>
  );
};

export default observer(ThingsToAvoid);

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
