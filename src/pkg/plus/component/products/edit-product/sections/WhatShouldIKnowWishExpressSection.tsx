/*
 *
 * WhatShouldIKnowWishExpressSection.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Markdown } from "@ContextLogic/lego";

import { zendeskURL } from "@toolkit/url";
/* Lego Toolkit */
import { css } from "@toolkit/styling";

import Section from "@plus/component/products/edit-product/Section";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const WhatShouldIKnowWishExpressSection: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className } = props;

  return (
    <Section
      className={css(styles.root, style, className)}
      title={i`What should I know?`}
      isTip
    >
      <Markdown
        className={css(styles.title)}
        text={`**${i`More exposure with Wish Express`}**`}
      />
      <Markdown
        text={
          i`Wish Express is a program that offers express ` +
          i`shipping to customers. If your products can be ` +
          i`confirmed delivered within 5 days, with exceptions, ` +
          i`you can enroll them in the Wish Express program. ` +
          i`[View FAQ](${zendeskURL("360051750674")})`
        }
      />
    </Section>
  );
};

export default observer(WhatShouldIKnowWishExpressSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: 10,
        },
      }),
    []
  );
};
