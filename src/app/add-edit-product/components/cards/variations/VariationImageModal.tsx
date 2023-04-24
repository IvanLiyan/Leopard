/*
 * VariationImageModal.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal, { ModalProps } from "@core/components/modal/Modal";

import { Field, FormSelect, Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { useTheme } from "@core/stores/ThemeStore";
import AddEditProductState, {
  Variation,
  getVariationOptionValues,
} from "@add-edit-product/AddEditProductState";
import Image from "@core/components/Image";
import ModalTitle from "@core/components/modal/ModalTitle";

export type VariationImageModalProps = Pick<ModalProps, "open"> & {
  readonly state: AddEditProductState;
  readonly initiallySelectedVariation?: Variation | undefined;
  readonly onClose: () => unknown;
};

const ImageSize = 120;

const VariationImageModal: React.FC<VariationImageModalProps> = ({
  state,
  initiallySelectedVariation,
  open,
  onClose,
}) => {
  const [selectedVariationId, setSelectedVariationId] = useState<
    string | undefined
  >(
    initiallySelectedVariation == null
      ? undefined
      : initiallySelectedVariation.clientSideId,
  );
  const { images, variations, updateVariation } = state;

  const selectedVariation = useMemo(() => {
    if (selectedVariationId == null) {
      return undefined;
    }
    const matchingVariation = variations.find(
      ({ clientSideId }) => clientSideId == selectedVariationId,
    );
    return matchingVariation != null ? matchingVariation : undefined;
  }, [selectedVariationId, variations]);

  const selectedImageId =
    selectedVariation == null || selectedVariation.image == null
      ? null
      : selectedVariation.image.id;

  const styles = useStylesheet({
    hasSelectedVariation: selectedVariation != null,
  });

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalTitle title={i`Add image to variation`} onClose={onClose} />
      <Layout.FlexColumn alignItems="stretch" key={selectedVariationId}>
        <Field title={i`Variation`} style={styles.field}>
          {variations.length > 0 && (
            <FormSelect
              options={variations.map((variation) => ({
                value: variation.clientSideId,
                text: [
                  ...getVariationOptionValues(variation),
                  variation.size,
                  variation.color,
                  variation.sku,
                ]
                  .filter((attribute) => attribute != null)
                  .join(" / "),
                img: variation.image?.wishUrl,
              }))}
              placeholder={i`Select a variation`}
              onSelected={(value: string | null | undefined) =>
                setSelectedVariationId(value == null ? undefined : value)
              }
              selectedValue={selectedVariationId}
              data-cy="variation-image-select-variation"
              showArrow
            />
          )}
        </Field>

        <Text style={[styles.imageSectionTitle]} weight="semibold">
          Select an image
        </Text>
        <Layout.FlexColumn
          alignItems="flex-start"
          style={styles.imagesGridContainer}
        >
          <Layout.FlexRow style={styles.imagesGrid} alignItems="flex-start">
            {(images || []).map((image) => {
              const isSelected = selectedImageId == image.id;
              return (
                <Layout.FlexColumn
                  key={image.wishUrl}
                  style={[
                    styles.imageContainer,
                    isSelected ? styles.selected : styles.notSelected,
                  ]}
                  justifyContent="center"
                  alignItems="center"
                  onClick={
                    isSelected
                      ? undefined
                      : () => {
                          if (!selectedVariation) {
                            return;
                          }
                          updateVariation({
                            clientSideId: selectedVariation.clientSideId,
                            newProps: {
                              image,
                            },
                          });
                        }
                  }
                  data-cy={`variation-image-${image.id}`}
                >
                  <Image
                    className={css(styles.image)}
                    src={image.wishUrl}
                    draggable="false"
                    alt={i`product image`}
                  />
                </Layout.FlexColumn>
              );
            })}
          </Layout.FlexRow>
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = ({
  hasSelectedVariation,
}: {
  readonly hasSelectedVariation: boolean;
}) => {
  const { surfaceLight, primary, textDark, borderPrimary, surfaceLightest } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        field: {
          margin: 24,
          maxWidth: 300,
        },
        imagesGridContainer: {
          padding: 24,
          backgroundColor: surfaceLight,
          minHeight: 350,
          opacity: hasSelectedVariation ? 1 : 0.5,
        },
        imagesGrid: {
          gap: 16,
          flexWrap: "wrap",
        },
        imageContainer: {
          width: ImageSize,
          height: ImageSize,
          borderRadius: 4,
          backgroundColor: surfaceLightest,
          overflow: "hidden",
          boxSizing: "border-box",
        },
        image: {
          userSelect: "none",
          maxHeight: "100%",
          maxWidth: "100%",
        },
        selected: {
          border: `2px solid ${primary}`,
        },
        notSelected: {
          border: `solid 1px ${borderPrimary}`,
          cursor: hasSelectedVariation ? "pointer" : undefined,
        },
        imageSectionTitle: {
          fontSize: 14,
          color: textDark,
          cursor: "default",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          margin: "0px 24px 4px 24px",
          opacity: hasSelectedVariation ? 1 : 0.5,
        },
      }),
    [
      hasSelectedVariation,
      surfaceLight,
      primary,
      textDark,
      borderPrimary,
      surfaceLightest,
    ],
  );
};

export default observer(VariationImageModal);
