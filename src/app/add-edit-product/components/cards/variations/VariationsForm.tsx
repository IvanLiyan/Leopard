/*
 * VariationsForm.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import uniq from "lodash/uniq";

import faker from "faker/locale/en";
import { useTheme } from "@core/stores/ThemeStore";

import {
  Button,
  Field,
  Layout,
  PrimaryButton,
  TextInput,
} from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AddEditProductState, {
  UniqueVariationTokensValidator,
} from "@add-edit-product/AddEditProductState";
import AddVariationModal from "./AddVariationModal";
import { css } from "@core/toolkit/styling";
import VariationOptionsInput from "./VariationOptionsInput";
import AddVariationModalV2 from "./AddVariationModalV2";
import { merchFeURL } from "@core/toolkit/router";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const VariationsForm: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state } = props;

  const [forceValidation, setForceValidation] = useState(false);
  const [isSizesValid, setIsSizesValid] = useState(true);
  const [isColorsValid, setIsColorsValid] = useState(true);
  const [isAddVariationModalOpen, setIsAddVariationModalOpen] =
    useState<boolean>(false);

  const {
    colorsText,
    isSubmitting,
    updateVariationsFromForm,
    sizesText,
    isNewProduct,
    showVariationGroupingUI,
  } = state;

  return (
    <Layout.FlexColumn style={[style, className]}>
      {isAddVariationModalOpen &&
        (showVariationGroupingUI ? (
          <AddVariationModalV2
            open={isAddVariationModalOpen}
            state={state}
            onClose={() => setIsAddVariationModalOpen(false)}
          />
        ) : (
          <AddVariationModal
            open={isAddVariationModalOpen}
            state={state}
            onClose={() => setIsAddVariationModalOpen(false)}
          />
        ))}
      {showVariationGroupingUI && <VariationOptionsInput state={state} />}
      {isNewProduct && !showVariationGroupingUI && (
        <Layout.FlexColumn alignItems="stretch">
          <div className={css(styles.colorSizesSection)}>
            <Layout.FlexColumn style={styles.column} alignItems="stretch">
              <Field
                title={i`Color (optional)`}
                description={
                  i`The color of the product, especially as it pertains to apparel or jewelry. ` +
                  i`Each color variation must be its own row in the feed, have its own unique SKU, ` +
                  i`and its own inventory level. If you would like to have it show two colors (eg ` +
                  i`'black and red'), simply separate the colors by "&" (eg "black & red"). Please ` +
                  i`note that showing two colors here should not be confused with products ` +
                  i`having two different colored variations. The name of the color must be in the ` +
                  i`list of [currently accepted colors](${merchFeURL(
                    "/documentation/colors",
                  )}).`
                }
              >
                <TextInput
                  placeholder={i`Separate colors with a comma`}
                  isTextArea
                  tokenize
                  value={colorsText}
                  onChange={({ text }) => (state.colorsText = text)}
                  height={100}
                  debugValue={uniq([
                    faker.commerce.color(),
                    faker.commerce.color(),
                  ]).join(",")}
                  disabled={isSubmitting}
                  forceValidation={forceValidation}
                  validators={[
                    new UniqueVariationTokensValidator({
                      customMessage: i`No duplicate colors`,
                    }),
                  ]}
                  onValidityChanged={(isValid) => setIsColorsValid(isValid)}
                />
              </Field>
            </Layout.FlexColumn>
            <Layout.FlexColumn style={styles.column} alignItems="stretch">
              <Field
                title={i`Size (optional)`}
                description={
                  i`The size of the product, especially as it pertains to apparel, footwear, or ` +
                  i`jewelry. Each size variation must be its own row in the feed, have its own ` +
                  i`unique SKU, and its own inventory level.`
                }
              >
                <TextInput
                  placeholder={i`Separate sizes with a comma`}
                  isTextArea
                  tokenize
                  value={sizesText}
                  onChange={({ text }) => (state.sizesText = text)}
                  height={100}
                  debugValue={["small", "medium", "large"].join(",")}
                  disabled={isSubmitting}
                  forceValidation={forceValidation}
                  validators={[
                    new UniqueVariationTokensValidator({
                      customMessage: i`No duplicate sizes`,
                    }),
                  ]}
                  onValidityChanged={(isValid) => setIsSizesValid(isValid)}
                />
              </Field>
            </Layout.FlexColumn>
          </div>
          <PrimaryButton
            style={styles.updateVariationsButton}
            onClick={() => {
              if (!isSizesValid || !isColorsValid) {
                setForceValidation(true);
                return;
              }
              updateVariationsFromForm();
            }}
          >
            Apply
          </PrimaryButton>
        </Layout.FlexColumn>
      )}
      {!isNewProduct && (
        <Button
          onClick={() => {
            setIsAddVariationModalOpen(true);
          }}
          style={styles.addVariation}
          disabled={isSubmitting || !isSizesValid || !isColorsValid}
          data-cy="button-add-variation"
        >
          Add variation
        </Button>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        colorSizesSection: {
          display: "flex",
          gap: 16,
          "@media (max-width: 900px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        },
        updateVariationsButton: {
          width: "fit-content",
          marginTop: 16,
          alignSelf: "flex-end",
        },
        column: {
          "@media (min-width: 900px)": {
            flexGrow: 1,
            flexBasis: 0,
          },
        },
        checkbox: {
          padding: 10,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        addVariation: {
          alignSelf: "flex-start",
          padding: "7px 25px",
        },
      }),
    [borderPrimary],
  );
};

export default observer(VariationsForm);
