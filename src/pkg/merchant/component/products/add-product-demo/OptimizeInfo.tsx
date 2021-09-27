import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Alert, Markdown } from "@ContextLogic/lego";
import { Illustration, IllustrationName } from "@merchant/component/core";
import { zendeskURL } from "@toolkit/url";
import { weightNormal, weightSemibold } from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";
import { MAX_VIDEO_LENGTH } from "@toolkit/products/demo-video";

type InfoSectionProps = BaseProps & {
  readonly title: string;
  readonly illustration: IllustrationName;
};

const InfoSection: React.FC<InfoSectionProps> = (props: InfoSectionProps) => {
  const { className, style, title, illustration, children } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.infoSection, className, style)}>
      <Illustration
        className={css(styles.illustration)}
        name={illustration}
        alt=""
      />
      <div className={css(styles.infoTitle, styles.text)}>{title}</div>
      <div className={css(styles.infoText, styles.text)}>{children}</div>
    </div>
  );
};

type Props = BaseProps;

const OptimizeInfo: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const demoStyleLearnMoreLink = zendeskURL("360058472533");

  return (
    <Alert
      className={css(styles.root, className, style)}
      sentiment="info"
      text={() => (
        <div className={css(styles.content)}>
          <div className={css(styles.title, styles.text, styles.section)}>
            Optimize your Demo Videos with the following required attributes:
          </div>
          <InfoSection
            className={css(styles.section)}
            illustration="demoBoxCircle"
            title={i`Demo-style video`}
          >
            <Markdown
              text={
                i`Boost buyer confidence by showing someone wearing or using ` +
                i`your product. Demo videos allow customers to envision ` +
                i`using it themselves by presenting product in a ` +
                i`straightforward video format. **Do not include** embedded ` +
                i`text, graphic overlays, or animated effects.`
              }
            />
          </InfoSection>
          <InfoSection
            className={css(styles.section)}
            illustration="phoneDimensionsCircle"
            title={i`9:16 vertical aspect ratio`}
          >
            <Markdown
              text={
                i`Your video will be shown in a full, portrait-mode screen to ` +
                i`shoppers. Optimize your demo videos with a 9:16 aspect ratio so ` +
                i`important details won’t be cropped out. ` +
                i`[Learn how to take Demo Videos with your phone](${demoStyleLearnMoreLink})`
              }
            />
          </InfoSection>
          <InfoSection
            className={css(styles.section)}
            illustration="clockCircle"
            title={i`${MAX_VIDEO_LENGTH} seconds or less`}
          >
            A focused story will keep customers engaged without missing out on
            potential sales, so tell your product’s story in {30} seconds or
            less.
          </InfoSection>
        </div>
      )}
    />
  );
};

export default observer(OptimizeInfo);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        content: {},
        section: {
          ":not(:last-child)": { marginBottom: 12 },
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        title: {
          fontWeight: weightNormal,
        },
        infoSection: {
          display: "grid",
          gap: "0px 12px",
          gridTemplateColumns: 40,
        },
        illustration: {
          height: 40,
          alignSelf: "flex-start",
          gridColumn: 1,
          gridRow: "1 / 3",
        },
        infoTitle: {
          gridColumn: 2,
          gridRow: 1,
          fontWeight: weightSemibold,
        },
        infoText: {
          gridColumn: 2,
          gridRow: 2,
          fontWeight: weightNormal,
        },
      }),
    [textDark],
  );
};
