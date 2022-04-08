import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ci18n } from "@legacy/core/i18n";
import { css } from "@toolkit/styling";
import { H5, Card, Text } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import RejectionReasonList from "./RejectionReasonList";

type Props = BaseProps;

const RejectionReasons: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(className, style, styles.root)}>
      <H5 className={css(styles.title)}>Rejection reasons</H5>
      <Card contentContainerStyle={css(styles.cardContent)}>
        <Text className={css(styles.titleSection)}>
          View reasons why your video may be rejected and examples of each
          rejection reason.
        </Text>
        <div className={css(styles.grid)}>
          <RejectionReasonList
            title={ci18n(
              "Placed in front of video attribute. E.g 'Video is Blank', 'Video is Small or blurry'",
              "Video is"
            )}
            list={[
              ci18n("Meaning blank or empty video", "Blank"),
              i`Small or Blurry`,
              i`Screen recording`,
              i`Picture slideshow`,
              i`Pictured with a major brand`,
            ]}
          />

          <RejectionReasonList
            title={ci18n(
              "Placed in front of video attribute. E.g 'Video has Nudity'",
              "Video has"
            )}
            list={[
              i`Prominent non-English text`,
              ci18n(
                "Short form for 'Video has a person talking to the camera'",
                "Person talking to the camera"
              ),
              i`Hateful symbols`,
              i`Obscenity or graphic content`,
              i`Embedded logo. E.g TikTok, Beecut, etc`,
              i`Blurred watermark to evade copyright`,
              i`Counterfeit products`,
              i`Commercial copyright`,
            ]}
          />

          <RejectionReasonList
            title={ci18n(
              "Placed in front of video attribute. E.g 'Video does: Refer customer off platform'",
              "Video does"
            )}
            list={[
              i`Refer customer off platform`,
              i`Show product’s factory`,
              i`Show more than 1 product`,
            ]}
          />
        </div>
      </Card>
    </div>
  );
};

export default observer(RejectionReasons);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: 10,
        },
        cardContent: {
          padding: 20,
        },
        titleSection: {
          paddingBottom: 15,
          borderBottom: `1px solid ${borderPrimary}`,
          marginBottom: 15,
        },
        grid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: 15,
        },
        item: {
          marginTop: 10,
        },
      }),
    [borderPrimary]
  );
};
