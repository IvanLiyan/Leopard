import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2, Text, Card } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useTheme } from "@stores/ThemeStore";

export const VIDEOS: { [key: string]: string } = {
  // English
  "en-dan": `643209530`,
  "en-emma": `643211154`,
  "en-farhang": `643212653`,
  "en-sarah": `643212918`,
  "en-tarun": `643213059`,
  "en-vivian": `643213232`,

  // Spanish
  "es-dan": `643248885`,
  "es-emma": `643248969`,
  "es-farhang": `643249005`,
  "es-sarah": `643249088`,
  "es-tarun": `643249165`,
  "es-vivian": `643249236`,

  // French
  "fr-dan": `643252236`,
  "fr-emma": `643252288`,
  "fr-farhang": `643252326`,
  "fr-sarah": `643252380`,
  "fr-tarun": `643252452`,
  "fr-vivian": `643252553`,

  // German
  "de-dan": `643250430`,
  "de-emma": `643250532`,
  "de-farhang": `643250568`,
  "de-sarah": `643250629`,
  "de-tarun": `643250706`,
  "de-vivian": `643250809`,

  // Chinese
  "zh-dan": ``,
  "zh-emma": ``,
  "zh-farhang": ``,
  "zh-sarah": ``,
  "zh-tarun": ``,
  "zh-vivian": `643279775`,

  // Japanese
  "ja-dan": `643252628`,
  "ja-emma": `643252697`,
  "ja-farhang": `643252728`,
  "ja-sarah": `643252807`,
  "ja-tarun": `643252845`,
  "ja-vivian": `643252910`,

  // Korean
  "ko-dan": `643251797`,
  "ko-emma": `643251863`,
  "ko-farhang": `643251903`,
  "ko-sarah": `643251962`,
  "ko-tarun": `643252016`,
  "ko-vivian": `643252109`,
};

const CONTENT: ReadonlyArray<{
  url: IllustrationName;
  localizationName: string;
  name: string;
  title: string;
  line1: string;
  line2?: string;
}> = [
  {
    url: "pictureFarhang",
    localizationName: `farhang`,
    name: `Farhang Kassaei`,
    title: i`Chief Technology Officer`,
    line1: i`Wish Annual Strategy:`,
    line2: i`Future together, fun together! `,
  },
  {
    url: "pictureTarun",
    localizationName: `tarun`,
    name: `Tarun Jain`,
    title: i`Chief Product Officer`,
    line1: i`Reshaping Wish’s global focus:`,
    line2: i`the platform experience`,
  },
  {
    url: "pictureSarah",
    localizationName: `sarah`,
    name: `Sarah Luo`,
    title: i`Director of Business Development`,
    line1: i`Upcoming merchant changes in 2022`,
  },
  {
    url: "pictureDan",
    localizationName: `dan`,
    name: `Dan Yu`,
    title: i`Manager, Product Management`,
    line1: i`Analysis of Wish’s key project map`,
  },
  {
    url: "pictureEmma",
    localizationName: `emma`,
    name: `Emma Chan`,
    title: i`Global Logistics Director`,
    line1: i`Overview of Wish’s global logistics project`,
  },
  {
    url: "pictureVivian",
    localizationName: `vivian`,
    name: `Vivian Liu`,
    title: i`Chief Financial Officer`,
    line1: i`Wish’s global financial operations`,
  },
];

type SpeakersProps = BaseProps & {
  readonly scrollToVideo: () => void | null;
  readonly setCurrentVideoUrl: (currentVideoUrl: string) => void;
};

const Speakers = (props: SpeakersProps) => {
  const { scrollToVideo, setCurrentVideoUrl } = props;
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();
  const { locale } = useLocalizationStore();

  const content = CONTENT.map(
    ({ localizationName, name, title, url, line1, line2 }) => (
      <Card
        key={localizationName}
        style={[
          styles.section,
          isSmallScreen ? styles.boxShadowSmall : styles.boxShadow,
        ]}
        onClick={() => {
          const url =
            VIDEOS[`${locale}-${localizationName}`] ||
            VIDEOS[`en-${localizationName}`];
          setCurrentVideoUrl(url);
          scrollToVideo();
        }}
      >
        <Illustration style={styles.photo} name={url} alt={i`Speaker`} />
        <Layout.FlexColumn style={styles.textBox}>
          <Text style={styles.name} weight="bold">
            {name}
          </Text>
          <Text style={styles.position} weight="semibold">
            {title}
          </Text>
          <Text style={styles.text}>{line1}</Text>
          <Text style={styles.text}>{line2}</Text>
        </Layout.FlexColumn>
      </Card>
    )
  );

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Meet the summit speakers
      </H2>
      <Layout.FlexRow
        style={styles.sectionContainer}
        justifyContent="center"
        alignItems="flex-start"
      >
        {content}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(Speakers);

const useStylesheet = () => {
  const { borderPrimary, textDark, surfaceLighter } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          backgroundColor: surfaceLighter,
        },
        rootMobile: {
          padding: "80px 0px",
          backgroundColor: surfaceLighter,
        },
        titleMobile: {
          fontSize: 28,
          margin: "0px 16px 20px",
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          marginBottom: 60,
          textAlign: "center",
        },
        sectionContainer: {
          width: "100%",
          flexWrap: "wrap",
          maxWidth: "100vw",
        },
        section: {
          border: "none",
          margin: 15,
          minHeight: 500,
          maxWidth: 312,
          ":hover": {
            cursor: "pointer",
          },
        },
        photo: {
          height: 318,
          maxWidth: 312,
        },
        boxShadow: {
          filter: `drop-shadow(10px 10px 10px ${borderPrimary})`,
        },
        boxShadowSmall: {
          filter: `drop-shadow(3px 3px 10px ${borderPrimary})`,
        },
        textBox: {
          padding: "20px 24px 34px",
        },
        name: {
          fontSize: 20,
        },
        position: {
          fontSize: 14,
          marginBottom: 15,
          color: textDark,
        },
        text: {
          fontSize: 14,
        },
      }),
    [borderPrimary, textDark, surfaceLighter]
  );
};
