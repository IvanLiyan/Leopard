import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import Illustration from "@merchant/component/core/Illustration";
import { PrimaryButton, StaggeredFadeIn, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core/Illustration";

type Props = BaseProps & {
  readonly title: string;
  readonly description: string;
  readonly illustration: IllustrationName;
};

export default (props: Props) => {
  const { illustration, title, description } = props;
  const styles = useStylesheet();
  return (
    <StaggeredFadeIn
      className={css(styles.content)}
      deltaY={5}
      animationDelayMs={400}
    >
      <Illustration
        name={illustration}
        alt={title}
        className={css(styles.illustration)}
      />
      <Text weight="bold">{title}</Text>
      <div className={css(styles.description)}>{description}</div>
      <PrimaryButton
        href="/"
        className={css(styles.cta)}
        style={{ fontSize: 20, padding: "10px 100px" }}
      >
        Go to Dashboard
      </PrimaryButton>
    </StaggeredFadeIn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 500,
        },
        title: {
          textAlign: "center",
          marginBottom: 15,
          lineHeight: 1.4,
          letterSpacing: "0.4px",
          fontSize: 24,
        },
        description: {
          textAlign: "center",
          marginBottom: 35,
          lineHeight: 1.5,
          letterSpacing: "0.32px",
          fontSize: 20,
        },
        illustration: {
          width: "100%",
        },
        cta: {},
      }),
    []
  );
};
