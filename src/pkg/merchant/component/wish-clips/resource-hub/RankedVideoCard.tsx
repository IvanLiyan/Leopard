import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { ci18n } from "@legacy/core/i18n";

import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { css } from "@toolkit/styling";
import VideoModal from "@merchant/component/wish-clips/VideoModal";

import numeral from "numeral";
import Illustration from "@merchant/component/core/Illustration";

const secondsToHoursFormatted = (seconds: number) => {
  const hours = seconds / 60 / 60;
  return numeral(hours).format("0.0") + ci18n("Symbol for hour", "h");
};

type StatsProps = { readonly label: string; readonly value: string };
const Stats: React.FC<StatsProps> = ({ label, value }) => {
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn>
      <Text style={styles.statsLabel}>{label}</Text>
      <Text weight="medium">{value}</Text>
    </Layout.FlexColumn>
  );
};

type Props = BaseProps & {
  readonly rank: number;
  readonly videoUrl: string;
  readonly viewCount: number;
  readonly watchTimeInSeconds: number;
};

const RankedVideoCard: React.FC<Props> = ({
  className,
  style,
  rank,
  videoUrl,
  viewCount,
  watchTimeInSeconds,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      <div className={css(styles.videoContainer)}>
        <Layout.FlexRow
          justifyContent="center"
          alignItems="stretch"
          className={css(styles.playIconContainer)}
          onClick={() => new VideoModal({ videoUrl }).render()}
        >
          <Illustration
            name="playVideoIcon"
            alt={i`Play icon`}
            className={css(styles.playIcon)}
          />
        </Layout.FlexRow>
        <video className={css(styles.video)} muted>
          <source src={videoUrl} />
        </video>
      </div>
      <Layout.FlexColumn
        style={styles.statsColumn}
        justifyContent="space-between"
      >
        <Text style={styles.rankPill} weight="medium">
          Rank #{rank}
        </Text>
        <Stats
          label={ci18n("Number of views this video has", "Views")}
          value={numeral(viewCount).format("0.0a")}
        />
        <Stats
          label={ci18n(
            "Label for total watch time for this video",
            "Watch Time"
          )}
          value={secondsToHoursFormatted(watchTimeInSeconds)}
        />
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

export default observer(RankedVideoCard);

const useStylesheet = () => {
  const { surfaceLightest, textLight, lightBlueSurface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
          padding: 20,
          borderRadius: 10,
          gap: 30,
        },
        rankPill: {
          backgroundColor: lightBlueSurface,
          borderRadius: 50,
          padding: "3px 15px",
          textAlign: "center",
        },
        videoContainer: {
          position: "relative",
          height: "100%",
        },
        video: {
          height: "100%",
        },
        playIconContainer: {
          position: "absolute",
          zIndex: 2,
          cursor: "pointer",
          height: "100%",
          width: "100%",
        },
        playIcon: {
          width: "50%",
          ":hover": {
            width: "51%",
          },
          ":active": {
            width: "48%",
          },
        },
        statsColumn: {
          alignSelf: "stretch",
        },
        statsLabel: {
          color: textLight,
        },
      }),
    [surfaceLightest, textLight, lightBlueSurface]
  );
};
