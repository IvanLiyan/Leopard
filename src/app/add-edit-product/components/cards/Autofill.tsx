/*
 * Autofill.tsx
 *
 * Created by Jonah Dlin on Thu Oct 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { runInAction } from "mobx";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@core/toolkit/i18n";

import { Field, Layout, Text, TextInput } from "@ContextLogic/lego";
import { KEYCODE_ENTER } from "@core/toolkit/dom";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { GtinValidator, ValidationResponse } from "@core/toolkit/validators";

import Section, { SectionProps } from "./Section";
import { ImageSchema } from "@schema";
import { useToastStore } from "@core/stores/ToastStore";
import { useApolloStore } from "@core/stores/ApolloStore";
import { useTheme } from "@core/stores/ThemeStore";
import AddEditProductState, {
  createVariation,
  Variation,
} from "@add-edit-product/AddEditProductState";
import {
  GET_BRAND_MATCH,
  GetBrandMatchRequest,
  GetBrandMatchResponse,
  PickedBrand,
  GetGtinProductQueryResponse,
  GetGtinProductQueryRequest,
  GET_GTIN_PRODUCT_QUERY,
} from "@add-edit-product/queries/autofill-queries";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const Autofill: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();

  const { nonBatchingClient: client } = useApolloStore();
  const toastStore = useToastStore();
  const { negative } = useTheme();

  const { style, className, state, ...sectionProps } = props;
  const { primaryCurrency } = state;

  const [gtins, setGtins] = useState<ReadonlyArray<string>>([]);
  const [error, setError] = useState<ValidationResponse>();
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isSubmittingBarcode, setIsSubmittingBarcode] = useState(false);

  const getGtinError = async (gtinsToCheck: ReadonlyArray<string>) => {
    setIsLoadingError(true);
    const responsePromises = gtinsToCheck.map((gtin) => {
      const validator = new GtinValidator({
        customMessage: i`${gtin} is not a valid GTIN`,
      });
      return validator.validate(gtin);
    });

    const responses = await Promise.all(responsePromises);

    setIsLoadingError(false);
    setError(responses.find((response) => response != null));
  };

  useEffect(() => {
    if (!isLoadingError) {
      void getGtinError(gtins);
    }
    // this effect should only run when gtins change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gtins]);

  const canSubmit = gtins.length > 0 && error == null;
  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setIsSubmittingBarcode(true);
    const res = await client.query<
      GetGtinProductQueryResponse,
      GetGtinProductQueryRequest
    >({
      query: GET_GTIN_PRODUCT_QUERY,
      variables: {
        gtins,
        currency: primaryCurrency,
      },
    });
    setIsSubmittingBarcode(false);
    const { data, errors } = res;
    if (
      data == null ||
      data.productCatalog == null ||
      (errors != null && errors.length > 0) ||
      data.productCatalog.gtinProductService.product == null
    ) {
      toastStore.negative(i`Product not found`);
      return;
    }
    const {
      productCatalog: {
        gtinProductService: { product },
      },
    } = data;

    let brands: ReadonlyArray<PickedBrand> = [];

    const brandName =
      product.wishBrand != null ? product.wishBrand.displayName : null;

    if (brandName != null) {
      const response = await client.query<
        GetBrandMatchResponse,
        GetBrandMatchRequest
      >({
        query: GET_BRAND_MATCH,
        variables: { brandName },
      });
      brands = (response.data.brand?.trueBrands || []).filter(
        (b) => b.displayName.toLowerCase() === brandName.toLowerCase(),
      );
    }

    let variations: Array<Variation> = [];
    let mainImage: ImageSchema | undefined;
    (product.variations || []).forEach((gtinVariation) => {
      const gtinProductImages = gtinVariation.imageUrls || [];
      let variationImage: ImageSchema | undefined;
      if (gtinProductImages.length > 0) {
        const gtinImage = gtinProductImages[0];
        variationImage = {
          id: 0,
          wishUrl: gtinImage,
          isCleanImage: false,
        };
      }

      const newVariation = createVariation({
        initialState: {
          gtin: gtinVariation.gtin,
          sku: gtinVariation.gtin,
          size: gtinVariation.size,
          color: gtinVariation.color,
          price:
            gtinVariation.price == null
              ? undefined
              : gtinVariation.price.convertedTo,
          image: variationImage,
        },
      });
      variations = [...variations, newVariation];
      if (!mainImage && variationImage) {
        mainImage = variationImage;
      }
    });

    runInAction(() => {
      state.name = product.title;
      state.description = product.description;
      if (mainImage) {
        state.setImages([mainImage]);
      }
      state.replaceVariations(variations);
      if (brands.length > 0) {
        state.requestedBrand = brands[0];
      }
    });
    toastStore.positive(
      ci18n(
        "popup indicating to the merchant they have successfully imported a new product (placeholder is singular)",
        'Successfully imported "%1$s"',
        product.title,
      ),
    );
  };

  return (
    <Section
      className={css(style, className)}
      title={i`**Autofill your listing** (optional)`}
      markdown
      {...sectionProps}
    >
      <Text className={css(styles.title)}>
        Enter the product’s GTIN to autofill your images and listing details.
      </Text>
      <Field title={i`GTIN`} className={css(styles.field)}>
        <Layout.FlexRow style={styles.content}>
          <TextInput
            placeholder={i`Enter a GTIN (UPC, EAN, ISBN) for each variation, separated by commas`}
            className={css(styles.input)}
            disabled={
              isSubmittingBarcode || state.isSubmitting || isLoadingError
            }
            debugValue="8718672352212"
            onKeyUp={(keyCode) => {
              if (keyCode != KEYCODE_ENTER) {
                return;
              }
              void onSubmit();
            }}
            tokenize
            noDuplicateTokens
            tokenSeparator=","
            onTokensChanged={({ tokens }) => {
              setGtins(tokens);
            }}
            borderColor={error == null ? undefined : negative}
            validationResponse={error}
            data-cy="input-gtin"
          />
          <Button
            disabled={isSubmittingBarcode || !canSubmit || state.isSubmitting}
            className={css(styles.button)}
            onClick={() => {
              void onSubmit();
            }}
            data-cy="button-autofill"
          >
            Autofill
          </Button>
        </Layout.FlexRow>
      </Field>
    </Section>
  );
};

export default observer(Autofill);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: textDark,
          marginBottom: 24,
        },
        content: {
          width: "100%",
        },
        field: {
          alignSelf: "stretch",
        },
        input: {
          flex: 1,
        },
        button: {
          alignSelf: "flex-start",
          marginLeft: 16,
          height: 42, // prevent button from growing when error is displayed
        },
      }),
    [textDark],
  );
};
