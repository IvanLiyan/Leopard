import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import trim from "lodash/trim";
import { Field, FormSelect, Option } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";
import Section, { SectionProps } from "./Section";
import AddEditProductState, {
  createCustomsLogistics,
} from "@add-edit-product/AddEditProductState";
import { ContestWarningType } from "@schema";
import {
  ContestWarningOptionOrder,
  ContestWarningDisplayNames,
} from "@add-edit-product/toolkit";
import { ChemicalStartCharsToIgnoreSorting } from "@add-edit-product/ca-prop-65-chemicals";
import { ci18n } from "@core/toolkit/i18n";
import SearchableMultiselect from "@core/components/SearchableMultiselect";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import OptionalDocumentationUpload from "./ComplianceDocuments";
import ProductContents from "./ProductContents";
import { Heading, Stack } from "@ContextLogic/atlas-ui";
import Markdown from "@core/components/Markdown";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly state: AddEditProductState;
};

const ContestWarningOptions: ReadonlyArray<Option<ContestWarningType>> =
  ContestWarningOptionOrder.map((value) => ({
    value,
    text: ContestWarningDisplayNames[value],
  }));

const ComplianceV2: React.FC<Props> = ({
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
    updateDefaultCustomsLogistics,
    customsLogisticsDefault,
    hasVariations,
  } = state;

  const learnMoreLink = zendeskURL("360025359874");
  const learnMoreLink_CE = zendeskURL("21421618424603");
  const p65Description =
    i`If you ship products to California, you may be required to ` +
    i`provide California Proposition 65 information. [Learn more](${learnMoreLink})`;
  const docDescription = i`You are encouraged to use the field below to upload any compliance documentation, including any laboratory results, testing or certificates, that may be relevant to or relate to the product you are listing for sale.`;
  const docDescription_forUS = i`If you are  selling the product into the State of California in the United States, and it may contain an ingredient or compound on the California Prop 65 List (The Proposition 65 List - OEHHA (ca.gov)), you can use this field to upload these compliance documents.`;
  const docDescription_forCE = i`If you offer products with health, safety, or environmental conformity requirements, upload the conformity documentation here. This information may be provided to market surveillance authorities upon request. In your product listing, provide the applicable marking or labeling for the jurisdictions in which the product is marketed (e.g. CE, KC, and/or FCC mark).`;
  const ceMarkingDescription =
    i`If you ship products to EU you may be required to ` +
    i`provide CE marking information. [Learn more](${learnMoreLink_CE})`;

  const sortedChems = useMemo(() => {
    const stripPrefixes = (c: string): string => {
      return trim(c, ChemicalStartCharsToIgnoreSorting.join(""));
    };

    return [...caProp65AllChemicalsList].sort((a, b) =>
      stripPrefixes(a).toUpperCase() > stripPrefixes(b).toUpperCase() ? 1 : -1,
    );
  }, [caProp65AllChemicalsList]);

  const {
    decision: showComplianceDocumentsUploadFlow,
    isLoading: dKeyIsLoading,
  } = useDeciderKey("show_compliance_documents_upload");

  return (
    <Section
      className={css(style, className)}
      title={ci18n(
        "Title of a card on the product upload/edit page in which merchants can set or adjust settings related to legal compliance for a product",
        "Compliance",
      )}
      {...sectionProps}
    >
      <Stack direction="column" alignItems="stretch" sx={{ gap: "16px" }}>
        <Heading variant="h4">
          {ci18n(
            "Product add/edit form compliance section header",
            "California Prop 65 warning",
          )}
        </Heading>
        <Markdown>{p65Description}</Markdown>
        <Stack direction="row" sx={{ gap: "16px" }}>
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
        </Stack>
        {!hasVariations && (
          <>
            <Heading variant="h4">
              {ci18n(
                "Product add/edit form compliance section header",
                "Product contents",
              )}
            </Heading>
            <ProductContents
              onUpdate={updateDefaultCustomsLogistics}
              data={customsLogisticsDefault || createCustomsLogistics()}
              disabled={isSubmitting}
              data-cy="compliance"
            />
          </>
        )}
        <Heading variant="h4">
          {ci18n(
            "Product add/edit form compliance section header",
            "CE marking",
          )}
        </Heading>
        <Markdown>{ceMarkingDescription}</Markdown>
        {showComplianceDocumentsUploadFlow && !dKeyIsLoading && (
          <>
            <Heading variant="h4">
              {ci18n(
                "Product add/edit form compliance section header",
                "Compliance documentation",
              )}
            </Heading>
            <Markdown>{docDescription}</Markdown>
            <li>
              <span className={css(styles.markdownFont)}>
                {docDescription_forUS}
              </span>
            </li>
            <li>
              <span className={css(styles.markdownFont)}>
                {docDescription_forCE}
              </span>
            </li>
            <OptionalDocumentationUpload />
            <span className={css(styles.markdownFont)}>
              {i`File format accepted: `}
              <b>PDF, DOC, DOCX, PNG, JPG</b>
            </span>
            <span className={css(styles.markdownFont)}>
              {i`Max file size `}
              <b>10 MB</b>
            </span>
            <span className={css(styles.markdownFont)}>
              {i`Max character limit: `}
              <b>
                40{" "}
                {ci18n(
                  "Description in upload file limit prompt text",
                  "characters",
                )}
              </b>
            </span>
          </>
        )}
      </Stack>
    </Section>
  );
};

export default observer(ComplianceV2);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        warningField: {
          flex: "1 0 324px",
          maxWidth: 324,
        },
        chemField: {
          flex: 1,
          overflow: "hidden",
          minWidth: 0,
        },
        markdownFont: {
          fontSize: 14,
          color: "#0E161C",
        },
      }),
    [],
  );
};
