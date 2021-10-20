/*
 * ExternalBoost.tsx
 *
 * Created by Jonah Dlin on Thu Mar 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";
import ExternalBoostDailyStats from "./ExternalBoostDailyStats";
import ExternalBoostToggle from "./ExternalBoostToggle";
import { Card, Text } from "@ContextLogic/lego";
import { ExternalBoostInitialData } from "@toolkit/product-boost/external-boost/external-boost";

type Props = BaseProps & {
  readonly initialData: ExternalBoostInitialData;
};

const ExternalBoost: React.FC<Props> = ({
  className,
  style,
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const {
    marketing: {
      currentMerchant: {
        offsiteBoost: {
          chargingMethod,
          statsAvailableDate: { unix: minDateUnix },
        },
      },
    },
  } = initialData;

  const minDate = useMemo(() => new Date(minDateUnix * 1000), [minDateUnix]);
  const isCpa = chargingMethod === "CPA";

  return (
    <Card className={css(styles.root, className, style)}>
      <Text className={css(styles.title)} weight="bold">
        {isCpa ? i`Enable ExternalBoost` : i`Set an ExternalBoost budget`}
      </Text>
      <ExternalBoostToggle
        className={css(styles.stepContent)}
        initialData={initialData}
      />
      <div className={css(styles.separator)} />
      <Text className={css(styles.title)} weight="bold">
        Performance insights
      </Text>
      <ExternalBoostDailyStats
        className={css(styles.stepContent)}
        chargingMethod={chargingMethod}
        minDate={minDate}
        isCpa={isCpa}
      />
    </Card>
  );
};

export default observer(ExternalBoost);

const useStylesheet = () => {
  const { pageBackground, borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
          padding: 24,
        },
        title: {
          color: textBlack,
          fontSize: 24,
          lineHeight: "28px",
        },
        stepContent: {
          marginTop: 24,
        },
        separator: {
          border: `1px solid ${borderPrimary}`,
          boxSizing: "border-box",
          height: 1,
          margin: "24px 0px",
        },
      }),
    [pageBackground, borderPrimary, textBlack],
  );
};
