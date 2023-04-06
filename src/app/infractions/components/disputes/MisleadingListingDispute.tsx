import React, { useState } from "react";
import { observer } from "mobx-react";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Accordion from "@infractions/components/Accordion";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import HorizontalField, {
  Props as HorizontalFieldProps,
} from "@infractions/components/HorizontalField";
import {
  CurrencyInput,
  FormSelect,
  Layout,
  TextInput,
} from "@ContextLogic/lego";
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
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import {
  TaggingQueryResponse,
  TAGGING_QUERY,
} from "@infractions/api/taggingQuery";
import { CountryCode } from "@schema";
import countries from "@core/toolkit/countries";

/*
  NOTE: street address 2, 3, and state are temporarily disabled.
  BE will support them soon, and then we can re-enable them.
  Leaving the code for expediency in bringing them back (already tested,
    works with GQL).
*/

const MisleadingListingDispute: React.FC = () => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id: infractionId, actions },
    merchantCurrency,
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
  const [photos, setPhotos] = useState<ReadonlyArray<Attachment>>([]);
  const [variationCount, setVariationCount] = useState<number | undefined>(
    undefined,
  );
  const [variationsSameProduct, setVariationsSameProduct] = useState<
    boolean | undefined
  >(undefined);
  const [variationsSamePrice, setVariationsSamePrice] = useState<
    boolean | undefined
  >(undefined);
  const [actualCost, setActualCost] = useState<number | undefined>(undefined);
  const [productPrice, setProductPrice] = useState<number | undefined>(
    undefined,
  );
  const [vendorName, setVendorName] = useState<string | undefined>(undefined);
  const [vendorStreetAddress, setVendorStreetAddress] = useState<
    string | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vendorStreetAddress2, setVendorStreetAddress2] = useState<
    string | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vendorStreetAddress3, setVendorStreetAddress3] = useState<
    string | undefined
  >(undefined);
  const [vendorCity, setVendorCity] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vendorState, setVendorState] = useState<string | undefined>(undefined);
  const [vendorZip, setVendorZip] = useState<string | undefined>(undefined);
  const [vendorCountry, setVendorCountry] = useState<CountryCode | undefined>(
    undefined,
  );
  const [vendorAreaCode, setVendorAreaCode] = useState<string | undefined>(
    undefined,
  );
  const [vendorPhoneNumber, setVendorPhoneNumber] = useState<
    string | undefined
  >(undefined);
  const [proofOfPurchase, setProofOfPurchase] = useState<
    ReadonlyArray<Attachment>
  >([]);

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
            variationCount,
            variationsSameProduct,
            variationsSamePrice,
            cost: {
              currencyCode: merchantCurrency,
              amount: actualCost ?? 0, // validation won't allow this to be sent
            },
            retailPrice: {
              currencyCode: merchantCurrency,
              amount: productPrice ?? 0, // validation won't allow this to be sent
            },
            vendorAddress: {
              name: vendorName ?? "", // validation won't allow this to be sent
              streetAddress1: vendorStreetAddress ?? "", // validation won't allow this to be sent
              streetAddress2: vendorStreetAddress2,
              streetAddress3: vendorStreetAddress3,
              city: vendorCity ?? "", // validation won't allow this to be sent
              state: vendorState ?? "", // validation won't allow this to be sent
              zipcode: vendorZip,
              countryCode: vendorCountry,
              phoneNumber: `${vendorAreaCode}${vendorPhoneNumber}`,
            },
            disputeProof:
              proofOfPurchase.length > 0
                ? proofOfPurchase.map(({ url, fileName }) => ({
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
    titleWidth: 290,
  };

  const canDispute = actions.includes("DISPUTE");
  const canSubmit =
    checkA &&
    checkB &&
    checkC &&
    category != undefined &&
    subcategory != undefined &&
    productName != undefined &&
    description != undefined &&
    explanation != undefined &&
    photos.length > 0 &&
    variationCount != undefined &&
    variationsSameProduct != undefined &&
    variationsSamePrice != undefined &&
    actualCost != undefined &&
    productPrice != undefined &&
    vendorName != undefined &&
    vendorStreetAddress != undefined &&
    vendorCity != undefined &&
    vendorZip != undefined &&
    vendorCountry != undefined &&
    vendorAreaCode != undefined &&
    vendorPhoneNumber != undefined &&
    proofOfPurchase.length > 0;

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
                <Text>
                  The product was incorrectly taken down for Misleading Listing
                </Text>
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
                  The listing accurately represents the product being sold
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
                options={tags.map(({ name }) => ({
                  value: name,
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
                accepts=".pdf,.jpeg,.jpg,.png"
                maxSizeMB={5}
                maxAttachments={5}
                attachments={photos}
                onAttachmentsChanged={(attachments) => {
                  setPhotos(attachments);
                }}
                bucket="TEMP_UPLOADS_V2"
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "How many variations (Unique SKUs) are listed for this product (Parent SKU)?",
              )}
              {...hFieldProps}
            >
              <TextInput
                type="number"
                value={variationCount}
                onChange={({ text }) => {
                  setVariationCount(parseInt(text));
                }}
                placeholder={ci18n(
                  "placeholder for input",
                  "Total number of variations",
                )}
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Are all the variations (Unique SKUs) for the same product (Parent SKU)?",
              )}
              {...hFieldProps}
            >
              <Layout.FlexRow alignItems="center">
                <Radio
                  checked={variationsSameProduct === true}
                  onChange={() => {
                    setVariationsSameProduct(true);
                  }}
                />
                <Text variant="bodyL" sx={{ marginRight: "24px" }}>
                  Yes
                </Text>
                <Radio
                  checked={variationsSameProduct === false}
                  onChange={() => {
                    setVariationsSameProduct(false);
                  }}
                />
                <Text variant="bodyL">No</Text>
              </Layout.FlexRow>
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Did you upload the same product price for all the variations (Unique SKUs) of this product?",
              )}
              {...hFieldProps}
            >
              <Layout.FlexRow alignItems="center">
                <Radio
                  checked={variationsSamePrice === true}
                  onChange={() => {
                    setVariationsSamePrice(true);
                  }}
                />
                <Text variant="bodyL" sx={{ marginRight: "24px" }}>
                  Yes
                </Text>
                <Radio
                  checked={variationsSamePrice === false}
                  onChange={() => {
                    setVariationsSamePrice(false);
                  }}
                />
                <Text variant="bodyL">No</Text>
              </Layout.FlexRow>
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "What is the actual cost for each product?",
              )}
              {...hFieldProps}
            >
              <CurrencyInput
                currencyCode={merchantCurrency}
                value={actualCost}
                onChange={({ textAsNumber }) => {
                  setActualCost(textAsNumber ?? undefined);
                }}
                placeholder={ci18n("placeholder for input", "Unit cost")}
                hideCheckmarkWhenValid
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "What is the product price you set for this product?",
              )}
              {...hFieldProps}
            >
              <CurrencyInput
                currencyCode={merchantCurrency}
                value={productPrice}
                onChange={({ textAsNumber }) => {
                  setProductPrice(textAsNumber ?? undefined);
                }}
                placeholder={ci18n("placeholder for input", "Selling price")}
                hideCheckmarkWhenValid
              />
            </HorizontalField>
            <Heading variant="h5" sx={{ paddingTop: "6px" }}>
              Provide manufacturer details and proof of purchase
            </Heading>
            <HorizontalField
              title={ci18n("title for field", "Manufacturer or vendor name")}
              {...hFieldProps}
            >
              <TextInput
                value={vendorName}
                onChange={({ text }) => {
                  setVendorName(text);
                }}
                placeholder={ci18n(
                  "placeholder for input",
                  "Manufacturer name",
                )}
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n("title for field", "Manufacturer or vendor address")}
              {...hFieldProps}
            >
              <Layout.FlexColumn>
                <TextInput
                  value={vendorStreetAddress}
                  onChange={({ text }) => {
                    setVendorStreetAddress(text);
                  }}
                  placeholder={ci18n("placeholder for input", "Street address")}
                  style={{ marginBottom: "6px" }}
                />
                {/* <TextInput
                  style={{ marginTop: "6px" }}
                  value={vendorStreetAddress2}
                  onChange={({ text }) => {
                    setVendorStreetAddress2(text);
                  }}
                  placeholder={ci18n(
                    "placeholder for input",
                    "Street address 2",
                  )}
                />
                <TextInput
                  style={{ marginTop: "6px", marginBottom: "6px" }}
                  value={vendorStreetAddress3}
                  onChange={({ text }) => {
                    setVendorStreetAddress3(text);
                  }}
                  placeholder={ci18n(
                    "placeholder for input",
                    "Street address 3",
                  )}
                /> */}
                <Layout.FlexRow>
                  <TextInput
                    style={{ marginRight: "6px", flex: 1 }}
                    value={vendorCity}
                    onChange={({ text }) => {
                      setVendorCity(text);
                    }}
                    placeholder={ci18n("placeholder for input", "City")}
                  />
                  {/* <TextInput
                    style={{ marginRight: "6px", flex: 1 }}
                    value={vendorState}
                    onChange={({ text }) => {
                      setVendorState(text);
                    }}
                    placeholder={ci18n(
                      "placeholder for input",
                      "State / Province",
                    )}
                  /> */}
                  <TextInput
                    style={{ marginRight: "6px", maxWidth: "140px" }}
                    value={vendorZip}
                    onChange={({ text }) => {
                      setVendorZip(text);
                    }}
                    placeholder={ci18n(
                      "placeholder for input",
                      "ZIP / Postal code",
                    )}
                  />
                  <FormSelect
                    style={{
                      width: "140px",
                      ":nth-child(1n) > *": {
                        maxWidth: 140,
                      },
                    }}
                    selectedValue={vendorCountry}
                    onSelected={(value: CountryCode) => {
                      setVendorCountry(value);
                    }}
                    options={Object.entries(countries)
                      .filter(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ([countryCode, country]) =>
                          countryCode !== "D" && countryCode !== "EU",
                      )
                      .map(([countryCode, country]) => ({
                        value: countryCode as CountryCode,
                        text: country,
                      }))}
                    placeholder={ci18n("placeholder for input", "Country")}
                  />
                </Layout.FlexRow>
              </Layout.FlexColumn>
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Manufacturer or vendor phone number",
              )}
              {...hFieldProps}
            >
              <Layout.FlexRow>
                <TextInput
                  type="number"
                  style={{ marginRight: "6px", width: "100px" }}
                  value={vendorAreaCode}
                  onChange={({ text }) => {
                    setVendorAreaCode(text);
                  }}
                  placeholder={ci18n("placeholder for input", "Area code")}
                />
                <TextInput
                  type="number"
                  style={{ flex: 1 }}
                  value={vendorPhoneNumber}
                  onChange={({ text }) => {
                    setVendorPhoneNumber(text);
                  }}
                  placeholder={ci18n("placeholder for input", "Phone number")}
                />
              </Layout.FlexRow>
            </HorizontalField>
            <HorizontalField
              title={ci18n("title for field", "Upload proof of purchase")}
              {...hFieldProps}
            >
              <SecureFileInput
                accepts=".pdf,.jpeg,.jpg,.png"
                maxSizeMB={5}
                attachments={proofOfPurchase}
                onAttachmentsChanged={(attachments) => {
                  setProofOfPurchase(attachments);
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
                text: ci18n("CTA for button", "Submit"),
                onClick: onSubmit,
                isDisabled: mutationLoading || !canSubmit,
              }
            : undefined
        }
        cancel={{
          text: ci18n("CTA for button", "Cancel"),
          href: `/warnings/warning?id=${infractionId}`,
          disabled: mutationLoading,
        }}
      />
    </Accordion>
  );
};

export default observer(MisleadingListingDispute);
