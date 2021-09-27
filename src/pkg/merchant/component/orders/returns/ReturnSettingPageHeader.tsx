import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const ReturnSettingPageHeader = (props: BaseProps) => {
  const styles = useStylesheet();

  return (
    <WelcomeHeader
      title={i`Wish Returns Program`}
      body={() => (
        <div className={css(styles.text)}>
          <span>
            Once this product is enrolled in the Wish Returns program, customers
            based in regions supported by the program will have to return the
            products to the specified address before receiving refunds.
          </span>
          <Link
            className={css(styles.link)}
            href={zendeskURL("360050732014")}
            openInNewTab
          >
            Learn more
          </Link>
        </div>
      )}
      illustration="returnsTruck"
    />
  );
};

export default ReturnSettingPageHeader;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 4,
        },
        text: {
          marginTop: 15,
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontFamily: fonts.proxima,
        },
      }),
    []
  );
