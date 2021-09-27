import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Markdown } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";

/* Merchant Model */
import ProductEditState from "@merchant/model/products/ProductEditState";
import BrandSearch from "@merchant/component/brand/branded-products/BrandSearch";

type ProductBasicInfoSectionProps = BaseProps & {
  readonly allBrandNames?: ReadonlyArray<string> | null | undefined;
  readonly brandId: string | null | undefined;
  readonly brandStatus: string | null | undefined;
  readonly brandName: string | null | undefined;
  readonly upc: string | null | undefined;
  readonly isLtl?: string | null | undefined;
  readonly maxQuantity: number | null | undefined;
  readonly landingPageUrl: string | null | undefined;
  readonly editState: ProductEditState;
};

const fixedSelectWidth = 500;

const ProductBasicInfoSection = (props: ProductBasicInfoSectionProps) => {
  const styles = useStylesheet();

  const {
    brandId,
    brandStatus,
    brandName,
    upc,
    isLtl,
    maxQuantity: maxQuantity,
    landingPageUrl,
    editState,
  } = props;

  const [productMaxQuantity, setProductMaxQuantity] = useState(maxQuantity);
  const [brandInputText, setBrandInputText] = useState(brandName);
  const [requestedBrandId, setRequestedBrandId] = useState(brandId);

  const brandDirectoryLink = `[${i`Brand Directory`}](${"/branded-products/brand-directory"})`;

  const brandTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`Provide the product brand name of the product being sold. ` +
            i`The product must be authentic and directly manufactured by ` +
            i`the brand owner. For example, Apple is the Brand of iPhone ` +
            i`or iPad but Apple is not the Brand of an iPhone case not ` +
            i`manufactured by Apple. Visit ${brandDirectoryLink} ` +
            i`to view a list of brands to select from or request a new ` +
            i`brand to be added.`
          }
          openLinksInNewTab
        />
      </div>
    );
  };

  const upcTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`8 to 14 digits GTIN (UPC, EAN, ISBN) contains no letters or ` +
            i`other characters. A barcode symbology used for tracking ` +
            i`trade items in stores and scanning them at the point of sale. `
          }
        />
      </div>
    );
  };

  const landingUrlTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`URL on your website containing the product detail and buy ` +
            i`button for the applicable product. Please append analytics ` +
            i`tracking codes at the end of your click-out URLs if ` +
            i`applicable. We do not accept URLs that begin with https://. `
          }
        />
      </div>
    );
  };

  const quantityTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`The maximum quantity of products per order. This lets ` +
            i`users break down large orders for easy management and ` +
            i`tracking. This should only be used in rare cases.`
          }
        />
      </div>
    );
  };

  const renderSelect = () => {
    return (
      <div className={css(styles.select)}>
        <BrandSearch
          text={brandInputText}
          onTextChange={({ text }) => setBrandInputText(text)}
          onBrandChanged={(brand) => {
            setRequestedBrandId(brand.id);
            editState.brandId = editState.brandId == brand.id ? null : brand.id;
          }}
          validateBrand={(isValid, text?: string) => {
            editState.validBrand = isValid;
            if (!isValid && !brandName && !text) {
              editState.validBrand = true;
            }
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <HorizontalField
        title={i`Requested Brand ID`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        {requestedBrandId || i`N/A`}
      </HorizontalField>

      <HorizontalField
        title={i`Requested Brand Name`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={brandTip}
      >
        {renderSelect()}
      </HorizontalField>

      <HorizontalField
        title={i`Brand Request Status`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        {brandStatus || i`N/A`}
      </HorizontalField>

      <HorizontalField
        title={i`GTIN (UPC, EAN, ISBN)`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={upcTip}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }: OnTextChangeEvent) => {
            editState.setUPC({ upc: text });
          }}
          defaultValue={upc || undefined}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Landing Page URL`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={landingUrlTip}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }: OnTextChangeEvent) => {
            editState.setLandingPageUrl({ landingPageUrl: text });
          }}
          defaultValue={landingPageUrl || undefined}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Maximum Quantity Per Order`}
        titleWidth={250}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={quantityTip}
      >
        <div className={css(styles.select)}>
          <NumericInput
            onChange={({ valueAsNumber }) => {
              const value = Math.max(0, Number(valueAsNumber));
              setProductMaxQuantity(value);
              editState.setMaxQuantity({ maxQuantity: value });
            }}
            value={productMaxQuantity}
            incrementStep={1}
          />
        </div>
      </HorizontalField>

      {isLtl != null && (
        <HorizontalField
          title={i`Is LTL`}
          titleWidth={250}
          centerTitleVertically
          className={css(styles.verticalMargin)}
        >
          {isLtl}
        </HorizontalField>
      )}
    </div>
  );
};

export default observer(ProductBasicInfoSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        verticalMargin: {
          margin: "10px 0",
        },
        select: {
          minWidth: fixedSelectWidth,
          maxWidth: fixedSelectWidth,
        },
        flexRow: {
          display: "flex",
          flexDirection: "row",
        },
        textInput: {
          flex: 1,
          marginRight: 20,
        },
        p: {
          maxWidth: 480,
          margin: 10,
        },
      }),
    []
  );
};
