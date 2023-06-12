import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WssMerchantLevelType } from "@schema";

/* Relative Imports */
import WssSection from "./WssSection";
import TierDetailsCard, { TierStatus } from "./TierDetailsCard";
import { PERKS_DETAILS } from "@performance/migrated/toolkit/perks";

type TierDetailsProps = BaseProps & {
  readonly level?: WssMerchantLevelType | null;
};

type PickedLevel = Extract<
  WssMerchantLevelType,
  "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
>;

const TierDetails: React.FC<TierDetailsProps> = (props) => {
  const { className, style, level } = props;

  const levelOrder: ReadonlyArray<PickedLevel> = [
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
  ];

  const styles = useStylesheet();

  const curLevelIdx = levelOrder.findIndex((curLevel) => curLevel === level);

  const getStatus = (idx: number): TierStatus => {
    if (idx < curLevelIdx) {
      return "ACHIEVED";
    } else if (idx === curLevelIdx) {
      return "CURRENT";
    }
    return "NOT_ACHIEVED";
  };

  return (
    <WssSection style={[className, style]} title={i`Tier Details`}>
      <Layout.GridRow
        templateColumns="repeat(4, 1fr)"
        smallScreenTemplateColumns="repeat(2, 1fr)"
        alignItems="flex-start"
        style={styles.body}
      >
        {levelOrder.map((level, idx) => (
          <TierDetailsCard
            key={level}
            level={level}
            status={getStatus(idx)}
            perks={PERKS_DETAILS[level]}
            isLast={idx === levelOrder.length - 1}
          />
        ))}
      </Layout.GridRow>
    </WssSection>
  );
};

export default observer(TierDetails);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          gap: 16,
        },
      }),
    [],
  );
};
