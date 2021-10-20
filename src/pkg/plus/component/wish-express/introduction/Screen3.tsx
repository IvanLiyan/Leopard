import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H5, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { useTheme } from "@stores/ThemeStore";

import Row from "./Row";

type Props = BaseProps;

const Screen3: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <H5 className={css(styles.header)}>Enroll your products</H5>
      <Markdown
        text={i`Enroll your products in Wish Express by following these steps:`}
      />
      <Row
        className={css(styles.row)}
        icon={<div className={css(styles.index)}>1</div>}
        title={i`Shipping settings`}
      >
        Make sure at least one Wish Express country is enabled in your shipping
        settings.
      </Row>
      <Row
        className={css(styles.row)}
        icon={<div className={css(styles.index)}>2</div>}
        title={i`Enable Wish Express for your product`}
      >
        When adding or editing a product, check Wish Express box under the
        shipping section to activate Wish Express for all enabled shipping
        destinations. You can further customize Wish Express enrollment for
        certain countries.
      </Row>
      <Row
        className={css(styles.row)}
        icon={<div className={css(styles.index)}>3</div>}
        title={i`Quickly fulfill Wish Express orders`}
      >
        All Wish Express orders will be tagged with an orange truck badge. Be
        sure to fulfill them before the deadline so they are not marked as late
        arrivals and refunded.
      </Row>
      <Markdown
        className={css(styles.row)}
        text={i`Need help or want to learn more? [Visit our FAQ](${zendeskURL(
          "360051750674",
        )})`}
      />
    </div>
  );
};

export default observer(Screen3);

const useStylesheet = () => {
  const { textLight, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
          lineHeight: 1.5,
        },
        header: {
          marginBottom: 12,
        },
        row: {
          marginTop: 24,
        },
        index: {
          color: textLight,
          lineHeight: 0.8,
          fontSize: 16,
          fontWeight: weightBold,
        },
      }),
    [textLight, textBlack],
  );
};
