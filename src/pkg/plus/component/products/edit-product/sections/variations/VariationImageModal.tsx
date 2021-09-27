import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

import { Field, Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import ProductEditState, {
  VariationEditState,
} from "@plus/model/ProductEditState";
import { useTheme } from "@merchant/stores/ThemeStore";

export type VariationImageModalProps = {
  readonly editState: ProductEditState;
  readonly initiallySelectedVariation?: VariationEditState | undefined;
};

const Inset = 24;
const ImageSize = 120;

const VariationImageModalContent: React.FC<VariationImageModalProps> = observer(
  ({ editState, initiallySelectedVariation }: VariationImageModalProps) => {
    const [selectedVariationKey, setSelectedVariationKey] = useState<
      string | undefined
    >(initiallySelectedVariation?.key);
    const { images, variationsList } = editState;

    const selectedVariation = editState.getVariation({
      key: selectedVariationKey,
    });

    const selectedImageUrl = selectedVariation?.image?.wishUrl;

    const styles = useStylesheet({ selectedVariation: !!selectedVariation });
    return (
      <div className={css(styles.root)}>
        <Field title={i`Variation`} className={css(styles.field)}>
          <div className={css(styles.selectRow)}>
            {variationsList.length > 0 && (
              <Select
                options={variationsList.map((variation) => ({
                  value: variation.key,
                  text: [variation.size, variation.color, variation.sku]
                    .filter((t) => !!t)
                    .join(" / "),
                  img: variation.image?.wishUrl,
                }))}
                placeholder={i`Select a variation`}
                onSelected={(value) => setSelectedVariationKey(value)}
                selectedValue={selectedVariationKey}
                position="bottom left"
                minWidth={250}
                className={css(styles.select)}
              />
            )}
          </div>
        </Field>

        <div className={css(styles.field, styles.imageSectionTitle)}>
          Select an image
        </div>
        <div className={css(styles.imagesGrid)}>
          {(images || []).map((image) => {
            const isSelected = selectedImageUrl == image.wishUrl;
            return (
              <img
                key={image.wishUrl}
                className={css(
                  styles.image,
                  isSelected ? styles.selected : styles.notSelected
                )}
                src={image.wishUrl}
                onClick={
                  isSelected
                    ? undefined
                    : () => {
                        if (!selectedVariation) {
                          return;
                        }
                        selectedVariation.image = { ...image };
                      }
                }
                draggable="false"
              />
            );
          })}
        </div>
      </div>
    );
  }
);

const useStylesheet = ({
  selectedVariation,
}: {
  readonly selectedVariation: boolean;
}) => {
  const { surfaceLight, primary, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        field: {
          marginTop: 25,
          marginLeft: Inset,
        },
        selectRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        select: {
          marginRight: 20,
        },
        imagesGrid: {
          padding: Inset / 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          backgroundColor: surfaceLight,
          opacity: selectedVariation ? 1 : 0.5,
          minHeight: 350,
        },
        image: {
          width: ImageSize,
          height: ImageSize,
          margin: Inset / 2,
          objectFit: "cover",
        },
        selected: {
          border: `4px solid ${primary}`,
        },
        notSelected: {
          border: `0.5px solid ${borderPrimaryDark}`,
          cursor: selectedVariation ? "pointer" : undefined,
        },
        imageSectionTitle: {
          fontSize: 14,
          color: borderPrimaryDark,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginBottom: 5,
          opacity: selectedVariation ? 1 : 0.5,
        },
      }),
    [selectedVariation, surfaceLight, primary, borderPrimaryDark]
  );
};

export default class VariationImageModal extends Modal {
  constructor(props: VariationImageModalProps) {
    super((onClose) => <VariationImageModalContent {...props} />);

    this.setHeader({
      title: i`Add images to variations`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
  }
}
