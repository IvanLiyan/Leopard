import { Card, H5, Layout, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IconName } from "@ContextLogic/zeus";
import Icon from "@core/components/Icon";
import Illustration from "@core/components/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import { CommerceMerchantState, WssMerchantLevelType } from "@schema";
import { Perk, PERKS_SUMMARY } from "@performance/migrated/toolkit/perks";
import {
  isAtRisk,
  isBanned,
  PickedMerchantWssDetails,
  useTierThemes,
} from "@performance/migrated/toolkit/stats";
import { css, IS_LARGE_SCREEN } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const useTierCardThemes = (
  merchantState: CommerceMerchantState,
  level?: WssMerchantLevelType | null,
): {
  readonly title: string;
  readonly icon: IconName;
  readonly border?: string;
  readonly background?: string;
  readonly tip?: string;
  readonly tipIcon?: IconName;
  readonly tipBackground?: string;
} => {
  const { warning, warningLighter } = useTheme();

  if (isBanned(merchantState)) {
    return {
      title: i`Your account has been deactivated`,
      icon: "warning",
      tip:
        i`Based on our evaluation of your store's performance, your ` +
        i`account has been deactivated.`,
      border: warning,
      background: warningLighter,
      tipBackground: warning,
    };
  } else if (level != null && isAtRisk(level)) {
    return {
      title: i`You're at risk of suspension`,
      icon: "warning",
      tip:
        i`Please improve your performance metrics and address infractions to ensure ` +
        i`your account stays active on Wish`,
      border: warning,
      background: warningLighter,
      tipBackground: warning,
    };
  }
  return {
    title: i`Your current tier`,
    icon: "rewards",
  };
};

const OverviewTier: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, wssDetails, merchantState } = props;

  const tierThemes = useTierThemes();

  const level = wssDetails?.level;
  const cardThemes = useTierCardThemes(merchantState, level);

  const renderPerk = ({ icon, text }: Perk) => (
    <Layout.FlexRow alignItems="center">
      <Icon size={20} name={icon} style={styles.perkIcon} />
      <Markdown style={styles.perkText} text={text} openLinksInNewTab />
    </Layout.FlexRow>
  );

  return (
    <Card
      style={[
        styles.section,
        { borderColor: cardThemes.border },
        className,
        style,
      ]}
      contentContainerStyle={css(styles.cardContent, {
        background: cardThemes.background,
      })}
    >
      <Layout.FlexColumn>
        <Layout.FlexRow style={styles.header}>
          <Icon name={cardThemes.icon} size={24} style={styles.icon} />
          <H5>{cardThemes.title}</H5>
        </Layout.FlexRow>
        <Layout.FlexColumn style={styles.body}>
          <Layout.FlexRow style={styles.tierContainer} alignItems="stretch">
            <Layout.FlexColumn
              style={[styles.badgeBigContainer]}
              alignItems="center"
            >
              <Illustration
                name={level ? tierThemes(level).icon : "wssUnratedBadge"}
                alt={level ? tierThemes(level).icon : "wssUnratedBadge"}
                style={styles.badgeBig}
              />
              <Text style={styles.levelTitle} weight="bold">
                {level ? tierThemes(level).title : i`Unrated`}
              </Text>
            </Layout.FlexColumn>
            <Layout.FlexColumn style={styles.perks}>
              {!isAtRisk(level) &&
                !isBanned(merchantState) &&
                level &&
                PERKS_SUMMARY[level].map((perk) => (
                  <div key={perk.icon}>{renderPerk(perk)}</div>
                ))}
            </Layout.FlexColumn>
          </Layout.FlexRow>
          {cardThemes.tip != null && (
            <Layout.FlexRow
              style={[
                styles.tipContainer,
                { background: cardThemes.tipBackground },
              ]}
            >
              {cardThemes.tipIcon && (
                <Icon name={cardThemes.tipIcon} size={24} style={styles.icon} />
              )}
              <Text>{cardThemes.tip}</Text>
            </Layout.FlexRow>
          )}
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(OverviewTier);

const useStylesheet = () => {
  const { textDark, surfaceLight, surfaceDarkest, warningLighter, warning } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          flexGrow: 1,
        },
        atRiskSection: {
          border: `1px solid ${warning}`,
          borderRadius: 4,
        },
        cardContent: {
          padding: 16,
          [`@media ${IS_LARGE_SCREEN}`]: {
            maxWidth: 400,
          },
        },
        atRiskCardContent: {
          background: warningLighter,
        },
        header: { marginBottom: 16 },
        body: {
          margin: "8px 8px 0px 8px",
        },
        badgeBigContainer: {
          boxSizing: "border-box",
          maxWidth: 146,
        },
        levelTitle: {
          fontSize: 20,
          lineHeight: "24px",
          color: surfaceDarkest,
          textAlign: "center",
        },
        badgeBig: {
          height: 72,
          width: 72,
          marginBottom: 8,
        },
        icon: {
          marginRight: 8,
        },
        tipContainer: {
          marginTop: 16,
          padding: "16px",
          background: surfaceLight,
          color: textDark,
          borderRadius: 8,
        },
        atRiskTipContainer: {
          border: warning,
          background: warning,
        },
        tierContainer: {
          gap: 24,
        },
        perks: {
          gap: 16,
        },
        perkIcon: {
          marginRight: 8,
          flexShrink: 0,
        },
        perkText: {
          fontSize: 14,
          color: textDark,
        },
      }),
    [surfaceDarkest, surfaceLight, textDark, warning, warningLighter],
  );
};
