import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { motion, AnimatePresence } from "framer-motion";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { H4, H5 } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Plus Components */
import { SidePadding } from "@plus/component/nav/PageGuide";

/* Merchant Stores*/
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

export type BaseHomeBannerProps = BaseProps & {
  readonly title?: string;
  readonly illustration?: IllustrationName;
  readonly body?: ReactNode;
};

const BaseHomeBanner = ({
  title,
  body,
  illustration,
  style,
  className,
}: BaseHomeBannerProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.content)}>
        <H5 className={css(styles.welcome)}>Welcome</H5>
        {title && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <H4 style={styles.title}>{title}</H4>
              {body}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      {illustration != null && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <Illustration
              name={illustration}
              animate={false}
              alt={title || ""}
              className={css(styles.illustration)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default observer(BaseHomeBanner);

const useStylesheet = () => {
  const { primary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
          height: 200,
          display: "flex",
          WebkitFlexShrink: 0,
          WebkitFlexBasis: "auto",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0px ${SidePadding}`,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          "@media (min-width: 900px)": {
            maxWidth: "50%",
          },
        },
        welcome: {
          color: primary,
          marginBottom: 8,
        },
        title: {
          marginBottom: 8,
        },
        illustration: {
          height: 150,
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
      }),
    [primary, surfaceLightest],
  );
};
