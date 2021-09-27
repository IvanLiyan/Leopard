import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Components */
import { Card, H6, Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type UsefulLinksCardProps = BaseProps;

const UsefulLinksCard = ({ className }: UsefulLinksCardProps) => {
  const styles = useStylesheet();

  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <H6 className={css(styles.title)}>Useful links</H6>
      <Link href="/documentation/shippingproviders" openInNewTab>
        Accepted Shipping Providers
      </Link>
      <Link href={zendeskURL("205211777")} openInNewTab>
        Prohibited product listing
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
    [textBlack]
  );
};
