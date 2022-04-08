/*
 * OptimizeVideoCard.tsx
 *
 * Created by Jonah Dlin on Mon Mar 21 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, H5 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { useUIStateBool } from "@toolkit/ui-state";
import Illustration, {
  IllustrationName,
} from "@merchant/component/core/Illustration";
import { useNavigationStore } from "@stores/NavigationStore";

import Link from "@next-toolkit/Link";

type Props = BaseProps;

const OptimizeVideoCard: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const {
    value: dismissedTips = false,
    isLoading,
    update: setDismissedTips,
  } = useUIStateBool("DISMISSED_VIDEO_OPTIMIZE_TIPS");

  if (isLoading) {
    return null;
  }

  const renderLink = ({
    title,
    illustrationName,
    description,
    href,
  }: {
    readonly title: string;
    readonly illustrationName: IllustrationName;
    readonly description: string;
    readonly href: string;
  }) => {
    return (
      <Layout.FlexRow
        style={styles.card}
        onClick={() => navigationStore.navigate(href)}
      >
        <Layout.FlexRow
          justifyContent="center"
          alignItems="center"
          style={styles.illustrationBackground}
        >
          <Illustration name={illustrationName} alt="" />
        </Layout.FlexRow>
        <Layout.FlexColumn style={styles.cardContent} alignItems="flex-start">
          <Link style={styles.cardLink} fadeOnHover={false}>
            {title}
          </Link>
          <Text style={styles.cardDescription}>{description}</Text>
        </Layout.FlexColumn>
      </Layout.FlexRow>
    );
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow justifyContent="space-between">
        <H5>Accelerate Sales by Optimizing Your Videos</H5>
        <Link onClick={async () => await setDismissedTips(!dismissedTips)}>
          <Text style={styles.hideTips} weight="regular">
            {dismissedTips ? i`Show Tips` : i`Hide Tips`}
          </Text>
        </Link>
      </Layout.FlexRow>
      {!dismissedTips && (
        <Layout.GridRow
          style={styles.cards}
          templateColumns="1fr 1fr"
          smallScreenTemplateColumns="1fr"
        >
          {renderLink({
            title: i`Best practices`,
            description: i`Maximize your impact by learning recommended video attributes`,
            href: "/videos/resource-hub/best-practices",
            illustrationName: "eyeOpenLineUp",
          })}
          {renderLink({
            title: i`Examples`,
            description: i`Get more inspiration from top viewed videos`,
            href: "/videos/resource-hub/best-practices",
            illustrationName: "eyeOpenLineUp",
          })}
          {renderLink({
            title: i`Things to avoid`,
            description: i`Learn what may get your video declined`,
            href: "/videos/resource-hub/things-to-avoid",
            illustrationName: "checklistWithX",
          })}
          {renderLink({
            title: i`Blogs`,
            description: i`Develop your Wish clips video content`,
            href: "/videos/resource-hub/blogs",
            illustrationName: "documentAndBox",
          })}
        </Layout.GridRow>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { surfaceLightest, surfaceLighter, lightBlueSurface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "32px 64px",
          position: "relative",
          backgroundColor: surfaceLightest,
          borderRadius: 4,
        },
        hideTips: {
          fontSize: 16,
          lineHeight: 1.5,
        },
        cards: {
          gap: "24px 48px",
          marginTop: 24,
          maxWidth: 956,
        },
        card: {
          gap: 24,
          borderRadius: 4,
          backgroundColor: surfaceLighter,
          padding: "16px 24px",
          transition: "opacity 0.3s linear",
          opacity: 1,
          cursor: "pointer",
          maxWidth: 454,
          ":hover": {
            opacity: 0.6,
          },
        },
        illustrationBackground: {
          backgroundColor: lightBlueSurface,
          width: 72,
          height: 72,
          padding: 16,
        },
        cardContent: {
          gap: 8,
        },
        cardLink: {
          fontSize: 16,
          lineHeight: 1.5,
        },
        cardDescription: {
          fontSize: 14,
          lineHeight: "20px",
        },
      }),
    [surfaceLightest, surfaceLighter, lightBlueSurface]
  );
};

export default observer(OptimizeVideoCard);
