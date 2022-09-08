/*
 * TosAtoms.tsx
 *
 * Created by Jonah Dlin on Tue Apr 20 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego */
import { Card, Text } from "@ContextLogic/lego";

/* Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

type TagProps = {
  readonly children?: string;
};

export const TosH1: React.FC<TagProps> = ({ children }: TagProps) => {
  const styles = useStylesheet();
  return (
    <Text className={css(styles.h1)} weight="bold">
      {children}
    </Text>
  );
};

export const TosH2: React.FC<TagProps> = ({ children }: TagProps) => {
  const styles = useStylesheet();
  return (
    <Text className={css(styles.h2)} weight="semibold">
      {children}
    </Text>
  );
};

export const TosH3: React.FC<TagProps> = ({ children }: TagProps) => {
  const styles = useStylesheet();
  return (
    <Text className={css(styles.h3)} weight="bold">
      {children}
    </Text>
  );
};

export const TosUnderline: React.FC<TagProps> = ({ children }: TagProps) => {
  const styles = useStylesheet();
  return <span className={css(styles.underline)}>{children}</span>;
};

export const TosCard: React.FC<Props> = ({
  className,
  style,
  children,
}: Props) => {
  const styles = useStylesheet();

  return <Card className={css(styles.root, className, style)}>{children}</Card>;
};

export const TosP: React.FC<Props> = ({
  className,
  style,
  children,
}: Props) => {
  const styles = useStylesheet();

  return <p className={css(styles.p, className, style)}>{children}</p>;
};

export const TosSection: React.FC<Props> = ({
  className,
  style,
  children,
}: Props) => {
  const styles = useStylesheet();

  return (
    <section className={css(styles.p, className, style)}>{children}</section>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 40,
        },
        h1: {
          fontSize: 28,
          lineHeight: "32px",
        },
        h2: {
          fontSize: 20,
          lineHeight: "24px",
          marginBottom: 8,
        },
        h3: {
          fontSize: 16,
          lineHeight: 1.15,
        },
        underline: {
          textDecoration: "underline", // TODO (dsirivat): Deprecate pending atlas
        },
        p: {
          fontSize: 14,
          lineHeight: "20px",
        },
        section: {
          ":not(:last-child)": {
            marginBottom: 32,
          },
        },
      }),
    []
  );
};
