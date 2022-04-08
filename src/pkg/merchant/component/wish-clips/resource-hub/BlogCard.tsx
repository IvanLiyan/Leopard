import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, H4Markdown, Layout } from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

import Link from "@next-toolkit/Link";

export type BlogCardProps = BaseProps & {
  readonly title: string;
  readonly content: string;
  readonly illustration: IllustrationName;
  readonly href?: string;
};

const BlogCard = (props: BlogCardProps) => {
  const { title, content, href, illustration, className, style } = props;
  const styles = useStylesheet();
  return (
    <Link href={href} openInNewTab style={[styles.root, className, style]}>
      <Illustration name={illustration} alt={title} />
      <Layout.FlexColumn style={styles.contentContainer}>
        <H4Markdown text={title} style={styles.title} />
        <Text style={styles.bodyText}>{content}</Text>
      </Layout.FlexColumn>
    </Link>
  );
};
export default observer(BlogCard);

const useStylesheet = () => {
  const { textDark, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        contentContainer: {
          backgroundColor: surfaceLightest,
          padding: 24,
          flexGrow: 1,
        },
        title: {
          fontSize: 20,
        },
        bodyText: {
          fontSize: 16,
          color: textDark,
          marginTop: 8,
          marginBottom: 20,
        },
      }),
    [textDark, surfaceLightest]
  );
};
