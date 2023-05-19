import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card, H6, Link } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";
import { useTheme } from "@core/stores/ThemeStore";
import { merchFeUrl } from "@core/toolkit/router";

export type UsefulLinksCardProps = BaseProps;

const UsefulLinksCard = ({ className }: UsefulLinksCardProps) => {
  const styles = useStylesheet();

  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <H6 className={css(styles.title)}>Useful links</H6>
      <Link
        href={merchFeUrl("/documentation/v2/qualifiedcarriers")}
        openInNewTab
      >
        Accepted Shipping Providers
      </Link>
      <Link href={zendeskURL("205211777")} openInNewTab>
        Prohibited product listing
      </Link>
      <Link href={merchFeUrl("/documentation/colors")} openInNewTab>
        Accepted Colors
      </Link>
    </Card>
  );
};
export default observer(UsefulLinksCard);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 24,
          ":nth-child(1n) > *": {
            ":not(:first-child)": {
              marginTop: 12,
            },
          },
        },
        title: {
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
