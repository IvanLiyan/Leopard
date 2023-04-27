/*
 * Variations.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import Section, { SectionProps } from "./Section";
import {
  StaggeredFadeIn,
  CheckboxField,
  Divider,
  Layout,
} from "@ContextLogic/lego";
import ConfirmationModal from "@core/components/ConfirmationModal";

import VariationsForm from "./variations/VariationsForm";
import VariationsTable from "./variations/VariationsTable";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import AdditionalAttributes from "./variations/AdditionalAttributes";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const Variations: React.FC<Props> = (props: Props) => {
  const { style, className, state, ...sectionProps } = props;
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);

  const styles = useStylesheet();
  const {
    isSubmitting,
    variations,
    hasVariations,
    checkHasVariations,
    uncheckHasVariations,
    showVariationGroupingUI,
  } = state;

  return (
    <Section
      className={css(style, className)}
      title={i`**Variations** (optional)`}
      markdown
      contentStyle={{ padding: "none" }}
      rightCard={
        hasVariations ? <AdditionalAttributes state={state} /> : undefined
      }
      {...sectionProps}
    >
      <Layout.FlexColumn alignItems="stretch" style={styles.content}>
        <>
          <ConfirmationModal
            open={isDiscardModalOpen}
            title={ci18n("CTA text", "Confirm")}
            text={
              showVariationGroupingUI
                ? i`Are you sure you want to discard the variations?`
                : i`Are you sure you want to discard the colors and size variations?`
            }
            cancel={{
              text: ci18n("CTA text", "Cancel"),
              onClick: () => {
                setIsDiscardModalOpen(false);
              },
            }}
            action={{
              text: ci18n(
                "CTA text, discards unsaved modifications to product variations",
                "Yes, discard",
              ),
              onClick: () => {
                uncheckHasVariations();
                setIsDiscardModalOpen(false);
              },
            }}
          />
          <CheckboxField
            title={
              showVariationGroupingUI
                ? i`This product has multiple variations`
                : i`This product has multiple colors and/or sizes`
            }
            onChange={(checked) => {
              if (checked) {
                checkHasVariations();
                return;
              }

              if (variations.length > 0) {
                setIsDiscardModalOpen(true);
              } else {
                uncheckHasVariations();
              }
            }}
            checked={hasVariations}
            disabled={isSubmitting}
            data-cy="checkbox-has-variation"
          />
          {hasVariations && <Divider className={css(styles.divider)} />}
          {hasVariations && (
            <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
              <VariationsForm state={state} />
            </StaggeredFadeIn>
          )}
        </>
      </Layout.FlexColumn>

      {hasVariations && <VariationsTable state={state} />}
    </Section>
  );
};

export default observer(Variations);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        divider: {
          margin: "24px 0px",
        },
      }),
    [],
  );
};
