/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { WelcomeHeaderProps } from "@merchant/component/core";

type FBSHeaderProps = WelcomeHeaderProps;

const FBSHeader = (props: FBSHeaderProps) => {
  const styles = useStyleSheet();

  return (
    <WelcomeHeader
      {...props}
      title={() => (
        <Markdown text={i`FBS Overview`} className={css(styles.bannerTitle)} />
      )}
      body={() => (
        <Markdown
          text={
            i`You can restock and view your best-selling products as ` +
            i`well as view high-potential products that you can choose to ` +
            i`stock for the FBS program. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[Learn more](${zendeskURL(
              "360037188713-Fulfillment-By-Store-FBS-FAQ",
            )})`
          }
          className={css(styles.bannerText)}
          openLinksInNewTab
        />
      )}
    />
  );
};

export default observer(FBSHeader);

const useStyleSheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        bannerTitle: {
          paddingTop: 46,
          fontSize: 24,
          fontWeight: weightBold,
          lineHeight: 1.33,
          color: textBlack,
        },
        bannerText: {
          marginTop: 16,
          marginBottom: 46,
          fontSize: 16,
          color: textDark,
        },
      }),
    [textBlack, textDark],
  );
};
