import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import {
  PerformanceHealthInitialData,
  PickedMerchantWssDetails,
} from "@performance/migrated/toolkit/stats";
import { IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import OverviewMaturedOrders from "./OverviewMaturedOrders";
import OverviewSchedule from "./OverviewSchedule";
import OverviewTier from "./OverviewTier";

type OverviewProps = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const Overview: React.FC<OverviewProps> = (props) => {
  const {
    className,
    style,
    wssDetails,
    initialData: {
      currentMerchant: { state },
    },
  } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Text style={styles.title} weight="bold">
        Overview
      </Text>
      <Layout.FlexRow style={styles.children} alignItems="stretch">
        <OverviewTier merchantState={state} wssDetails={wssDetails} />
        <OverviewSchedule merchantState={state} wssDetails={wssDetails} />
        <OverviewMaturedOrders merchantState={state} wssDetails={wssDetails} />
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(Overview);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: 28,
          color: textBlack,
        },
        children: {
          gap: 16,
          marginTop: 16,
          [`@media ${IS_SMALL_SCREEN}`]: {
            flexWrap: "wrap",
          },
        },
      }),
    [textBlack],
  );
};
