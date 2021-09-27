/*
 *
 * InsightsRow.tsx
 * Merchant Plus
 *
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { motion, AnimatePresence } from "framer-motion";

/* Toolkit */
import { useUpdateUIStateBool } from "@toolkit/ui-state";

import HowToFulfillCard from "./HowToFulfillCard";
import FulfillmentSLACard from "./FulfillmentSLACard";
import FulfillmentPenaltyCard from "./FulfillmentPenaltyCard";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly hasDismissedHowToFulfillInsight: boolean;
  readonly hasDismissedFulfillmentPenaltyInsight: boolean;
  readonly hasDismissedFulfillmentSlaInsight: boolean;
};

const InsightsRow: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    hasDismissedHowToFulfillInsight: initialHasDismissedHowToFulfillInsight,
    hasDismissedFulfillmentPenaltyInsight: initialHasDismissedFulfillmentPenaltyInsight,
    hasDismissedFulfillmentSlaInsight: initialHasDismissedFulfillmentSlaInsight,
  } = props;

  const [
    hasDismissedHowToFulfillInsight,
    setHasDismissedHowToFulfillInsight,
  ] = useState(initialHasDismissedHowToFulfillInsight);
  const [
    hasDismissedFulfillmentPenaltyInsight,
    setHasDismissedFulfillmentPenaltyInsight,
  ] = useState(initialHasDismissedFulfillmentPenaltyInsight);
  const [
    hasDismissedFulfillmentSlaInsight,
    setHasDismissedFulfillmentSlaInsight,
  ] = useState(initialHasDismissedFulfillmentSlaInsight);

  const updateHasDismissedHowToFulfillInsight = useUpdateUIStateBool(
    "DISMISSED_HOW_TO_FULFILL_INSIGHT"
  );
  const updateHasDismissedFulfillmentSLAInsight = useUpdateUIStateBool(
    "DISMISSED_FULFILLMENT_SLA_INSIGHT"
  );
  const updateHasDismissedFulfillmentPenaltyInsight = useUpdateUIStateBool(
    "DISMISSED_FULFILLMENT_PENALTY_INSIGHT"
  );

  const animationProps = {
    initial: { opacity: 0, scale: 0.88 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const showInsightsRow = !(
    hasDismissedHowToFulfillInsight &&
    hasDismissedFulfillmentSlaInsight &&
    hasDismissedFulfillmentPenaltyInsight
  );

  if (!showInsightsRow) return null;

  return (
    <div className={css(styles.root, className, style)}>
      {!hasDismissedHowToFulfillInsight && (
        <AnimatePresence>
          <motion.div
            {...animationProps}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <HowToFulfillCard
              className={css(styles.insight)}
              onDismiss={() => {
                setHasDismissedHowToFulfillInsight(true);
                updateHasDismissedHowToFulfillInsight(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
      {!hasDismissedFulfillmentSlaInsight && (
        <AnimatePresence>
          <motion.div
            {...animationProps}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            <FulfillmentSLACard
              className={css(styles.insight)}
              onDismiss={() => {
                setHasDismissedFulfillmentSlaInsight(true);
                updateHasDismissedFulfillmentSLAInsight(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
      {!hasDismissedFulfillmentPenaltyInsight && (
        <AnimatePresence>
          <motion.div
            {...animationProps}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            <FulfillmentPenaltyCard
              className={css(styles.insight)}
              onDismiss={() => {
                setHasDismissedFulfillmentPenaltyInsight(true);
                updateHasDismissedFulfillmentPenaltyInsight(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default observer(InsightsRow);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          alignItems: "stretch",
          gridAutoFlow: "column",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        },
        insight: {
          height: 115,
        },
      }),
    []
  );
};
