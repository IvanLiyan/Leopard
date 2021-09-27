import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import yellowAlert from "@assets/img/yellow-exclamation.svg";
import chromeLogo from "@assets/img/chrome-logo.svg";
import firefoxLogo from "@assets/img/firefox-logo.svg";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type IeDeprecationBannerProps = BaseProps & {
  readonly fullyDeprecated: boolean;
};

const IeDeprecationBanner = (props: IeDeprecationBannerProps) => {
  const { fullyDeprecated, className, style } = props;
  const { countryCodeByIp } = AppStore.instance();

  const styles = useStylesheet();
  const chromeURL =
    countryCodeByIp === "CN"
      ? "https://www.google.cn/chrome/"
      : "https://www.google.com/chrome/";

  const bannerText = fullyDeprecated
    ? i`Internet Explorer is not supported. ` +
      i`To access your account please use one of the following browsers.`
    : i`Internet Explorer support will be ending on December 31st, 2019. ` +
      i`To access all features, please visit us from one of the following browsers.`;

  return (
    <div className={css(styles.root, className, style)} data-testid="test">
      <img className={css(styles.yellowAlert)} src={yellowAlert} />
      <div className={css(styles.content)}>
        <div className={css(styles.title)}>Please use a different browser.</div>
        <div className={css(styles.infoBody)}>{bannerText}</div>
        <div className={css(styles.buttonsRow)}>
          <Link href={chromeURL} openInNewTab>
            <div className={css(styles.browserButton)}>
              <img className={css(styles.icon)} src={chromeLogo} />
              <div>Chrome</div>
            </div>
          </Link>
          <Link href="https://www.mozilla.org/firefox/" openInNewTab>
            <div className={css(styles.browserButton)}>
              <img className={css(styles.icon)} src={firefoxLogo} />
              <div>Firefox</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default observer(IeDeprecationBanner);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderTop: `solid 4px ${palettes.yellows.DarkYellow}`,
          backgroundColor: "#fffae6",
          padding: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        },
        content: {
          marginLeft: 15,
          display: "flex",
          flexDirection: "column",
        },
        yellowAlert: {
          minHeight: 30,
          minWidth: 30,
        },
        icon: {
          width: 35,
          height: 35,
          marginRight: 5,
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.DarkInk,
        },
        infoBody: {
          color: "#6c798f",
          margin: "6px 0px",
        },
        browserButton: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginRight: 15,
        },
        buttonsRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    []
  );
};
