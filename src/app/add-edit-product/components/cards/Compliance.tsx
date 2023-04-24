/*
 * Compliance.tsx
 *
 * Created by Jonah Dlin on Thu Mar 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import trim from "lodash/trim";

import {
  Field,
  Markdown,
  Layout,
  FormSelect,
  Option,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";

import Section, { SectionProps } from "./Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { ContestWarningType } from "@schema";
import {
  ContestWarningOptionOrder,
  ContestWarningDisplayNames,
} from "@add-edit-product/toolkit";
import { ChemicalStartCharsToIgnoreSorting } from "@add-edit-product/ca-prop-65-chemicals";
import { ci18n } from "@core/toolkit/i18n";
import SearchableMultiselect from "@core/components/SearchableMultiselect";
import { useTheme } from "@core/stores/ThemeStore";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly state: AddEditProductState;
};

const ContestWarningOptions: ReadonlyArray<Option<ContestWarningType>> =
  ContestWarningOptionOrder.map((value) => ({
    value,
    text: ContestWarningDisplayNames[value],
  }));

const Compliance: React.FC<Props> = ({
  style,
  className,
  state,
  ...sectionProps
}: Props) => {
  const styles = useStylesheet();
  const {
    caProp65Warning,
    caProp65Chemicals,
    isSubmitting,
    caProp65AllChemicalsList,
  } = state;

  const learnMoreLink = zendeskURL("360025359874");

  const sortedChems = useMemo(() => {
    const stripPrefixes = (c: string): string => {
      return trim(c, ChemicalStartCharsToIgnoreSorting.join(""));
    };

    return [...caProp65AllChemicalsList].sort((a, b) =>
      stripPrefixes(a).toUpperCase() > stripPrefixes(b).toUpperCase() ? 1 : -1,
    );
  }, [caProp65AllChemicalsList]);

  return (
    <Section
      className={css(style, className)}
      title={ci18n(
        "Title of a card on the product upload/edit page in which merchants can set or adjust settings related to legal compliance for a product",
        "Compliance (optional)",
      )}
      {...sectionProps}
    >
      <Layout.FlexColumn style={styles.content} alignItems="stretch">
        <Markdown
          style={styles.desc}
          text={
            i`If you ship products to California, you may be required to ` +
            i`provide California Proposition 65 information. [Learn more](${learnMoreLink})`
          }
        />
        <Layout.FlexRow style={styles.fields}>
          <Field
            style={styles.warningField}
            title={i`California Proposition 65 Warning Type`}
            description={
              i`Select the warning type applicable to your product, if any. You certify that ` +
              i`the warning selected satisfies legal requirements.`
            }
          >
            <FormSelect
              placeholder={i`Select the warning type`}
              options={ContestWarningOptions}
              selectedValue={caProp65Warning}
              onSelected={(value: ContestWarningType) =>
                (state.caProp65Warning = value)
              }
              disabled={isSubmitting}
              data-cy="select-warning-type"
            />
          </Field>
          <Field
            style={styles.chemField}
            title={i`California Proposition 65 Chemical Names`}
            description={
              i`Select the chemical name(s) applicable to your product, if any. If you ` +
              i`selected the Food, Furniture, or Chemical warning you must indicate a ` +
              i`chemical(s). You certify that the chemical(s) selected satisfy legal ` +
              i`requirements for your product.`
            }
          >
            <SearchableMultiselect
              placeholder={i`Select the chemical name(s)`}
              options={sortedChems.map((chem) => ({
                value: chem,
                key: chem.toUpperCase(),
              }))}
              selectedOptions={caProp65Chemicals || []}
              onSelectionChange={(newChems: ReadonlyArray<string>) =>
                (state.caProp65Chemicals = newChems)
              }
              disabled={isSubmitting}
              data-cy="multiselect-chemical-names"
            />
          </Field>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Section>
  );
};

export default observer(Compliance);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          gap: 24,
        },
        desc: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        fields: {
          gap: 16,
        },
        warningField: {
          flex: "1 0 324px",
          maxWidth: 324,
        },
        chemField: {
          flex: 1,
          overflow: "hidden",
          minWidth: 0,
        },
      }),
    [textDark],
  );
};
