import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H5 } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Merchant Components */
import BrandCard from "@merchant/component/brand/branded-products/BrandCard";
import NewTrueBrandRequestModal from "@merchant/component/brand/branded-products/NewTrueBrandRequestModal";
import BrandSearch from "@merchant/component/brand/branded-products/BrandSearch";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import Footer from "./Footer";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";

type BrandNameScreenProps = BaseProps & {
  readonly currentApplication: ABSBApplicationState;
};

const BrandNameScreen = ({
  style,
  currentApplication,
}: BrandNameScreenProps) => {
  const styles = useStylesheet();
  const requestNewBrandLink = `[${i`Suggest a brand`}]()`;
  const [brandNameInput, setBrandNameInput] = useState(
    currentApplication.brand?.displayName
  );

  const brandCard = currentApplication.brand && (
    <div className={css(styles.brandCardRow)}>
      <BrandCard
        brand_id={currentApplication.brand.id}
        brand_name={currentApplication.brand.displayName}
        logo_url={currentApplication.brand.logoUrl}
        style={css(styles.brandCard)}
      />
    </div>
  );

  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>Brand Name</H5>
      <Markdown
        style={css(styles.subtitle)}
        text={
          i`Enter the name of the brand you are applying to become an ` +
          i`Authentic Brand Seller of. If you cannot find the brand name ` +
          i`below, please request to add it before you apply to become an ` +
          i`Authentic Brand Seller.${"  \n"}${requestNewBrandLink}`
        }
        onLinkClicked={() => {
          new NewTrueBrandRequestModal({}).render();
        }}
      />

      <div className={css(styles.inputContainer)}>
        <BrandSearch
          text={brandNameInput}
          onTextChange={({ text }) => setBrandNameInput(text)}
          onBrandChanged={(item) => {
            currentApplication.setBrand(item);
          }}
          validateBrand={(isValid) => {
            currentApplication.brandValid = isValid;
          }}
          placeholder={i`Search by brand name (e.g. Adidas) or Brand ID`}
        />
      </div>

      <div className={css(styles.brandCardContainer)}>{brandCard}</div>
      <Illustration name="trueBrandDirectoryHeader" alt={""} />
      <Footer
        continueDisabled={!currentApplication.brandNameStepComplete}
        onContinue={() => {
          currentApplication.setCurrentStep("AUTHORIZATION_TYPE");
        }}
        currentApplication={currentApplication}
      />
    </div>
  );
};

export default observer(BrandNameScreen);

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
        subtitle: {
          marginTop: 8,
          marginBottom: 36,
          width: "calc(100% - 192px)",
          textAlign: "center",
        },
        inputContainer: {
          width: "calc(100% - 550px)",
        },
        brandCardContainer: {
          marginTop: 40,
          minHeight: 196,
          width: "100%",
        },
        brandCardRow: {
          display: "flex",
          justifyContent: "center",
        },
        brandCard: {
          flex: 1,
          maxWidth: 400,
        },
      }),
    []
  );
