import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H5, Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";

import Row from "./Row";

type Props = BaseProps;

const Screen1: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <H5 className={css(styles.header)}>Benefits</H5>
      <Markdown
        text={
          i`Wish is dedicated to improving our customers’ experiences by ` +
          i`providing faster deliveries. If you can deliver orders to ` +
          i`customers within **5 days**, with exceptions, you can enroll your ` +
          i`products in the Wish Express program, and receive these benefits:`
        }
      />
      <Row
        className={css(styles.row)}
        icon={
          <Illustration
            name="checkedEye"
            alt={i`Get more impressions`}
            style={{ width: 32 }}
          />
        }
        title={i`Up to ${10}x exposure`}
      >
        Reach more customers through exclusive Wish Express promotions and
        preferred product placement throughout our app and website.
      </Row>
      <Row
        className={css(styles.row)}
        icon={
          <Icon
            name="wishExpressTruck2"
            alt={i`wish express truck`}
            style={{ width: 21 }}
          />
        }
        title={i`Distinctive badge and dedicated tabs`}
      >
        Wish Express products are awarded a distinctive badge and placed
        additionally in the exclusive Wish Express tab on our app and website.
      </Row>
      <Row
        className={css(styles.row)}
        icon={
          <Illustration
            name="paymentCard"
            alt={i`payment card`}
            style={{ width: 30 }}
          />
        }
        title={i`Faster payment`}
      >
        Using eligible carriers, you get paid as soon as carrier confirms
        delivery.
      </Row>
    </div>
  );
};

export default observer(Screen1);

const useStylesheet = () => {
  const { textBlack } = useTheme();

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
      }),
    [textBlack],
  );
};
