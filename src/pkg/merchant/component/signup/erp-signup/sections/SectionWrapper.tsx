import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { pageBackground } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ErpSignupState from "@merchant/model/external/erp-signup/ErpSignupState";

type SectionWrapperProps = BaseProps & {
  readonly title: string;
  readonly anchorId: string;
};

export type BaseSectionProps = BaseProps & {
  readonly state: ErpSignupState;
};

const SectionWrapper = (props: SectionWrapperProps) => {
  const styles = useStylesheet();
  const { title, anchorId, className, children } = props;

  return (
    <ScrollableAnchor id={anchorId}>
      <Card className={css(styles.root, className)}>
        <section className={css(styles.title)}>{title}</section>
        {children}
      </Card>
    </ScrollableAnchor>
  );
};
export default SectionWrapper;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 20,
          fontWeight: weightBold,
          lineHeight: 1.4,
        },
      }),
    [],
  );
