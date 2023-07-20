/*
 * Price.tsx
 *
 * Created by Jonah Dlin on Thu Oct 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Field, Markdown, CurrencyInput, Layout } from "@ContextLogic/lego";
import {
  MinMaxValueValidator,
  RequiredValidator,
} from "@core/toolkit/validators";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";

import Section, { SectionProps } from "./Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { merchFeUrl } from "@core/toolkit/router";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly state: AddEditProductState;
  readonly showTip: boolean;
};

const Price: React.FC<Props> = ({
  style,
  className,
  state,
  showTip,
  ...sectionProps
}: Props) => {
  const styles = useStylesheet();
  const {
    forceValidation,
    primaryCurrency,
    isSubmitting,
    variations,
    showRevampedAddEditProductUI,
  } = state;

  const price = useMemo(() => {
    const variation = variations[0];
    return variation == null ? undefined : variation.price;
  }, [variations]);

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  return (
    <Section
      className={css(style, className)}
      title={
        showRevampedAddEditProductUI
          ? ci18n(
              "Section header, the asterisk symbol means field is required",
              "Price*",
            )
          : i`Price`
      }
      rightCard={
        showTip ? (
          <Section title={i`What should I know?`} isTip>
            <Markdown
              text={
                i`There are **no listing fees**. However, to keep our ` +
                i`platform running, Wish collects a revenue share ` +
                i`from your sales. [Learn more](${zendeskURL("204531558")})`
              }
              openLinksInNewTab
            />
          </Section>
        ) : undefined
      }
      {...sectionProps}
    >
      <Field
        title={i`Price`}
        style={styles.field}
        description={
          i`The local currency price of your product. The customer will pay this amount ` +
          i`for the product after the prices have been converted to your currency. The ` +
          i`local currency price is based off the local currency code that can be found ` +
          i`under [Currency Settings](${merchFeUrl(
            "/settings#currency-settings",
          )}). [Learn ` +
          i`more](${attributesLearnMoreLink})`
        }
      >
        <Layout.FlexRow style={styles.content} alignItems="stretch">
          <CurrencyInput
            value={price}
            placeholder="0.00"
            className={css(styles.input)}
            currencyCode={primaryCurrency}
            hideCheckmarkWhenValid
            onChange={({ textAsNumber }) =>
              state.setSingleVariationPrice(textAsNumber)
            }
            debugValue={(Math.random() * 10).toFixed(2).toString()}
            forceValidation={forceValidation}
            validators={[
              new RequiredValidator(),
              new MinMaxValueValidator({
                minAllowedValue: 0,
                customMessage: i`Value cannot be negative`,
                allowBlank: true,
              }),
            ]}
            disabled={isSubmitting}
            data-cy="input-price"
          />
        </Layout.FlexRow>
      </Field>
    </Section>
  );
};

export default observer(Price);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          width: "100%",
        },
        field: {
          alignSelf: "stretch",
          margin: "5px 0px",
        },
        input: {
          flex: 1,
        },
      }),
    [],
  );
