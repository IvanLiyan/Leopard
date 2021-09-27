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

import { useTheme } from "@merchant/stores/ThemeStore";

import Row from "./Row";
import Tip from "./Tip";

type Props = BaseProps;

const Screen2: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <H5 className={css(styles.header)}>Destinations and qualifications</H5>
      <Markdown
        className={css(styles.header)}
        text={
          i`Customers can purchase Wish Express products in many top selling ` +
          i`countries, including United States, United Kingdom, Germany, ` +
          i`France, and many more. [View all countries](${zendeskURL(
            "360051750674",
          )})`
        }
      />
      <Markdown
        text={i`The following qualifications are required for Wish Express delivery:`}
      />
      <Row
        className={css(styles.row)}
        icon={<div className={css(styles.index)}>1</div>}
        title={i`Confirm delivery within 5 days`}
      >
        <Markdown
          text={
            i`Orders must be confirmed delivered before the required deadline, ` +
            i`with exceptions for certain regions. [View exceptions](${zendeskURL(
              "360051750674",
            )})`
          }
        />
      </Row>
      <Row
        className={css(styles.row)}
        icon={<div className={css(styles.index)}>2</div>}
        title={i`Valid tracking information`}
      >
        Orders must be fulfilled with valid tracking numbers.
      </Row>
      <Tip className={css(styles.row)} illustration="palaceBlueBulb">
        You may enable Wish Express on a per product, per destination basis.
      </Tip>
    </div>
  );
};

export default observer(Screen2);

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
