/*
 *
 * HowToAddProductsCard.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/26/2020, 9:35:00 AM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4, Card, Markdown } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const HowToAddProductsCard: React.FC<BaseProps> = (props: BaseProps) => {
  const { className, style } = props;
  const styles = useStylesheet(props);

  return (
    <Card className={css(className, style)}>
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <H4 className={css(styles.title)}>How to add products</H4>
          <Markdown
            className={css(styles.body)}
            text={
              i`View our guide on how to add products and optimize your ` +
              i`listings. It may take up to **${1} business day** for your ` +
              i`first product to become available for sale. Remember, there ` +
              i`are **no fees** when listing products. Wish will collect ` +
              i`a revenue share after making each sale. ` +
              i`[Learn more](${zendeskURL("204531558")})`
            }
          />
          <Button style={styles.cta} href={zendeskURL("360051494293")}>
            Learn more
          </Button>
        </div>
        <Illustration
          name="productCatalog"
          alt="product catalog"
          className={css(styles.illustration)}
        />
      </div>
    </Card>
  );
};

export default observer(HowToAddProductsCard);

const useStylesheet = (props: BaseProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 15,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          "@media (min-width: 900px)": {
            maxWidth: "60%",
          },
        },
        title: {
          fontSize: 20,
        },
        body: {
          marginTop: 15,
          fontSize: 17,
          lineHeight: 1.5,
        },
        cta: {
          marginTop: 20,
          padding: "7px 35px",
          alignSelf: "flex-start",
        },
        illustration: {
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
      }),
    []
  );
};
