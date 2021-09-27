import React, { useState, useMemo } from "react";
import { observer } from "mobx-react";

import { StyleSheet } from "aphrodite";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Markdown } from "@ContextLogic/lego";

import BrandSearch from "@merchant/component/brand/branded-products/BrandSearch";
import BrandCardItem from "@merchant/component/brand/branded-products/BrandCard";
import NewTrueBrandRequestModal from "@merchant/component/brand/branded-products/NewTrueBrandRequestModal";

import RightCard from "@plus/component/products/edit-product/RightCard";
import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const BrandCard: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, editState } = props;
  const { requestedBrand } = editState;
  const [text, setText] = useState(requestedBrand?.displayName || "");
  const [numBrands, setNumBrands] = useState<number | null>();

  const requestNewBrand = numBrands === 0 && (
    <Markdown
      className={css(styles.lowerItem)}
      text={i`This brand does not exist in the Brand Directory. [Suggest a new brand](${"#"})`}
      onLinkClicked={() => {
        new NewTrueBrandRequestModal({
          brandName: text,
          isMerchantPlus: true,
        }).render();
      }}
    />
  );

  return (
    <RightCard
      className={css(className, style)}
      title={ci18n("meaning clothing brand, etc", "Brand")}
      contentContainerStyle={css(styles.root)}
      isOptional
    >
      <BrandSearch
        placeholder={i`Enter the brand name`}
        text={text}
        onTextChange={({ text }) => setText(text)}
        onBrandChanged={(brand) => {
          editState.requestedBrand = brand;
          setText("");
        }}
        validateBrand={(isValid, text?: string) => {}}
        setNumBrands={setNumBrands}
        inputProps={{
          height: 40,
        }}
      />
      {requestedBrand && (
        <BrandCardItem
          className={css(styles.lowerItem)}
          brand_id={requestedBrand.id}
          brand_name={requestedBrand.displayName}
          logo_url={requestedBrand.logoUrl}
          onDelete={() => {
            editState.requestedBrand = null;
          }}
        />
      )}
      {requestNewBrand}
    </RightCard>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        lowerItem: {
          marginTop: 15,
        },
      }),
    []
  );

export default observer(BrandCard);
