/*
 * ProductCategory.tsx
 *
 * Created by Don Sirivat on Wed Sep 14 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import { useQuery } from "@apollo/client";
import {
  Alert,
  Button,
  Field,
  IconButton,
  Layout,
  Link,
  LoadingIndicator,
  Text,
} from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import TaxonomyCategoryPathView from "@core/taxonomy/TaxonomyCategoryPathView";
import TaxonomyCategorySearchBar from "@core/taxonomy/TaxonomyCategorySearchBar";
import TaxonomyL1CategoryDropdown from "@core/taxonomy/TaxonomyL1CategoryDropdown";
import TaxonomyCategoryColumnView from "@core/taxonomy/TaxonomyCategoryColumnView";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import { useTheme } from "@core/stores/ThemeStore";
import { Constants, useTreeVersion } from "@add-edit-product/constants";
import {
  CategoryAttributesRequestData,
  CategoryAttributesResponseData,
  CATEGORY_ATTRIBUTES_QUERY,
  GetTaxonomyVariationOptionsRequestType,
  GetTaxonomyVariationOptionsResponseType,
  GET_TAXONOMY_VARIATION_OPTIONS_QUERY,
  PickedCategoryWithDetails,
} from "@core/taxonomy/toolkit";
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import Section, { SectionProps } from "./Section";
import ConfirmationModal from "@core/components/ConfirmationModal";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ProductCategory: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;
  const {
    subcategory,
    hasOptions,
    updateSubcategory,
    updateTaxonomyAttributes,
    updateTaxonomyVariationOptions,
    removeInvalidVariationOptionSelections,
    removeVariationsWithInvalidOptions,
    removeInvalidOptionsFromVariations,
    isNewProduct,
    showVariationGroupingUI,
  } = state;

  const [selectedL1, setSelectedL1] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    PickedCategoryWithDetails | null | undefined
  >(subcategory);
  const [isEditMode, setIsEditMode] = useState<boolean>(subcategory == null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const { decision, isLoading } = useDeciderKey("big4_l1_product_ui");
  const {
    decision: showCategoryUpdates,
    isLoading: isLoadingCategoryUpdatesDecision,
  } = useDeciderKey("taxonomy_category_updates_04_2023");
  const { version: treeVersion, loading: treeVersionLoading } =
    useTreeVersion();

  const { data: attributesData } = useQuery<
    CategoryAttributesResponseData,
    CategoryAttributesRequestData
  >(CATEGORY_ATTRIBUTES_QUERY, {
    variables: {
      categoryId: subcategory?.id ? parseInt(subcategory.id) : 0,
      treeVersion: treeVersion || Constants.TAXONOMY.treeVersion,
    },
    skip: !subcategory?.id || treeVersion == null || treeVersionLoading,
  });

  const { data: variationOptionsData } = useQuery<
    GetTaxonomyVariationOptionsResponseType,
    GetTaxonomyVariationOptionsRequestType
  >(GET_TAXONOMY_VARIATION_OPTIONS_QUERY, {
    variables: {
      categoryId: subcategory?.id ? parseInt(subcategory.id) : 0,
    },
    skip: !showVariationGroupingUI || !subcategory?.id,
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

  const editMode = (
    <Layout.FlexColumn>
      <Text
        style={[styles.bodyText, styles.l1Step, styles.darkColorText]}
        weight="semibold"
      >
        1. Select Category
      </Text>
      <TaxonomyL1CategoryDropdown
        onSelect={(categoryId: string | null) =>
          setSelectedL1(categoryId != null ? parseInt(categoryId) : null)
        }
      />
      <Text
        style={[styles.bodyText, styles.l1Step, styles.darkColorText]}
        weight="semibold"
      >
        2. Search Sub-Categories
      </Text>
      <Layout.FlexRow justifyContent="space-between">
        <TaxonomyCategorySearchBar
          style={styles.searchBar}
          disabled={!selectedL1}
          l1CategoryId={selectedL1}
          placeholder={ci18n(
            "Placeholder text in searchbar, lets merchant search for a product category",
            "Try clothing, tools, or electronics",
          )}
          onSelect={(category) => {
            setSelectedSubcategory(category);
          }}
        />
        <Button
          disabled={!selectedSubcategory}
          style={styles.button}
          data-cy="button-apply"
          onClick={() => {
            if (
              selectedSubcategory &&
              selectedSubcategory.id !== subcategory?.id
            ) {
              if (showVariationGroupingUI && hasOptions) {
                setIsConfirmModalOpen(true);
              } else {
                updateSubcategory(selectedSubcategory);
              }
            }
            setIsEditMode(false);
          }}
        >
          {ci18n("Button label to submit product form data", "Apply")}
        </Button>
      </Layout.FlexRow>
      {showCategoryUpdates && (
        <>
          <TaxonomyCategoryPathView
            style={[styles.pathView, styles.l1Step, styles.darkColorText]}
            currentCategory={selectedSubcategory}
          />
          <TaxonomyCategoryColumnView
            style={styles.l1Step}
            currentPath={selectedSubcategory?.categoriesAlongPath}
            onSelect={(category) => {
              // update subcategory only if selection is a leaf category
              if (
                category.categoryChildren == null ||
                category.categoryChildren.length === 0
              ) {
                setSelectedSubcategory(category);
              }
            }}
          />
        </>
      )}
    </Layout.FlexColumn>
  );

  const selectedMode = (
    <Layout.FlexColumn>
      <Layout.FlexRow>
        <Text weight="bold" style={[styles.selected, styles.darkColorText]}>
          {selectedSubcategory?.name}
        </Text>
        <Layout.FlexRow justifyContent="flex-end">
          <IconButton
            icon="edit"
            style={styles.editButton}
            data-cy="button-edit"
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            <Link style={styles.bodyText}>
              {ci18n(
                "Text on a button merchants can click to go back and edit the form data",
                "Edit",
              )}
            </Link>
          </IconButton>
        </Layout.FlexRow>
      </Layout.FlexRow>
      <TaxonomyCategoryPathView
        hideLabel
        currentCategory={subcategory}
        style={[styles.pathView, styles.darkColorText]}
      />
    </Layout.FlexColumn>
  );

  const womensClothingOnly = (
    <Field
      title={ci18n("Category the product falls under", "Category")}
      style={styles.field}
    >
      <Layout.FlexRow justifyContent="space-between">
        {subcategory?.id ? (
          <Layout.FlexRow>
            <Text weight="bold" style={[styles.selected, styles.darkColorText]}>
              {subcategory.name}
            </Text>
            <Layout.FlexRow justifyContent="flex-end">
              <IconButton
                icon="edit"
                style={styles.editButton}
                onClick={() => {
                  updateSubcategory(null);
                }} // render confirm popup
              >
                <Link style={styles.bodyText}>
                  {ci18n(
                    "Text on a button merchants can click to go back and edit the form data",
                    "Edit",
                  )}
                </Link>
              </IconButton>
            </Layout.FlexRow>
          </Layout.FlexRow>
        ) : (
          <>
            <TaxonomyCategorySearchBar
              style={styles.searchBar}
              l1CategoryId={Constants.TAXONOMY.fashionCategoryId}
              placeholder={ci18n(
                "Placeholder text in searchbar, lets merchant search for a product category",
                "Try clothing, tools, or electronics",
              )}
              onSelect={(category) => {
                setSelectedSubcategory(category);
              }}
            />
            <Button
              disabled={!selectedSubcategory}
              style={styles.button}
              onClick={() => {
                updateSubcategory(selectedSubcategory);
              }}
            >
              {ci18n("Button label to submit product form data", "Apply")}
            </Button>
          </>
        )}
      </Layout.FlexRow>
    </Field>
  );
  const bigFour = !isEditMode ? selectedMode : editMode;

  if (isLoading || isLoadingCategoryUpdatesDecision) {
    return <LoadingIndicator />;
  }

  return (
    <Section
      className={css(style, className)}
      title={ci18n(
        "Category the current product falls under",
        "**Product Category**",
      )}
      markdown
      {...sectionProps}
    >
      <ConfirmationModal
        title={i`Please confirm your category update`}
        open={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        text={
          i`Are you sure you want to update the category? ` +
          i`Invalid variations will be removed.`
        }
        cancel={{
          text: ci18n("Modal CTA", "Cancel"),
          onClick: () => {
            setSelectedL1(null);
            setSelectedSubcategory(subcategory);
            setIsConfirmModalOpen(false);
          },
        }}
        action={{
          text: ci18n("Modal CTA", "Yes"),
          onClick: () => {
            updateSubcategory(selectedSubcategory);
            setIsConfirmModalOpen(false);
          },
        }}
      ></ConfirmationModal>
      {decision ? (
        <Alert
          sentiment="info"
          text={
            i`You can only provide attributes for the following categories: ` +
            i`Apparel Accessories, Cellphones & Telecommunications, Computer & Office, ` +
            i`Consumer Electronics, Entertainment, Home & Garden, Home Improvement, ` +
            i`Jewelry & Accessories, Luggage & Bags, Men's Clothing, Shoes, Sports, ` +
            i`or Toys & Hobbies`
          }
        />
      ) : (
        <Alert
          sentiment="info"
          text={
            i`You can skip this step if the product category does not ` +
            i`fall under Women's Clothing`
          }
          link={{
            text: i`View the full list of Women’s Clothing categories`,
            url: zendeskURL("6297940540571"),
          }}
        />
      )}

      <Text style={styles.title}>
        Search for and enter the product category below. This will help your
        listing appear in the right tabs and search results on Wish.
      </Text>
      {decision ? bigFour : womensClothingOnly}
    </Section>
  );
};

export default observer(ProductCategory);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: textDark,
          marginTop: 24,
          marginBottom: 24,
          width: "75%",
          fontSize: 15,
        },
        searchBar: {
          marginRight: 16,
        },
        field: {
          alignSelf: "stretch",
        },
        button: {
          alignSelf: "flex-start",
          borderRadius: 4,
          width: 125,
          height: 42, // prevent button from growing when error is displayed
        },
        selected: {
          fontSize: 18,
          marginRight: 5,
        },
        editButton: {
          border: "none",
        },
        bodyText: {
          fontSize: 14,
        },
        l1Step: {
          marginTop: 16,
        },
        pathView: {
          flexWrap: "wrap",
          fontSize: 15,
        },
        darkColorText: {
          color: textDark,
        },
      }),
    [textDark],
  );
};
