/*
 * AdvancedLogisticsProgramContent.tsx
 *
 * Created by Thomas Kim on 9/23/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

/* External Libraries */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { ApolloProvider } from "@apollo/client";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Lego Components */
import { H4Markdown, Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";

/* Merchant Component */
import CountryFlagsGroup from "@merchant/component/products/product-shipping/CountryFlagsGroup";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import ApolloStore from "@stores/ApolloStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { zendeskURL } from "@toolkit/url";

type Props = BaseProps & {
  readonly switchModal: () => unknown;
  readonly closeModal: () => unknown;
  readonly modalCase: number;
};

const AdvancedLogisticsProgramContent: React.FC<Props> = (props: Props) => {
  const { className, style, switchModal, closeModal, modalCase } = props;

  const styles = useStylesheet();

  const title = i`Important update regarding Wish's Shipping Unification Initiative`;

  const { client } = ApolloStore.instance();

  const unityContent1 = (
    <PageGuide>
      <div className={css(styles.content, className, style)}>
        <H4Markdown text={title} style={styles.title} />
        <Illustration
          className={css(styles.illustration)}
          name="merchantPlusMarkOrdersShippedTask"
          alt={i`Advanced Logistics shipping task`}
        />
        <p>
          We have an important update to share with you regarding Wish’s
          shipping unification initiative!
        </p>
        <Markdown
          text={
            i`To help merchants streamline their shipping process, ` +
            i`Wish has launched a shipping unification initiative that ` +
            i`covers a growing list of destination countries, ` +
            i`starting with the following select countries supported ` +
            i`by the Advanced Logistics Program. ` +
            i`When you enable shipping to one of the countries below for a product, ` +
            i`as a part of the unification initiative, ` +
            i`all of the following countries will be automatically enabled as well. ` +
            i`For example, if you have already enabled shipping to the United States, ` +
            i`you will begin receiving orders from all other countries listed below. ` +
            i`[Learn more](${zendeskURL("360054912394")}).`
          }
          className={css(styles.paragraph)}
          openLinksInNewTab
        />
        <p>
          <strong>
            Destination countries included in Wish’s shipping unification
            initiative
          </strong>
        </p>
        <ApolloProvider client={client}>
          <CountryFlagsGroup />
        </ApolloProvider>
        <div className={css(styles.buttonContainer)}>
          <div className={css(styles.buttonMargin)}>
            <PrimaryButton
              onClick={() => {
                switchModal();
              }}
              popoverStyle={css(styles.button)}
            >
              Next
            </PrimaryButton>
          </div>
          <div className={css(styles.buttonMargin)}>
            <PrimaryButton
              onClick={() => {
                closeModal();
              }}
              popoverStyle={css(styles.button)}
            >
              Sounds good!
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageGuide>
  );

  const unityContent2 = (
    <PageGuide>
      <div className={css(styles.content, className, style)}>
        <H4Markdown text={title} style={styles.title} />
        <Illustration
          className={css(styles.illustration)}
          name="merchantPlusMarkOrdersShippedTask"
          alt={i`Advanced Logistics shipping task`}
        />
        <Markdown
          text={
            i`When you begin to receive orders from these countries, ` +
            i`as another part of the unification effort, ` +
            i`the payments you receive for shipping will be structured differently. ` +
            i`Specifically, to ship to the countries included in the unification initiative, ` +
            i`you need to first provide the per-country shipping prices for your products. ` +
            i`After Wish analyzes the first group of orders received, ` +
            i`your initially-set shipping prices will be transitioned to a unified, ` +
            i`Wish-calculated First-Mile Shipping Price. `
          }
          className={css(styles.paragraph)}
        />
        <Markdown
          text={
            i`After order fulfillment, you will receive payment for shipping based on ` +
            i`the First-Mile Shipping Price (excluding revenue share) and reimbursement for ` +
            i`WishPost Shipping, which is the amount you paid to WishPost ` +
            i`for shipping the order. `
          }
          className={css(styles.paragraph)}
        />
        <Markdown
          text={
            i`Note that even with the new payment structure described above, ` +
            i`the final amount you receive for shipping will be approximately the same ` +
            i`as the amount you would have received given your initially-set shipping price. ` +
            i`[Learn more](${zendeskURL("360054912394")}).`
          }
          className={css(styles.paragraph)}
          openLinksInNewTab
        />
        <p>
          <strong>
            Destination countries included in Wish’s shipping unification
            initiative
          </strong>
        </p>
        <ApolloProvider client={client}>
          <CountryFlagsGroup />
        </ApolloProvider>
        <div className={css(styles.buttonContainer)}>
          <div className={css(styles.buttonMargin)}>
            <PrimaryButton
              onClick={() => {
                switchModal();
              }}
              popoverStyle={css(styles.button)}
            >
              Previous
            </PrimaryButton>
          </div>
          <div className={css(styles.buttonMargin)}>
            <PrimaryButton
              onClick={() => {
                closeModal();
              }}
              popoverStyle={css(styles.button)}
            >
              Sounds good!
            </PrimaryButton>
          </div>
        </div>
        <div className={css(styles.buttonContainer)}></div>
      </div>
    </PageGuide>
  );

  return modalCase == 2 ? unityContent2 : unityContent1;
};

export default AdvancedLogisticsProgramContent;

const useStylesheet = () => {
  const { borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          fontWeight: fonts.weightNormal,
          lineHeight: 1.43,
          fontSize: 15,
          paddingTop: 40,
        },
        title: {
          textAlign: "center",
        },
        illustration: {
          marginBottom: 10,
          height: 200,
        },
        paragraph: {
          marginBottom: 10,
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        button: {
          minWidth: 160,
        },
        buttonMargin: {
          display: "flex",
          flexDirection: "row",
          marginRight: 30,
        },
      }),
    [borderPrimaryDark],
  );
};
