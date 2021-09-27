/*
 *
 * Variations.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { Button } from "@ContextLogic/lego";
import { StaggeredFadeIn, CheckboxField } from "@ContextLogic/lego";
import { ConfirmationModal } from "@merchant/component/core/modal";

import VariationsForm from "./variations/VariationsForm";
import VariationsTable from "./variations/VariationsTable";
import AddVariationModal from "./variations/AddVariationModal";
import MSRPCard from "@plus/component/products/edit-product/right-cards/MSRPCard";
import ParentSkuCard from "@plus/component/products/edit-product/right-cards/ParentSkuCard";

const CardSpacing = 25;

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const Variations: React.FC<Props> = (props: Props) => {
  const { style, className, editState, ...sectionProps } = props;

  const styles = useStylesheet();
  const hasSavedColorOrSizeVariation = editState.savedVariations.some(
    (v) => v.size != null || v.color != null
  );
  const { hasColorOrSizeVariations: checked, isSubmitting } = editState;
  return (
    <Section
      className={css(style, className)}
      title={i`**Variations** (optional)`}
      markdown
      contentStyle={{ padding: "none" }}
      rightCard={
        checked ? (
          <div className={css(styles.rightSide)}>
            <ParentSkuCard
              className={css(styles.rightCard)}
              editState={editState}
            />
            <MSRPCard className={css(styles.rightCard)} editState={editState} />
          </div>
        ) : undefined
      }
      {...sectionProps}
    >
      <div className={css(styles.content)}>
        {editState.isNewProduct && (
          <>
            <CheckboxField
              title={i`This product has multiple colors and/or sizes`}
              onChange={(checked) => {
                if (checked) {
                  editState.setHasSizeAndColorVariations(true);
                  return;
                }

                const clearSizeAndColorVariation = () =>
                  editState.setHasSizeAndColorVariations(false);

                if (editState.variationsList.length > 0) {
                  new ConfirmationModal(
                    i`Are you sure you want to discard the colors and size variations?`
                  )
                    .setHeader({ title: i`Confirm` })
                    .setCancel(i`Cancel`)
                    .setAction(i`Yes, discard`, async () =>
                      clearSizeAndColorVariation()
                    )
                    .render();
                } else {
                  clearSizeAndColorVariation();
                }
              }}
              checked={checked}
              disabled={
                (checked && hasSavedColorOrSizeVariation) || isSubmitting
              }
            />
            {editState.hasColorOrSizeVariations && (
              <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
                <VariationsForm
                  editState={editState}
                  className={css(styles.form)}
                />
              </StaggeredFadeIn>
            )}
          </>
        )}
        {!editState.isNewProduct && (
          <Button
            onClick={() => new AddVariationModal({ editState }).render()}
            style={styles.addVariation}
            disabled={isSubmitting}
          >
            Add variation
          </Button>
        )}
      </div>

      {editState.hasColorOrSizeVariations && (
        <VariationsTable editState={editState} />
      )}
    </Section>
  );
};

export default observer(Variations);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 15,
        },
        form: {
          marginTop: 15,
        },
        addVariation: {
          alignSelf: "flex-start",
          padding: "7px 25px",
        },
        rightCard: {
          marginBottom: CardSpacing,
        },
        rightSide: {
          display: "flex",
          flexDirection: "column",
        },
      }),
    []
  );
};
