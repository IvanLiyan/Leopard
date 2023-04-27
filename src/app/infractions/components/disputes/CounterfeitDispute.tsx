import React, { useState } from "react";
import { observer } from "mobx-react";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Accordion from "@infractions/components/Accordion";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import HorizontalField, {
  Props as HorizontalFieldProps,
} from "@infractions/components/HorizontalField";
import { FormSelect, Layout, TextInput } from "@ContextLogic/lego";
import SecureFileInput, { Attachment } from "@core/components/SecureFileInput";
import ModalFooter from "@core/components/modal/ModalFooter";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useMutation, useQuery } from "@apollo/client";
import {
  SubmitDisputeMutationResponse,
  SubmitDisputeMutationVariables,
  SUBMIT_DISPUTE_MUTATION,
} from "@infractions/api/submitDisputeMutation";
import { useToastStore } from "@core/stores/ToastStore";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { ci18n } from "@core/toolkit/i18n";
import { Checkbox } from "@mui/material";
import Markdown from "../Markdown";
import {
  TaggingQueryResponse,
  TAGGING_QUERY,
} from "@infractions/api/taggingQuery";
import { useDeciderKey } from "@core/stores/ExperimentStore";

const CounterfeitDispute: React.FC = () => {
  const { decision: submitTagIds, isLoading: tagsDeciderKeyLoading } =
    useDeciderKey("use_category_id_MERSUP-254");
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id: infractionId, actions },
    refetchInfraction,
  } = useInfractionContext();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const [checkA, setCheckA] = useState(false);
  const [checkB, setCheckB] = useState(false);
  const [checkC, setCheckC] = useState(false);

  const [category, setCategory] = useState<string | undefined>(undefined);
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined);
  const [productName, setProductName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [explanation, setExplanation] = useState<string | undefined>(undefined);
  const [documentation, setDocumentation] = useState<ReadonlyArray<Attachment>>(
    [],
  );

  const { data, loading: tagsQueryLoading } =
    useQuery<TaggingQueryResponse>(TAGGING_QUERY);
  const tags = data?.platformConstants.topLevelTags ?? [];

  const [submitDispute, { loading: mutationLoading }] = useMutation<
    SubmitDisputeMutationResponse,
    SubmitDisputeMutationVariables
  >(SUBMIT_DISPUTE_MUTATION);

  const onSubmit = async () => {
    try {
      const resp = await submitDispute({
        variables: {
          action: "LISTING_LEVEL_DISPUTE",
          infractionId,
          disputeInput: {
            category,
            subcategory,
            productName,
            description,
            explanation,
            disputeProof:
              documentation.length > 0
                ? documentation.map(({ url, fileName }) => ({
                    url,
                    fileName,
                  }))
                : undefined,
          },
        },
      });

      if (!resp.data?.policy?.merchantWarning?.upsertMerchantWarning?.ok) {
        toastStore.negative(
          resp.data?.policy?.merchantWarning?.upsertMerchantWarning?.message ??
            ci18n("error message", "Something went wrong."),
        );
      } else {
        toastStore.positive(i`Your dispute was successfully submitted.`, {
          deferred: true,
        });
        refetchInfraction();
        await navigationStore.navigate(`/warnings/warning?id=${infractionId}`);
      }
    } catch {
      toastStore.negative(ci18n("error message", "Something went wrong."));
    }
  };

  const hFieldProps: Partial<HorizontalFieldProps> = {
    titleWidth: 200,
  };

  const canDispute = actions.includes("DISPUTE");
  const canSubmit =
    checkA &&
    checkB &&
    checkC &&
    !!category &&
    !!subcategory &&
    !!productName &&
    !!explanation &&
    documentation.length > 0;

  return (
    <Accordion
      defaultExpanded
      title={ci18n("section heading", "Dispute Details")}
    >
      <div className={css(styles.column, { padding: 20 })}>
        {canDispute ? (
          <>
            <Heading variant="h5" sx={{ paddingTop: "6px" }}>
              Confirm the following before we review your listing
            </Heading>
            <div>
              <Layout.FlexRow>
                <Checkbox
                  checked={checkA}
                  onChange={(event) => {
                    setCheckA(event.target.checked);
                  }}
                  data-cy="product-incorrectly-taken-down-check"
                />
                <Text>
                  The product as shown in the listing was incorrectly taken down
                  for a Counterfeit and/or IP Violation
                </Text>
              </Layout.FlexRow>
              <Layout.FlexRow>
                <Checkbox
                  checked={checkB}
                  onChange={(event) => {
                    setCheckB(event.target.checked);
                  }}
                  data-cy="product-is-authentic-check"
                />
                <Text>
                  The product in this listing is authentic and/or authorized and
                  as described
                </Text>
              </Layout.FlexRow>
              <Layout.FlexRow>
                <Checkbox
                  checked={checkC}
                  onChange={(event) => {
                    setCheckC(event.target.checked);
                  }}
                  data-cy="not-infringing-check"
                />
                <Text>
                  The listing does not infringe on one&apos;s Intellectual
                  Property
                </Text>
              </Layout.FlexRow>
            </div>
            <Heading variant="h5" sx={{ padding: "6px 0px" }}>
              Provide product related information for this listing
            </Heading>
            <HorizontalField
              title={ci18n("title for field", "Product category")}
              {...hFieldProps}
            >
              <FormSelect
                selectedValue={category}
                onSelected={(value: string) => {
                  setCategory(value);
                }}
                options={tags.map(({ id, name }) => ({
                  value: submitTagIds ? id : name,
                  text: name,
                }))}
                placeholder={ci18n("placeholder for input", "Product category")}
                disabled={tagsQueryLoading || tagsDeciderKeyLoading}
                data-cy="product-category"
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n("title for field", "Product subcategory")}
              {...hFieldProps}
            >
              <TextInput
                value={subcategory}
                onChange={({ text }) => {
                  setSubcategory(text);
                }}
                placeholder={ci18n(
                  "placeholder for input",
                  "Product subcategory",
                )}
                data-cy="product-subcategory"
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Provide an accurate and concise name for this product",
              )}
              {...hFieldProps}
            >
              <TextInput
                value={productName}
                onChange={({ text }) => {
                  setProductName(text);
                }}
                placeholder={ci18n("placeholder for input", "Product name")}
                data-cy="product-name"
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Describe this product in a few sentences",
              )}
              {...hFieldProps}
            >
              <TextInput
                isTextArea
                canResize
                height={91}
                value={description}
                onChange={({ text }) => {
                  setDescription(text);
                }}
                placeholder={ci18n("placeholder for input", "Describe product")}
                data-cy="product-description"
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Explain why this product and/or listing complies with Wish policies",
              )}
              {...hFieldProps}
            >
              <TextInput
                isTextArea
                canResize
                height={91}
                value={explanation}
                onChange={({ text }) => {
                  setExplanation(text);
                }}
                placeholder={ci18n("placeholder for input", "Describe")}
                data-cy="explanation"
              />
            </HorizontalField>
            <Heading variant="h5" sx={{ padding: "6px 0px" }}>
              Upload documentation
            </Heading>
            <Markdown
              style={{ fontSize: "14px" }}
              text={i`Please upload additional documentation to support why your product or product listing complies with Wish's policies.${"\n\n"}Documentation may include a [DCMA counter-notice form](${"https://merchant.wish.com/static/assets/docs/DMCA_Counter_Notice_Form.pdf"}), proof of purchase, or proof of intellectual property rights. [Learn more](${"https://www.wish.com/intellectual-property#copyright-policy"})`}
            />
            <SecureFileInput
              accepts=".pdf,.jpeg,.jpg,.png"
              maxSizeMB={5}
              maxAttachments={5}
              attachments={documentation}
              onAttachmentsChanged={(attachments) => {
                setDocumentation(attachments);
              }}
              bucket="TEMP_UPLOADS_V2"
              data-cy="documentation-upload"
            />
          </>
        ) : (
          <Text>
            You cannot create a new dispute for this infraction at this time
          </Text>
        )}
      </div>
      <ModalFooter
        action={
          canDispute
            ? {
                text: ci18n("CTA for button", "Submit"),
                onClick: onSubmit,
                isDisabled: mutationLoading || !canSubmit,
                "data-cy": "submit-button",
              }
            : undefined
        }
        cancel={{
          text: ci18n("CTA for button", "Cancel"),
          href: `/warnings/warning?id=${infractionId}`,
          disabled: mutationLoading,
          "data-cy": "cancel-button",
        }}
      />
    </Accordion>
  );
};

export default observer(CounterfeitDispute);
