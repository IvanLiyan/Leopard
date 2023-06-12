import React, { useMemo } from "react";
import { CSSProperties, StyleSheet } from "aphrodite";

/* Lego Components */
import { Layout, Markdown, Text } from "@ContextLogic/lego";

/* Merchant Components */
import Icon from "@core/components/Icon";
import Illustration from "@core/components/Illustration";

/* Store */
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTierThemes } from "@performance/migrated/toolkit/stats";
import { Perk } from "@performance/migrated/toolkit/perks";
import { css } from "@core/toolkit/styling";

/* Types */
import { WssMerchantLevelType } from "@schema";

export type TierStatus = "ACHIEVED" | "CURRENT" | "NOT_ACHIEVED";

type TierDetailsCardProps = BaseProps & {
  readonly level: WssMerchantLevelType;
  readonly perks: ReadonlyArray<Perk>;
  readonly status: TierStatus;
  readonly isLast: boolean;
};

const TierDetailsCard: React.FC<TierDetailsCardProps> = (props) => {
  const { className, style, level, perks, status, isLast } = props;

  const styles = useStylesheet(status);
  const tierThemes = useTierThemes();

  const renderPerk = ({ icon, text }: Perk) => (
    <Layout.FlexRow alignItems="center">
      <Icon size={20} name={icon} style={styles.perkIcon} />
      <Markdown style={styles.perkText} text={text} openLinksInNewTab />
    </Layout.FlexRow>
  );

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow style={styles.progressBar} alignItems="center">
        <div className={css(styles.circle)} />
        {isLast || status === "NOT_ACHIEVED" || (
          <hr className={css(styles.line)} />
        )}
      </Layout.FlexRow>
      <Layout.FlexRow alignItems="center">
        <Illustration
          name={tierThemes(level).icon}
          alt={tierThemes(level).icon}
          style={styles.badgeIcon}
        />
        <Text style={styles.badgeTitle} weight="semibold">
          {tierThemes(level).title}
        </Text>
      </Layout.FlexRow>
      <Layout.FlexColumn style={styles.perks}>
        {perks.map((perk) => (
          <div key={perk.icon}>{renderPerk(perk)}</div>
        ))}
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default TierDetailsCard;

const useStylesheet = (status: TierStatus) => {
  const {
    primary,
    borderPrimary,
    surfaceLight,
    surfaceLightest,
    surface,
    surfaceDarker,
    secondaryLight,
    textDark,
  } = useTheme();

  const circleStyleMap: Record<TierStatus, CSSProperties> = useMemo(
    () => ({
      ACHIEVED: {
        backgroundColor: surfaceLight,
        border: `2px solid ${primary}`,
        boxSizing: "border-box",
      },
      CURRENT: {
        backgroundColor: primary,
        border: `4px solid ${secondaryLight}`,
      },
      NOT_ACHIEVED: { backgroundColor: surface },
    }),
    [primary, secondaryLight, surface, surfaceLight],
  );

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          border: `1px solid ${status === "CURRENT" ? primary : borderPrimary}`,
          borderRadius: 4,
          padding: "16px 0 16px 16px",
          background: surfaceLightest,
        },
        progressBar: {
          marginBottom: 16,
        },
        circle: {
          width: 16,
          height: 16,
          borderRadius: "50%",
          ...circleStyleMap[status],
        },
        line: {
          flexGrow: 1,
          margin: `0 0 0 8px`,
          borderTop: `1px ${
            status === "ACHIEVED"
              ? `solid ${primary}`
              : `dotted ${surfaceDarker}`
          }`,
          borderBottom: "none",
        },
        badgeIcon: {
          height: 48,
          marginRight: 4,
        },
        badgeTitle: {
          fontSize: 14,
          color: textDark,
        },
        perks: {
          gap: "16px 0",
          marginTop: 24,
          paddingRight: 16,
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
    [
      status,
      primary,
      borderPrimary,
      surfaceLightest,
      circleStyleMap,
      surfaceDarker,
      textDark,
    ],
  );
};
