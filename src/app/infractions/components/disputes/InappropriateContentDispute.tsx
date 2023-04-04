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
import {
  TaggingQueryResponse,
  TAGGING_QUERY,
} from "@infractions/api/taggingQuery";

const InappropriateContentDispute: React.FC = () => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id: infractionId, title, actions },
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
  const [photos, setPhotos] = useState<ReadonlyArray<Attachment>>([]);

  const { data, loading: queryLoading } =
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
            photo:
              photos.length > 0
                ? photos.map(({ url, fileName }) => ({
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
    photos.length > 0;

  return (
    <Accordion
      defaultExpanded
      title={ci18n("section header", "Dispute Details")}
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
                />
                <Text>The product was incorrectly taken down for {title}</Text>
              </Layout.FlexRow>
              <Layout.FlexRow>
                <Checkbox
                  checked={checkB}
                  onChange={(event) => {
                    setCheckB(event.target.checked);
                  }}
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
                />
                <Text>
                  The product in this listing complies with Wish&apos;s polices
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
                  value: id,
                  text: name,
                }))}
                placeholder={ci18n("placeholder for input", "Product category")}
                disabled={queryLoading}
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
                placeholder={ci18n("placeholder for input", "Describe reason")}
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
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Upload original photos of the product",
              )}
              {...hFieldProps}
            >
              <SecureFileInput
                accepts=".pdf,.jpeg,.png"
                maxSizeMB={5}
                attachments={photos}
                onAttachmentsChanged={(attachments) => {
                  setPhotos(attachments);
                }}
                bucket="TEMP_UPLOADS_V2"
              />
            </HorizontalField>
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
                text: ci18n("CTA on button", "Submit"),
                onClick: onSubmit,
                isDisabled: mutationLoading || !canSubmit,
              }
            : undefined
        }
        cancel={{
          text: ci18n("CTA on button", "Cancel"),
          href: `/warnings/warning?id=${infractionId}`,
          disabled: mutationLoading,
        }}
      />
    </Accordion>
  );
};

export default observer(InappropriateContentDispute);
