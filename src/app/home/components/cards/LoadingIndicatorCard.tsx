import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { motion, AnimatePresence } from "framer-motion";

import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly minHeight: number;
};

const LoadingIndicatorCard = (props: Props) => {
  const { className, style, minHeight } = props;
  const styles = useStylesheet();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, flip: Infinity }}
        exit={{ opacity: 0 }}
      >
        <Layout.FlexColumn
          style={[styles.root, className, style, { minHeight }]}
        />
      </motion.div>
    </AnimatePresence>
  );
};

const useStylesheet = () => {
  const { surface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surface,
          borderRadius: 4,
        },
      }),
    [surface],
  );
};

export default observer(LoadingIndicatorCard);
