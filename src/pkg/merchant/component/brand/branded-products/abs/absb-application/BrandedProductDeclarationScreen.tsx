import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H5 } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import BrandedProductsContract from "./BrandedProductsContract";
import Footer from "./Footer";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";

type BrandedProductsDeclarationScreenProps = BaseProps & {
  readonly currentApplication: ABSBApplicationState;
};

const BrandedProductsDeclarationScreen = ({
  style,
  currentApplication,
}: BrandedProductsDeclarationScreenProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>Branded Product Declaration</H5>
      <BrandedProductsContract style={css(styles.contract)} />
      <CheckboxField
        title={
          i`I accept and agree to be bound by the terms above. In addition, ` +
          i`I agree, under the penalty of perjury, that the information I have ` +
          i`provided is correct.`
        }
        wrapTitle
        onChange={() => {
          currentApplication.acceptedContract = !currentApplication.acceptedContract;
        }}
        checked={currentApplication.acceptedContract}
        className={css(styles.checkbox)}
      />
      <Footer
        isSubmit
        continueDisabled={
          !(
            currentApplication.brandNameStepComplete &&
            currentApplication.authorizationTypeStepComplete &&
            currentApplication.trademarkRegistrationsStepComplete &&
            currentApplication.acceptedContract
          ) || currentApplication.isSubmitting
        }
        cancelDisabled={currentApplication.isSubmitting}
        onContinue={() => currentApplication.submit()}
        isLoading={currentApplication.isSubmitting}
        currentApplication={currentApplication}
      />
    </div>
  );
};
export default observer(BrandedProductsDeclarationScreen);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        title: {
          marginTop: 24,
        },
        contract: {
          margin: 24,
          maxHeight: 420,
        },
        checkbox: {
          margin: "0px 24px 24px 24px",
        },
      }),
    []
  );
