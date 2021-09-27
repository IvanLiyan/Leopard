import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

export type EmptyStateProps = {
  readonly text: string;
};

const EmptyState = (props: EmptyStateProps) => {
  const styles = useStylesheet();
  const { text } = props;

  return (
    <div className={css(styles.container)}>
      <Illustration name="fbsEmptyState" alt="empty" />
      <Markdown className={css(styles.text)} text={text} />
    </div>
  );
};

export default EmptyState;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0",
        },
        text: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          maxWidth: "640px",
          fontColor: "#152934",
          textAlign: "center",
        },
      }),
    []
  );
};
