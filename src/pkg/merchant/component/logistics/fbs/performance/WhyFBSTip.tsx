/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, weightSemibold } from "@toolkit/fonts";
import { downloadWhite } from "@assets/icons";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbs";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useLocalizationStore } from "@stores/LocalizationStore";

type WhyFBSTipProps = BaseProps;

const cnCaseStudyUrl =
  "https://sweeper-production-merchant-fbw.s3-us-west-1.amazonaws.com/fbs_case_study_cn.pdf";
const enCaseStudyUrl =
  "https://sweeper-production-merchant-fbw.s3-us-west-1.amazonaws.com/fbs_case_study_en.pdf";

const WhyFBSTip = (props: WhyFBSTipProps) => {
  const { locale } = useLocalizationStore();
  const { className, style } = props;
  const styles = useStyleSheet();

  const pageActionLogger = useLogger("FBS_PERFORMANCE_PAGE_ACTION");

  const downloadCaseStudy = () => {
    pageActionLogger.info({
      action: LogActions.CLICK_DOWNLOAD_CASE_STUDY,
      detail: locale,
    });
    if (locale === "zh") {
      window.open(cnCaseStudyUrl);
    } else {
      window.open(enCaseStudyUrl);
    }
  };

  return (
    <div className={css(styles.root, className, style)}>
      <Illustration
        className={css(styles.icon)}
        name="whyFBS"
        alt={"why-fbs-icon"}
      />
      <div className={css(styles.content)}>
        <div className={css(styles.textContainer)}>
          <Markdown
            text={i`Why should I use Fulfillment By Store (FBS)?`}
            className={css(styles.title)}
          />
          <Markdown
            text={i`Closer to customers • Exposure in Wish app • Reach more customers offline`}
            className={css(styles.text)}
          />
        </div>
        <PrimaryButton
          className={css(styles.button)}
          style={{ padding: "8px 0px" }}
          onClick={downloadCaseStudy}
        >
          <div className={css(styles.buttonContent)}>
            <img
              src={downloadWhite}
              className={css(styles.downloadIcon)}
              draggable="false"
              alt={i`Download icon`}
            />
            <Markdown
              text={i`Download case study`}
              className={css(styles.buttonText)}
            />
          </div>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(WhyFBSTip);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignItems: "center",
          backgroundColor: palettes.coreColors.DarkerWishBlue,
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          padding: 0,
        },
        content: {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        },
        textContainer: {
          display: "flex",
          flex: 1,
          flexDirection: "column",
          marginRight: 20,
          margin: "19px 8px",
          transform: "translateZ(0)",
        },
        icon: {
          width: 60,
          height: "100%",
          alignSelf: "flex-start",
        },
        title: {
          color: palettes.textColors.White,
          fontSize: 20,
          fontWeight: weightBold,
          lineHeight: 1.4,
          marginBottom: 6,
        },
        text: {
          color: palettes.coreColors.WishBlue,
          fontSize: 16,
          fontWeight: weightSemibold,
          lineHeight: 1.5,
        },
        button: {
          minWidth: 208,
          margin: "28px 24px",
        },
        buttonContent: {
          display: "flex",
          flexDirection: "row",
        },
        downloadIcon: {
          height: 16,
          width: 16,
        },
        buttonText: {
          marginLeft: 8,
        },
      }),
    [],
  );
};
