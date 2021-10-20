/*
 *
 * SingleVariationPricing.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Field, Markdown, CurrencyInput } from "@ContextLogic/lego";
import { RequiredValidator } from "@toolkit/validators";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { useIsSmallScreen } from "@stores/DeviceStore";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly editState: ProductEditState;
  readonly showTip: boolean;
};

const SingleVariationPricing: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, showTip, ...sectionProps } = props;

  const { forceValidation, primaryCurrency, isSubmitting } = editState;
  const isSmallScreen = useIsSmallScreen();
  const variation = editState.variationsList[0];

  const currentAmount = variation.price;

  return (
    <Section
      className={css(style, className)}
      title={i`Pricing`}
      rightCard={
        showTip ? (
          <Section title={i`What should I know?`} isTip>
            <Markdown
              text={
                i`There are **no listing fees**. However, to keep our ` +
                i`platform running, Wish collects a revenue share ` +
                i`from your sales. [Learn more](${zendeskURL("204531558")})`
              }
            />
          </Section>
        ) : undefined
      }
      {...sectionProps}
    >
      <div className={css(styles.sideBySide)}>
        <Field title={i`Price`} className={css(styles.field)}>
          <div className={css(styles.content)}>
            <CurrencyInput
              value={currentAmount?.toString()}
              placeholder="0.00"
              className={css(styles.input)}
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) => variation.setPrice(textAsNumber)}
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              forceValidation={forceValidation}
              validators={[new RequiredValidator()]}
              disabled={isSubmitting}
            />
          </div>
        </Field>
        <Field
          title={i`Reference Price (optional)`}
          description={
            i`Please refer to our ` +
            i`[Product Reference Price Policy](${"/policy/listing#2.13"}) ` +
            i`when you enter a Reference Price. [Learn more](${zendeskURL(
              "360016868094",
            )})`
          }
          className={css(styles.field)}
          style={{ marginLeft: isSmallScreen ? 0 : 15 }}
        >
          <div className={css(styles.content)}>
            <CurrencyInput
              value={editState.msrp?.toString() || ""}
              placeholder="0.00"
              className={css(styles.input)}
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) => editState.setMsrp(textAsNumber)}
              debugValue={(Math.random() * 100).toFixed(2).toString()}
              disabled={isSubmitting}
            />
          </div>
        </Field>
      </div>
    </Section>
  );
};

export default observer(SingleVariationPricing);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
        },
        field: {
          alignSelf: "stretch",
          margin: "5px 0px",
        },
        input: {
          flex: 1,
        },
        sideBySide: {
          display: "flex",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
            },
          },
        },
      }),
    [],
  );
