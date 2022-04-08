import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import PositiveExamples from "./PositiveExamples";
import NegativeExamples from "./NegativeExamples";
import RejectionReasons from "./RejectionReasons";
import RequiredVideoAttributes from "./RequiredVideoAttributes";

type Props = BaseProps;

const BestPractices: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(className, style, styles.root)}>
      <PositiveExamples className={css(styles.section)} />
      <RequiredVideoAttributes className={css(styles.section)} />
      <NegativeExamples className={css(styles.section)} />
      <RejectionReasons className={css(styles.section)} />
    </div>
  );
};

export default observer(BestPractices);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        section: {
          marginTop: 30,
        },
      }),
    []
  );
};
