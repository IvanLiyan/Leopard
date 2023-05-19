/*
 * Shipping.tsx
 *
 * Created by Jonah Dlin on Thu Oct 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  Field,
  Accordion,
  CurrencyInput,
  Layout,
  Markdown,
} from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";

import { css } from "@core/toolkit/styling";
import CountryShipping from "./shipping/CountryShipping";

import Section, { SectionProps } from "./Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { RequiredValidator } from "@core/toolkit/validators";
import { merchFeUrl } from "@core/toolkit/router";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
  readonly showTip: boolean;
};

const Shipping: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, className, state, showTip, ...sectionProps } = props;

  const {
    primaryCurrency,
    forceValidation,
    canManageShipping,
    defaultShippingPrice,
  } = state;

  const [countryShippingExpanded, setCountryShippingExpanded] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const { surfaceLightest } = useTheme();
  if (!canManageShipping) {
    return null;
  }
  return (
    <Section
      className={css(style, className)}
      style={{ overflow: "visible" }}
      title={i`Shipping`}
      contentStyle={{
        padding: 0,
      }}
      isOpen={isOpen}
      onOpenToggled={setIsOpen}
      {...sectionProps}
    >
      <Layout.FlexColumn style={styles.form}>
        <Markdown
          style={styles.body}
          text={
            i`Set your Default Shipping Price for your Primary warehouse to ship your ` +
            i`product to all destinations enabled for your merchant account. You may also ` +
            i`customize the value for each destination below. However, the Default Shipping ` +
            i`Price will apply to any new destination added to your shipping settings. [Edit ` +
            i`shipping settings](${merchFeUrl("/shipping-settings")})`
          }
          openLinksInNewTab
        />

        <Layout.GridRow templateColumns="1fr 1fr" gap={16}>
          <Field
            title={i`Default product shipping price`}
            style={styles.defaultShippingPriceField}
            description={
              i`The Default Shipping Price will be used for any new destination countries ` +
              i`added unless a Standard Shipping Price has been set.`
            }
          >
            <CurrencyInput
              value={defaultShippingPrice?.toString()}
              placeholder="0.00"
              className={css(styles.input)}
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) =>
                state.setDefaultShippingPrice(
                  textAsNumber == null ? null : Math.max(textAsNumber, 0),
                )
              }
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              forceValidation={forceValidation}
              validators={[new RequiredValidator()]}
              disabled={state.isSubmitting}
              data-cy="input-default-shipping-price"
            />
          </Field>
        </Layout.GridRow>
      </Layout.FlexColumn>
      <Accordion
        style={styles.accordion}
        header={i`Customize shipping for destinations`}
        headerContainerStyle={{
          backgroundColor: surfaceLightest,
        }}
        isOpen={countryShippingExpanded}
        onOpenToggled={(isOpen) => {
          setCountryShippingExpanded(isOpen);
        }}
      >
        <CountryShipping state={state} />
      </Accordion>
    </Section>
  );
};

export default observer(Shipping);

const useStylesheet = () => {
  const { textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        defaultShippingPriceField: {
          gridColumn: 1,
          marginTop: 10,
          alignSelf: "flex-start",
        },
        input: {
          alignSelf: "stretch",
        },
        body: {
          color: textDark,
          marginBottom: 24,
          fontSize: 14,
          lineHeight: "20px",
        },
        form: {
          padding: 24,
        },
        accordion: {
          borderTop: `1px solid ${borderPrimary}`,
        },
      }),
    [textDark, borderPrimary],
  );
};
