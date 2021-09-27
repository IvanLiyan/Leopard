/*
 *
 * BarcodeAutoFill.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { runInAction } from "mobx";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

import gql from "graphql-tag";

import { Field, TextInput } from "@ContextLogic/lego";
import { KEYCODE_ENTER } from "@toolkit/dom";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useLogger } from "@toolkit/logger";
import { css } from "@toolkit/styling";
import { UPCValidator } from "@toolkit/validators";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState, {
  VariationEditState,
} from "@plus/model/ProductEditState";
import {
  ImageSchema,
  UpcProductSchema,
  UpcVariationSchema,
  UpcProductServiceSchemaProductArgs,
  BrandSchema,
  BrandServiceSchemaTrueBrandsArgs,
  UserSchema,
  MerchantSchema,
} from "@schema/types";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useTheme } from "@merchant/stores/ThemeStore";

const GET_UPC_PRODUCT = gql`
  query GetUPCProduct($upc: String!) {
    productCatalog {
      upcProductService {
        product(upc: $upc) {
          brandName
          upc
          name
          description
          variations {
            images
            price {
              amount
              currencyCode
            }
            size
            color
            upc
          }
        }
      }
    }
    currentUser {
      id
    }
    currentMerchant {
      id
    }
  }
`;

type SelectedUPCProduct = Pick<
  UpcProductSchema,
  "brandName" | "upc" | "name" | "description"
> & {
  readonly variations: ReadonlyArray<
    Pick<UpcVariationSchema, "images" | "size" | "color" | "price" | "upc">
  >;
};

type SelectedUser = Pick<UserSchema, "id">;
type SelectedMerchant = Pick<MerchantSchema, "id">;

type GetUPCProductRequest = {
  readonly upc: UpcProductServiceSchemaProductArgs["upc"];
};

type GetUPCProductResponseType = {
  readonly productCatalog: {
    readonly upcProductService: {
      readonly product: SelectedUPCProduct | null | undefined;
    };
  };
  readonly currentUser: SelectedUser | null | undefined;
  readonly currentMerchant: SelectedMerchant | null | undefined;
};

const GET_BRAND_MATCH = gql`
  query GetBrandMatch($brandName: String!) {
    brand {
      trueBrands(brandName: $brandName, count: 1) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

type SelectedBrand = Pick<BrandSchema, "id" | "displayName" | "logoUrl">;

type GetBrandMatchRequest = {
  readonly brandName: BrandServiceSchemaTrueBrandsArgs["brandName"];
};

type GetBrandMatchResponseType = {
  readonly brand: {
    readonly trueBrands: SelectedBrand[];
  };
};

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const BarcodeAutoFill: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { nonBatchingClient: client } = useApolloStore();
  const toastStore = useToastStore();
  const { style, className, editState, ...sectionProps } = props;
  const [upc, setUpc] = useState<string | undefined>();
  const [upcValid, setUpcValid] = useState(false);
  const [isSubmittingBarcode, setIsSubmittingBarcode] = useState(false);
  const gtinLogger = useLogger("ADD_GTIN_PRODUCT");

  const canSubmit = upc && upcValid;
  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setIsSubmittingBarcode(true);
    const res = await client.query<
      GetUPCProductResponseType,
      GetUPCProductRequest
    >({
      query: GET_UPC_PRODUCT,
      variables: {
        upc,
      },
    });
    setIsSubmittingBarcode(false);
    const { data } = res;
    if (data == null) {
      return;
    }
    const {
      productCatalog: {
        upcProductService: { product },
      },
      currentUser,
      currentMerchant,
    } = data;
    if (product == null) {
      toastStore.info(i`Product not found`);
      return;
    }
    let brands: SelectedBrand[] = [];
    if (product.brandName) {
      const response = await client.query<
        GetBrandMatchResponseType,
        GetBrandMatchRequest
      >({
        query: GET_BRAND_MATCH,
        variables: { brandName: product.brandName },
      });
      brands = response.data.brand?.trueBrands || [];
      brands = brands.filter(
        (b) => b.displayName.toLowerCase() === product.brandName?.toLowerCase()
      );
      gtinLogger.info({
        gtin: upc,
        product_id: editState.id,
        merchant_id: currentMerchant?.id,
        user_id: currentUser?.id,
        success: brands.length > 0,
        gmv: null,
        brand: product.brandName,
        brand_id: brands[0]?.id,
        source: `Merchant Plus`,
      });
    }

    let variations: ReadonlyArray<VariationEditState> = [];
    let mainImage: ImageSchema | undefined;
    for (const upcVariation of product.variations) {
      const upcProductImages = (upcVariation.images || []).filter(
        Boolean
      ) as ReadonlyArray<string>;
      let variationImage: ImageSchema | undefined;
      if (upcProductImages.length > 0) {
        const upcImage = upcProductImages[0];
        variationImage = {
          id: 0,
          wishUrl: upcImage,
          isCleanImage: false,
        };
      }

      const newVariation = new VariationEditState({
        initialState: {
          sku: upcVariation.upc,
          size: upcVariation.size,
          color: upcVariation.color,
          price: upcVariation.price ?? undefined,
          image: variationImage,
        },
        editState,
      });
      variations = [...variations, newVariation];
      if (!mainImage && variationImage) {
        mainImage = variationImage;
      }
    }

    runInAction(() => {
      editState.name = product.name;
      editState.description = product.description;
      if (mainImage) {
        editState.setImages([mainImage]);
      }
      editState.discardAllNewVariations();
      editState.setVariations(variations);
      editState.hasColorOrSizeVariations =
        editState.hasColors || editState.hasSizes;
      editState.variationFormState.syncFormText();
      if (brands.length > 0) {
        editState.requestedBrand = brands[0];
      }
    });
    toastStore.positive(
      ci18n(
        "popup indicating to the merchant they have successfully imported a new product (placeholder is singular)",
        'Successfully imported "%1$s"',
        product.name
      )
    );
  };

  return (
    <Section
      className={css(style, className)}
      title={i`**Autofill with barcode** (optional)`}
      markdown
      {...sectionProps}
    >
      <div className={css(styles.title)}>
        Enter the product barcode to autofill your images and listing details.
      </div>
      <Field title={i`Barcode`} className={css(styles.field)}>
        <div className={css(styles.content)}>
          <TextInput
            value={upc}
            onChange={({ text }) => setUpc(text)}
            onValidityChanged={(isValid) => setUpcValid(isValid)}
            placeholder={i`GTIN (UPC, EAN, ISBN)`}
            className={css(styles.input)}
            disabled={isSubmittingBarcode || editState.isSubmitting}
            debugValue="078257315918"
            validators={[new UPCValidator()]}
            hideCheckmarkWhenValid
            onKeyUp={(keyCode) => {
              if (keyCode != KEYCODE_ENTER) {
                return;
              }
              onSubmit();
            }}
          />
          <Button
            disabled={
              isSubmittingBarcode || !canSubmit || editState.isSubmitting
            }
            className={css(styles.button)}
            onClick={onSubmit}
          >
            Autofill
          </Button>
        </div>
      </Field>
    </Section>
  );
};

export default observer(BarcodeAutoFill);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: textDark,
          marginBottom: 15,
        },
        content: {
          display: "flex",
          width: "100%",
        },
        field: {
          alignSelf: "stretch",
        },
        input: {
          flex: 1,
        },
        button: {
          marginLeft: 15,
          height: 42, // prevent button from growing when error is displayed
        },
      }),
    [textDark]
  );
};
