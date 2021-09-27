import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const EnrollInReturnsTip = (props: BaseProps) => {
  const styles = useStylesheet();

  return (
    <Tip color={palettes.coreColors.WishBlue} icon="tip">
      <div className={css(styles.bannerText)}>
        <div className={css(styles.tipText)}>
          <strong>Enroll in the Wish Returns Program</strong>
          <br />
          <span>
            Customers have to ship products back to your warehouse before
            receiving a refund.
          </span>
          <Link
            className={css(styles.link)}
            href={zendeskURL("360050732014")}
            openInNewTab
          >
            Learn more
          </Link>
        </div>
      </div>
    </Tip>
  );
};

export default EnrollInReturnsTip;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 4,
        },
        bannerText: {
          alignItems: "flex-start",
          color: palettes.textColors.Ink,
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
          fontFamily: fonts.proxima,
        },
        tipText: {
          fontWeight: fonts.weightMedium,
        },
      }),
    []
  );
