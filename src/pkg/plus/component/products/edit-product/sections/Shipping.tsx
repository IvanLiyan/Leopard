/*
 *
 * Shipping.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { useTheme } from "@stores/ThemeStore";

import {
  Field,
  Markdown,
  Accordion,
  CheckboxField,
  CurrencyInput,
  StaggeredFadeIn,
} from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { RequiredValidator } from "@toolkit/validators";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import CountryShipping from "./country-shipping/CountryShipping";
import WhatShouldIKnowWishExpressSection from "./WhatShouldIKnowWishExpressSection";

import ProductEditState from "@plus/model/ProductEditState";

import { useLogger } from "@toolkit/logger";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
  readonly showTip: boolean;
};

const Shipping: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, showTip, ...sectionProps } = props;
  const actionLogger = useLogger("PLUS_WISH_EXPRESS_UI");

  const {
    standardWarehouseId,
    primaryCurrency,
    forceValidation,
    canManageShipping,
  } = editState;
  const defaultStandardShippingPrice =
    editState.getDefaultShippingPrice(standardWarehouseId);
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
      rightCard={
        showTip ? (
          <Section title={i`What should I know?`} isTip>
            <Markdown
              text={
                i`Grow your business by selling and shipping internationally. ` +
                i`Enable more countries or regions in your ` +
                i`[Shipping Settings](${"/plus/settings/shipping"}).`
              }
            />
          </Section>
        ) : undefined
      }
      {...sectionProps}
    >
      <div className={css(styles.form)}>
        <div className={css(styles.body)}>
          Enter a default shipping price for your product.
        </div>

        <Field
          title={i`Default product shipping price`}
          className={css(styles.field)}
        >
          <CurrencyInput
            value={defaultStandardShippingPrice?.toString()}
            placeholder="0.00"
            className={css(styles.input)}
            currencyCode={primaryCurrency}
            hideCheckmarkWhenValid
            onChange={({ textAsNumber }) =>
              editState.setDefaultShippingPrice(
                textAsNumber ?? NaN,
                standardWarehouseId,
              )
            }
            debugValue={(Math.random() * 10).toFixed(2).toString()}
            forceValidation={forceValidation}
            validators={[new RequiredValidator()]}
            disabled={editState.isSubmitting}
          />
        </Field>
      </div>
      <div style={{ position: "relative" }}>
        <div className={css(styles.form, styles.weForm)}>
          <Markdown
            className={css(styles.body)}
            text={
              i`Check to enroll this product in Wish Express. You can ` +
              i`customize enrollment for relevant countries below. ` +
              i`[View FAQ](${zendeskURL("360051750674")})`
            }
          />
          <CheckboxField
            title={() => (
              <div className={css(styles.weRow)}>
                <Illustration
                  name="wishExpressWithoutText"
                  alt={i`wish express`}
                  style={{ width: 24, height: 24, marginRight: 6 }}
                />
                <>Wish Express</>
              </div>
            )}
            onChange={(checked) => {
              actionLogger.info({
                action: "CLICK_WISH_EXPRESS_MASTER_CHECKBOX",
                enabled: checked,
                product_id: editState.isNewProduct
                  ? null
                  : editState.initialState.id,
              });
              editState.setWishExpressEnabled(checked);
            }}
            checked={editState.wishExpressEnabled}
          />
        </div>
        {isOpen && (
          <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
            <WhatShouldIKnowWishExpressSection
              className={css(styles.rightCard)}
            />
          </StaggeredFadeIn>
        )}
      </div>
      <Accordion
        header={i`Customize shipping for chosen countries/regions`}
        chevronLocation="left"
        headerContainerStyle={{
          backgroundColor: surfaceLightest,
        }}
        isOpen={countryShippingExpanded}
        onOpenToggled={(isOpen) => {
          setCountryShippingExpanded(isOpen);
        }}
      >
        <CountryShipping editState={editState} />
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
        field: {
          marginTop: 10,
          alignSelf: "flex-start",
        },
        input: {
          alignSelf: "flex-start",
        },
        body: {
          color: textDark,
          marginBottom: 16,
        },
        form: {
          padding: 15,
        },
        weForm: {
          borderTop: `1px solid ${borderPrimary}`,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        weRow: {
          display: "flex",
          alignItems: "center",
        },
        rightCard: {
          position: "absolute",
          top: 0,
          left: "100%",
          "@media (max-width: 900px)": {
            display: "none",
          },
          "@media (min-width: 900px)": {
            width: "calc((300% / 7) - 37px)",
            marginLeft: 35,
          },
        },
      }),
    [textDark, borderPrimary],
  );
};
