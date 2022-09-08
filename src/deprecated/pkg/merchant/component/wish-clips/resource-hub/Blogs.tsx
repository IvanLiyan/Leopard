import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { H5, Layout } from "@ContextLogic/lego";

import BlogCard, {
  BlogCardProps,
} from "@merchant/component/wish-clips/resource-hub/BlogCard";

const BlogCardOrder = ["VIDEO_HOW_TO", "VIDEOS_WITH_SMARTPHONE"] as const;
type BlogCardType = typeof BlogCardOrder[number];
type BlogCardData = {
  readonly title: BlogCardProps["title"];
  readonly content: BlogCardProps["content"];
  readonly illustration: BlogCardProps["illustration"];
  readonly href: BlogCardProps["href"];
};
const BlogCardData: { readonly [T in BlogCardType]: BlogCardData } = {
  VIDEO_HOW_TO: {
    title: i`Video How-to's and Best Practices`,
    illustration: "videoFilmBanner",
    content:
      i`Learn how to upload videos, best practices, creative ` +
      i`tips and strategies to get the most out of your videos, and more`,
    href: zendeskURL("360056495994"),
  },
  VIDEOS_WITH_SMARTPHONE: {
    title: i`Taking Videos with your Smartphone`,
    illustration: "holdingPhoneBanner",
    content:
      i`Follow these ${8} best practices for making a video on ` +
      i`your phone to make your products come to life`,
    href: zendeskURL("360058472533"),
  },
};

type Props = BaseProps;

const Blogs: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H5 style={styles.title}>FAQ</H5>
      <Layout.FlexRow style={styles.blogCardRows} alignItems="stretch">
        {BlogCardOrder.map((card) => {
          const { title, illustration, content, href } = BlogCardData[card];
          return (
            <BlogCard
              className={css(styles.blogCard)}
              title={title}
              illustration={illustration}
              content={content}
              href={href}
            />
          );
        })}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(Blogs);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginBottom: 10,
        },
        blogCard: {
          maxWidth: 300,
        },
        blogCardRows: {
          gap: 15,
          flexWrap: "wrap",
        },
      }),
    []
  );
};
