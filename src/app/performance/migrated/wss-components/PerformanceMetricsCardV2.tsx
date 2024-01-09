import { StyleSheet } from "aphrodite";
import React, { useMemo } from "react";

/* Legacy Toolkit */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Info, Layout, Text } from "@ContextLogic/lego";
import Link from "@deprecated/components/Link";

/* Merchant Components */
import Icon from "@core/components/Icon";
import Illustration from "@core/components/Illustration";

/* Store */
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTierThemesV2 } from "@performance/migrated/toolkit/stats";

/* Types */
import { WssMerchantLevelType } from "@schema";
import Chip from "@mui/material/Chip";

type Score = {
  readonly level: WssMerchantLevelType | "PERFECT";
  readonly display: string;
};

export type PerformanceMetricsCardPropsV2 = BaseProps & {
  readonly title: string;
  readonly info: string;
  readonly href?: string;
  readonly compareIcon: () => React.ReactNode | undefined;
  readonly deltaText: () => React.ReactNode | undefined;
  readonly stats: {
    readonly today: Score;
    readonly lastUpdated: Score;
    readonly goal: Score;
  };
  isNew?: boolean;
};

const PerformanceMetricsCardV2: React.FC<PerformanceMetricsCardPropsV2> = ({
  className,
  style,
  title,
  info,
  href,
  compareIcon,
  deltaText,
  stats,
  isNew,
}) => {
  const styles = useStylesheet();
  const tierThemes = useTierThemesV2();

  const ScoreInfo = ({
    desc,
    score,
    level,
  }: {
    readonly desc: string;
    readonly score: string;
    readonly level: WssMerchantLevelType | "PERFECT";
  }) => (
    <Layout.FlexRow alignItems="baseline">
      <Text weight="regular" style={styles.scoreDescription}>
        {desc}
      </Text>
      <Layout.FlexRow>
        <Text weight="semibold" style={styles.scoreText}>
          {score}
        </Text>
        {level === "PERFECT" ? (
          <Icon
            name="rewards"
            size={18}
            style={[styles.smallIcon, styles.scoreBadge]}
          />
        ) : (
          <Illustration
            name={tierThemes(level).icon}
            alt={tierThemes(level).icon}
            style={[styles.smallIcon, styles.scoreBadge]}
          />
        )}
      </Layout.FlexRow>
    </Layout.FlexRow>
  );

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow style={styles.headerRow}>
        <Text weight="semibold" style={styles.title}>
          {title}
        </Text>
        <Info style={styles.icon} text={info} size={20} sentiment="info" />
        {isNew && (
          <>
            <div style={{ flex: 1 }} />
            <Chip
              label={ci18n("label indicating a new feature", "New")}
              icon={
                <Icon
                  style={{ paddingLeft: "7px" }}
                  size="small"
                  color="white"
                  name="thumbsUp" // TODO: add proper icon to atlas-ui
                />
              }
              color="primary"
              variant={"filled"}
              sx={{
                fontFamily: "Ginto",
              }}
            />
          </>
        )}
      </Layout.FlexRow>

      <Layout.FlexRow>
        <Layout.FlexColumn>
          <Text style={styles.scoreDescription}>
            {ci18n(
              "Means merchant's most recently calculated WSS score",
              "Today",
            )}
          </Text>
          <Layout.FlexRow>
            <Text weight="semibold" style={styles.todayScore}>
              {stats.today.display}
            </Text>
            {stats.today.level === "PERFECT" ? (
              <Icon
                name="rewards"
                size={24}
                style={[styles.icon, styles.todayBadge]}
              />
            ) : (
              <Illustration
                name={tierThemes(stats.today.level).icon}
                alt={tierThemes(stats.today.level).icon}
                style={[styles.icon, styles.todayBadge]}
              />
            )}
            {compareIcon()}
            {deltaText()}
          </Layout.FlexRow>
        </Layout.FlexColumn>
      </Layout.FlexRow>

      <Layout.FlexRow style={{ gap: 24 }}>
        <ScoreInfo
          desc={ci18n(
            "Means merchant's previously calculated WSS score",
            "Last update:",
          )}
          score={stats.lastUpdated.display}
          level={stats.lastUpdated.level}
        />
        <ScoreInfo
          desc={ci18n("Means the target WSS score to achieve", "Goal:")}
          score={stats.goal.display}
          level={
            stats.lastUpdated.level === "PLATINUM"
              ? "PERFECT"
              : stats.goal.level
          }
        />
      </Layout.FlexRow>

      {href != null && (
        <Link href={href}>
          <Text style={styles.footerText}>
            {ci18n(
              "Open new page to view details on the WSS metric",
              "View details",
            )}
          </Text>
        </Link>
      )}
    </Layout.FlexColumn>
  );
};

export default PerformanceMetricsCardV2;

const useStylesheet = () => {
  const { borderPrimary, textDark, surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          padding: 16,
          background: surfaceLightest,
          gap: 8,
        },
        icon: {
          marginLeft: 4,
        },
        smallIcon: {
          marginLeft: 2,
        },
        headerRow: {
          gap: 8,
        },
        title: {
          fontSize: 16,
          color: textDark,
          whiteSpace: "nowrap",
        },
        scoreBadge: {
          height: 18,
          flexShrink: 0,
        },
        scoreDescription: {
          fontSize: 16,
          color: textDark,
          marginRight: 4,
          whiteSpace: "nowrap",
        },
        scoreText: {
          fontSize: 20,
          color: textDark,
        },
        todayScore: {
          fontSize: 40,
          color: textDark,
        },
        todayBadge: {
          height: 24,
        },
        footerText: {
          fontSize: 14,
        },
      }),
    [borderPrimary, textDark, surfaceLightest],
  );
};
