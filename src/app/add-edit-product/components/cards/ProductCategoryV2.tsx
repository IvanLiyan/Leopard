import { useQuery } from "@apollo/client";
import { Token } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import {
  CategoryAttributesRequestData,
  CategoryAttributesResponseData,
  CATEGORY_ATTRIBUTES_QUERY,
  GetTaxonomyVariationOptionsRequestType,
  GetTaxonomyVariationOptionsResponseType,
  GET_TAXONOMY_VARIATION_OPTIONS_QUERY,
  useCategoryTreeMap,
  CategoryId,
} from "@core/taxonomy/toolkit";
import { css } from "@core/toolkit/styling";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import Section, {
  SectionProps,
} from "@add-edit-product/components/cards/Section";
import ConfirmationModal from "@core/components/ConfirmationModal";
import TaxonomyCategorySelectSection from "@core/taxonomy/v2/TaxonomyCategorySelectSection";
import Skeleton from "@mui/material/Skeleton";
import { Button, Stack, Text } from "@ContextLogic/atlas-ui";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ProductCategoryV2: React.FC<Props> = (props: Props) => {
  const { style, className, state, ...sectionProps } = props;
  const {
    subcategoryId,
    hasOptions,
    updateSubcategoryId,
    updateTaxonomyAttributes,
    updateTaxonomyVariationOptions,
    removeInvalidVariationOptionSelections,
    removeVariationsWithInvalidOptions,
    removeInvalidOptionsFromVariations,
    isNewProduct,
    showVariationGroupingUI,
    forceValidation,
    categoryErrorMessage,
  } = state;

  const { categoryMap, loading: isLoadingCategoryTree } = useCategoryTreeMap();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    CategoryId | null | undefined
  >();
  const [isEditMode, setIsEditMode] = useState<boolean>(subcategoryId == null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const currentCategoryName = useMemo(() => {
    const selectedNode = subcategoryId && categoryMap.get(subcategoryId);

    return selectedNode
      ? `${selectedNode.name} (${selectedNode.id})`
      : undefined;
  }, [categoryMap, subcategoryId]);

  const { data: attributesData } = useQuery<
    CategoryAttributesResponseData,
    CategoryAttributesRequestData
  >(CATEGORY_ATTRIBUTES_QUERY, {
    variables: {
      categoryId: subcategoryId ?? 0,
    },
    skip: subcategoryId == null,
  });

  const { data: variationOptionsData } = useQuery<
    GetTaxonomyVariationOptionsResponseType,
    GetTaxonomyVariationOptionsRequestType
  >(GET_TAXONOMY_VARIATION_OPTIONS_QUERY, {
    variables: {
      categoryId: subcategoryId ?? 0,
    },
    skip: !showVariationGroupingUI || subcategoryId == null,
  });

  useEffect(() => {
    if (attributesData?.taxonomy?.attributes) {
      updateTaxonomyAttributes(attributesData.taxonomy.attributes);
    }
  }, [attributesData, updateTaxonomyAttributes]);

  useEffect(() => {
    const variationOptions = variationOptionsData?.taxonomy?.variationOptions;
    if (variationOptions != null) {
      updateTaxonomyVariationOptions(variationOptions);
      removeInvalidVariationOptionSelections();
      if (isNewProduct) {
        removeVariationsWithInvalidOptions();
      } else {
        removeInvalidOptionsFromVariations();
      }
    }
  }, [
    isNewProduct,
    removeVariationsWithInvalidOptions,
    removeInvalidOptionsFromVariations,
    removeInvalidVariationOptionSelections,
    updateTaxonomyVariationOptions,
    variationOptionsData?.taxonomy?.variationOptions,
  ]);

  if (isLoadingCategoryTree) {
    return <Skeleton height={300} />;
  }

  return (
    <Section
      className={css(style, className)}
      title={ci18n(
        "Category the current product falls under",
        "**Product category***",
      )}
      markdown
      hasInvalidData={forceValidation && categoryErrorMessage != null}
      errorMessage={categoryErrorMessage}
      {...sectionProps}
    >
      <ConfirmationModal
        title={i`Please confirm your category update`}
        open={isConfirmModalOpen}
        onClose={() => {
          setSelectedSubcategoryId(subcategoryId);
          setIsConfirmModalOpen(false);
        }}
        text={
          i`Are you sure you want to update the category? ` +
          i`Invalid variations will be removed.`
        }
        cancel={{
          text: ci18n("Modal CTA", "Cancel"),
          onClick: () => {
            setSelectedSubcategoryId(subcategoryId);
            setIsConfirmModalOpen(false);
          },
        }}
        action={{
          text: ci18n("Modal CTA", "Yes"),
          onClick: () => {
            updateSubcategoryId(selectedSubcategoryId);
            setIsConfirmModalOpen(false);
          },
        }}
      />
      <Text variant="bodyLStrong" sx={{ marginBottom: "16px" }}>
        {ci18n(
          "Field title, means to select a product category, * indicates that it is a required filed",
          "Select category*",
        )}
      </Text>
      {isEditMode ? (
        <Stack direction="column">
          <TaxonomyCategorySelectSection
            style={{ overflow: "auto" }}
            initialCategoryTreeMap={categoryMap}
            onSelectionsChange={(categories) =>
              categories.length > 0
                ? setSelectedSubcategoryId(categories[0])
                : setSelectedSubcategoryId(undefined)
            }
            maxSelection={1}
            hideToken
            selectLeafOnly
            hideHeader
          />

          <Button
            disabled={selectedSubcategoryId == null}
            sx={{ alignSelf: "flex-start", marginTop: "16px" }}
            data-cy="button-apply"
            primary
            onClick={() => {
              if (
                selectedSubcategoryId != null &&
                selectedSubcategoryId !== subcategoryId
              ) {
                if (showVariationGroupingUI && hasOptions) {
                  setIsConfirmModalOpen(true);
                } else {
                  updateSubcategoryId(selectedSubcategoryId);
                }
              }
              setIsEditMode(false);
            }}
          >
            {ci18n("Button label to submit product form data", "Apply")}
          </Button>
        </Stack>
      ) : (
        <Token
          onDelete={() => {
            setSelectedSubcategoryId(undefined);
            setIsEditMode(true);
          }}
          style={{ alignSelf: "flex-start" }}
        >
          {currentCategoryName}
        </Token>
      )}
    </Section>
  );
};

export default observer(ProductCategoryV2);
