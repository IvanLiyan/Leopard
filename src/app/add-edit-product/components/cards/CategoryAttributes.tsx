/*
 * CategoryAttributes.tsx
 *
 * Created by Don Sirivat on Wed Sep 14 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import { Field, Layout } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import ImageUploadGroup, {
  ImageInfo,
} from "@add-edit-product/components/ImageUploadGroup";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { Constants } from "@core/taxonomy/constants";
import { PickedTaxonomyAttribute } from "@core/taxonomy/toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import AttributeInput from "./AttributeInput";
import Section, { SectionProps } from "./Section";
import { merchFeUrl } from "@core/toolkit/router";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ImageWidth = 173;

const CategoryAttributes: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const {
    forceValidation,
    isSubmitting,
    subcategoryAttributes,
    updateSubcategoryAttributes,
    taxonomyAttributes,
  } = state;

  const imageInfos: ReadonlyArray<ImageInfo> = useMemo(() => {
    const sizeChartImgs =
      subcategoryAttributes[Constants.TAXONOMY.sizeChartImgAttrName];
    if (!sizeChartImgs?.length) {
      return [];
    }

    return sizeChartImgs.map((str) => ({
      url: str,
    }));
  }, [subcategoryAttributes]);

  const renderAttribute = (attribute: PickedTaxonomyAttribute) => {
    const attrValue = subcategoryAttributes[attribute.name];
    return (
      <Field
        title={attribute.name}
        description={attribute.description}
        key={attribute.id}
        style={styles.field}
      >
        <AttributeInput
          style={styles.input}
          attribute={attribute}
          value={attrValue}
          onChange={(value) =>
            updateSubcategoryAttributes({
              attrName: attribute.name,
              attrValue: value,
            })
          }
          forceValidation={forceValidation}
          disabled={isSubmitting}
          acceptNegative={false}
          required={attribute.usage == "ATTRIBUTE_USAGE_REQUIRED"}
        />
      </Field>
    );
  };

  return (
    <Section
      style={[style, className]}
      title={ci18n(
        "Attributes associated with current product category",
        "**Category Attributes**",
      )}
      tooltip={i`Click [here](${merchFeUrl(
        "/md/products/categories",
      )}) to learn more about category attribute definitions. `}
      markdown
      {...sectionProps}
    >
      <Layout.FlexColumn alignItems="stretch">
        <Layout.GridRow
          templateColumns={"1fr 1fr"}
          smallScreenTemplateColumns={"1fr"}
          gap={4}
        >
          {taxonomyAttributes
            .filter((attr) => !attr.isVariationAttribute)
            .map((attr) => renderAttribute(attr))}
        </Layout.GridRow>
        <Field
          title={ci18n(
            "Input label, lets merchant upload image of the size chart for a product listing",
            "Size chart",
          )}
          key={Constants.TAXONOMY.sizeChartImgAttrName}
          style={styles.field}
        >
          <ImageUploadGroup
            style={styles.input}
            maxSizeMB={10}
            maxImages={1}
            onImagesChanged={(images: ReadonlyArray<ImageInfo>) => {
              updateSubcategoryAttributes({
                attrName: Constants.TAXONOMY.sizeChartImgAttrName,
                attrValue: images.length ? [images[0].url] : undefined,
              });
            }}
            cleanImageEnabled={false}
            images={imageInfos}
            imageWidth={ImageWidth}
            data-cy="size-chart"
          />
        </Field>
      </Layout.FlexColumn>
    </Section>
  );
};

export default observer(CategoryAttributes);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          margin: 5,
          minWidth: 0,
        },
        input: {
          minWidth: 0,
        },
      }),
    [],
  );
