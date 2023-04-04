import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Legacy */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import {
  Layout,
  LoadingIndicator,
  FormSelect,
  H6,
  SecondaryButton,
  PrimaryButton,
  TextInput,
  Text,
  AttachmentInfo,
} from "@ContextLogic/lego";

import SecureFileInput from "@core/components/SecureFileInput";
import Row from "./Row";
import Section from "./Section";
import CountrySelect from "./CountrySelect";
import ShippingCarrierSelector from "./ShippingCarrierSelector";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  RegexBasedValidator,
  RequiredValidator,
  UrlValidator,
} from "@core/toolkit/validators";
import countries, { getCountryName } from "@core/toolkit/countries";
import { states } from "@ContextLogic/lego/toolkit/states";

/* Model */
import {
  ORDER_DETAILS_QUERY,
  OrderDetailsRequestData,
  OrderDetailsResponseData,
} from "./infraction-details";
import {
  PickedCountry,
  ReasonText,
  ReasonOptions,
  PickedMerchantWarningSchema,
  OrderInfractionType,
} from "./order-disputes";
import {
  CountryCode,
  OrderInfractionDisputeSubreason,
  FileInput,
  UsStateCode,
} from "@schema";
import InfractionDisputeState from "./InfractionDisputeState";

/* Merchant Store */
import { useTheme } from "@core/stores/ThemeStore";
import { useNavigationStore } from "@core/stores/NavigationStore";

type Props = BaseProps & {
  readonly orderId: string;
  readonly infraction: PickedMerchantWarningSchema;
  readonly countries: ReadonlyArray<PickedCountry>;
};

const supportingExplanationPopover = (
  reason?: OrderInfractionDisputeSubreason | null,
) => {
  if (reason === "NATIONAL_HOLIDAY") {
    return i`Please provide the name and date(s) of the observed national holiday`;
  } else if (reason === "NATURAL_DISASTER") {
    return (
      i`Please explain how the natural disaster affected your fulfillment operation ` +
      i`and dates of the occurrence`
    );
  } else if (reason === "RESHIP_PACKAGE") {
    return i`Why was the package reshipped? Can you provide support ticket pages?`;
  } else if (reason === "INCORRECT_TRACKING_INFO") {
    return i`Why was the shipment returned?`;
  } else if (reason === "SHIPMENT_STUCK_AT_CUSTOMS") {
    return i`Number of days shipment has been at customs`;
  } else if (reason === "AMBIGUOUS_CUSTOMER_ADDRESS") {
    return (
      i`Please explain how the customer address can be captured in multiple ways, with ` +
      i`examples`
    );
  }
  return null;
};

const warehouseImpactedPopover = (
  reason?: OrderInfractionDisputeSubreason | null,
) => {
  if (reason === "NATIONAL_HOLIDAY" || reason === "NATURAL_DISASTER") {
    return i`Country where the warehouse is located`;
  }
  return null;
};

const supportingDocumentPopover = (
  reason?: OrderInfractionDisputeSubreason | null,
) => {
  if (reason === "INCORRECT_CONFIRMED_FULFILLMENT_DATE") {
    return i`Screenshot of the tracking from carrier's site`;
  } else if (reason === "NATIONAL_HOLIDAY") {
    return (
      i`e.g. Screenshot of a news article about the national holiday, or screenshot of ` +
      i`the tracking on the carrier's site`
    );
  } else if (reason === "OPERATIONAL_OR_IT_ISSUE") {
    return (
      i`e.g. Screenshot of error message, screenshot of emails/notices/ announcements ` +
      i`from carriers, or screenshot of the tracking on the carrier's site`
    );
  } else if (
    reason === "RESHIP_PACKAGE" ||
    reason === "INCORRECT_TRACKING_INFO" ||
    reason === "SHIPMENT_RETURNED" ||
    reason === "SHIPMENT_STUCK_AT_CUSTOMS" ||
    reason === "AMBIGUOUS_CUSTOMER_ADDRESS" ||
    reason === "CAN_PROVIDE_CORRECT_TRACKING_INFO"
  ) {
    return (
      i`e.g. Screenshot of shipping label or screenshot of tracking on the carrier's ` +
      i`site`
    );
  } else if (reason === "NATURAL_DISASTER") {
    return (
      i`e.g. Screenshot of news articles about the national disaster or screenshot ` +
      i`showing the address of the warehouse impacted`
    );
  } else if (reason === "TECHNICAL_ISSUE") {
    return (
      i`e.g. Screenshot of error messages or screenshot of emails/notices/announcements ` +
      i`from carriers`
    );
  } else if (reason === "WISH_LOGISTICS_CANNOT_FULFILL") {
    return i`e.g. Screenshot of WishPost Customer Support exchange`;
  }
  return null;
};

const countryCodes = () => {
  const countryCodes = new Set(Object.keys(countries));
  countryCodes.delete("EU");
  countryCodes.delete("D");

  return Array.from(countryCodes);
};

const InfractionDisputeForm = (props: Props) => {
  const {
    className,
    style,
    orderId,
    countries: countriesShippedTo,
    infraction,
  } = props;
  const styles = useStylesheet();
  const navigation = useNavigationStore();
  const state = useMemo(
    () => new InfractionDisputeState({ infraction, orderId }),
    [infraction, orderId],
  );

  const [customerAddressProof, setCustomerAddressProof] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);
  const [invalidAddressProof, setInvalidAddressProof] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);
  const [uploadFiles, setUploadFiles] = useState<ReadonlyArray<AttachmentInfo>>(
    [],
  );

  const dateValidator = new RegexBasedValidator({
    pattern:
      /^(?:(0[1-9]|1[012])[/.](0[1-9]|[12][0-9]|3[01])[/.](19|20)[0-9]{2})$/,
    customMessage: i`Enter date in mm/dd/yyyy format`,
  });
  const requiredValidator = new RequiredValidator({
    customMessage: null,
  });
  const urlValidator = new UrlValidator();

  const reasonOptions = (
    state.infractionType
      ? // Reason for casting: state.infractionType is MerchantWarningReason which from the GQL.
        // OrderInfractionType is using a subset of that because this feature currently supports
        // order level infraction types only
        ReasonOptions[state.infractionType as OrderInfractionType]
      : []
  ).map((reason) => ({
    text: ReasonText[reason],
    value: reason,
  }));

  const { data, loading } = useQuery<
    OrderDetailsResponseData,
    OrderDetailsRequestData
  >(ORDER_DETAILS_QUERY, {
    variables: {
      id: orderId,
    },
  });

  if (data == null || loading) {
    return <LoadingIndicator style={[className, style]} />;
  }

  const {
    fulfillment: {
      order: { tracking, shippingDetails },
    },
  } = data;

  const onAttachmentChange = (
    attachments: ReadonlyArray<AttachmentInfo>,
  ): ReadonlyArray<FileInput> | null => {
    if (attachments.length === 0) {
      return null;
    }

    const files = attachments.map((attachment) => ({
      url: attachment.url,
      fileName: attachment.fileName,
    }));
    return files;
  };

  const onDisputeReasonChange = (value: OrderInfractionDisputeSubreason) => {
    state.clearInputs();
    state.disputeSubreason = value;
  };

  const disputeReason = state.disputeSubreason;

  const showFulfillDateField =
    disputeReason === "INCORRECT_CONFIRMED_FULFILLMENT_DATE";
  const showDeliveredDateField =
    state.infractionType === "ORDER_NOT_DELIVERED" ||
    state.infractionType === "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION";
  const showDeliveredDateFieldOptional =
    state.infractionType === "LATE_CONFIRMED_FULFILLMENT_VIOLATION" &&
    disputeReason === "INCORRECT_CONFIRMED_FULFILLMENT_DATE";
  const showDestinationCountry =
    disputeReason === "INCORRECT_CONFIRMED_FULFILLMENT_DATE" ||
    state.infractionType === "ORDER_NOT_DELIVERED";
  const showCarrierLinkField =
    (state.infractionType === "LATE_CONFIRMED_FULFILLMENT_VIOLATION" ||
      state.infractionType === "FAKE_TRACKING" ||
      state.infractionType === "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION" ||
      state.infractionType === "ORDER_NOT_DELIVERED") &&
    disputeReason !== "OTHER";
  const showCustomerAddressProofField =
    disputeReason === "UNVERIFIABLE_ADDRESS";
  const showWarehouseCountryField =
    disputeReason === "NATIONAL_HOLIDAY" ||
    disputeReason === "NATURAL_DISASTER";
  const showGenericField =
    disputeReason !== "INCORRECT_CONFIRMED_FULFILLMENT_DATE" &&
    disputeReason !== "CAN_PROVIDE_CORRECT_TRACKING_INFO" &&
    disputeReason !== "UNVERIFIABLE_ADDRESS" &&
    state.infractionType !== "ORDER_NOT_DELIVERED";
  const showUpdateTrackingFields =
    disputeReason === "CAN_PROVIDE_CORRECT_TRACKING_INFO";
  const showGenericUploadField = disputeReason !== "UNVERIFIABLE_ADDRESS";

  const showTrackingCarrier =
    state.infractionType === "LATE_CONFIRMED_FULFILLMENT_VIOLATION" ||
    state.infractionType === "FAKE_TRACKING" ||
    state.infractionType === "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION" ||
    state.infractionType === "ORDER_NOT_DELIVERED";
  const showConfirmedFulfillDate =
    state.infractionType === "LATE_CONFIRMED_FULFILLMENT_VIOLATION" ||
    state.infractionType === "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION" ||
    state.infractionType === "ORDER_NOT_DELIVERED";
  const showAddress =
    disputeReason === "UNVERIFIABLE_ADDRESS" ||
    disputeReason === "ADDRESS_PO_BOX";

  const renderShippingAddress = () => {
    if (!shippingDetails) {
      return null;
    }
    const { name, streetAddress1, city, state, zipcode } = shippingDetails;

    return (
      <Text>{`${name}, ${streetAddress1}, ${city}${state ? `, ${state}` : ``}${
        zipcode ? `, ${zipcode}` : ``
      }`}</Text>
    );
  };

  const showOrderDetails =
    showAddress ||
    (showTrackingCarrier && shippingDetails) ||
    (showConfirmedFulfillDate && tracking);

  const renderOrderDetails = () => {
    return (
      <>
        {showAddress && (
          <Row
            title={ci18n("Customer address", "Customer address")}
            underline={false}
            style={styles.row}
          >
            {renderShippingAddress()}
          </Row>
        )}
        {showTrackingCarrier && shippingDetails && (
          <>
            <Row
              title={ci18n("Tracking ID", "Tracking ID")}
              underline={false}
              style={styles.row}
            >
              {shippingDetails.trackingId}
            </Row>
            {shippingDetails.provider && (
              <Row
                title={ci18n("Shipping carrier", "Shipping carrier")}
                underline={false}
                style={styles.row}
              >
                {shippingDetails.provider.name}
              </Row>
            )}
          </>
        )}
        {showConfirmedFulfillDate && tracking && (
          <>
            {tracking.confirmedFulfillmentDate && (
              <Row
                title={i`Confirmed fulfillment date`}
                underline={false}
                style={styles.row}
              >
                {tracking.confirmedFulfillmentDate.formatted}
              </Row>
            )}
            {tracking.deliveredDate && (
              <Row
                title={i`Confirmed delivered date`}
                underline={false}
                style={styles.row}
              >
                {tracking.deliveredDate.formatted}
              </Row>
            )}
          </>
        )}
      </>
    );
  };

  const renderDisputeSupportFields = () => {
    return (
      <>
        {showFulfillDateField && (
          <Row
            title={i`Confirmed fulfillment date from shipping carrier`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
          >
            <TextInput
              placeholder={ci18n("date format", "mm/dd/yy")}
              style={styles.smallField}
              validators={[requiredValidator, dateValidator]}
              hideCheckmarkWhenValid
              value={state.reportedFulfillmentDate}
              onChange={({ text }) => (state.reportedFulfillmentDate = text)}
              onValidityChanged={(isValid) => (state.formDataValid = isValid)}
            />
          </Row>
        )}
        {showDeliveredDateFieldOptional && (
          <Row
            title={i`Confirmed delivered date from shipping carrier (optional)`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
          >
            <TextInput
              placeholder={ci18n("date format", "mm/dd/yy")}
              style={styles.smallField}
              validators={[dateValidator]}
              hideCheckmarkWhenValid
              value={state.reportedDeliveredDate}
              onChange={({ text }) => (state.reportedDeliveredDate = text)}
              onValidityChanged={(isValid) => (state.formDataValid = isValid)}
            />
          </Row>
        )}
        {showDeliveredDateField && (
          <Row
            title={i`Confirmed delivered date from shipping carrier`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
          >
            <TextInput
              placeholder={ci18n("date format", "mm/dd/yy")}
              style={styles.smallField}
              validators={[requiredValidator, dateValidator]}
              hideCheckmarkWhenValid
              value={state.reportedDeliveredDate}
              onChange={({ text }) => (state.reportedDeliveredDate = text)}
              onValidityChanged={(isValid) => (state.formDataValid = isValid)}
            />
          </Row>
        )}
        {showDestinationCountry && (
          <>
            <Row
              title={i`Destination country for delivery`}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
            >
              <CountrySelect
                placeholder={i`Select a country/region`}
                onCountry={(countryCode: CountryCode | undefined) => {
                  state.reportedDestinationCountryCode = countryCode;
                  state.showFormErrors = true;
                }}
                countries={countriesShippedTo.map((country) => ({
                  cc: country.code,
                  name: country.name,
                }))}
                error={
                  state.showFormErrors &&
                  state.reportedDestinationCountryCode == null
                }
                currentCountryCode={state.reportedDestinationCountryCode}
                style={[styles.fullField, styles.select]}
              />
            </Row>
            {state.reportedDestinationCountryCode === "US" && (
              <Row
                title={i`Select a state/province for delivery (optional)`}
                underline={false}
                style={styles.row}
                contentStyles={styles.field}
              >
                <FormSelect
                  placeholder={i`Select a state`}
                  options={Object.keys(states.US).map((state) => ({
                    value: state as UsStateCode,
                    text: states.US[state as UsStateCode],
                  }))}
                  selectedValue={state.reportedDestinationStateCode}
                  onSelected={(value: UsStateCode) => {
                    state.reportedDestinationStateCode = value;
                  }}
                  style={[styles.fullField, styles.select]}
                />
              </Row>
            )}
          </>
        )}

        {showUpdateTrackingFields && (
          <>
            <Row
              title={i`Correct tracking number`}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
            >
              <TextInput
                placeholder={i`Enter tracking number`}
                value={state.newTrackingNumber}
                onChange={({ text }) => (state.newTrackingNumber = text)}
                validators={[requiredValidator]}
                hideCheckmarkWhenValid
                showErrorMessages={false}
                style={styles.fullField}
              />
            </Row>
            <Row
              title={i`Shipped from country/region`}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
            >
              <CountrySelect
                placeholder={i`Select a country/region`}
                onCountry={(countryCode: CountryCode | undefined) => {
                  state.shippedFromCountryCode = countryCode;
                  state.showFormErrors = true;
                }}
                countries={countriesShippedTo.map((country) => ({
                  cc: country.code,
                  name: country.name,
                }))}
                error={
                  state.showFormErrors && state.shippedFromCountryCode == null
                }
                currentCountryCode={state.shippedFromCountryCode}
                style={[styles.fullField, styles.select]}
              />
            </Row>
            <Row
              title={ci18n("Shipping carrier", "Shipping carrier")}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
            >
              <ShippingCarrierSelector
                state={state}
                orderId={orderId}
                countryCode={state.shippedFromCountryCode}
                style={[styles.fullField, styles.select]}
              />
            </Row>
          </>
        )}
        {showCarrierLinkField && (
          <Row
            title={i`Link to the carrier's site that includes tracking information`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
          >
            <TextInput
              placeholder={i`Enter carrier site URL`}
              value={state.carrierSiteLink}
              onChange={({ text }) => (state.carrierSiteLink = text)}
              validators={[requiredValidator, urlValidator]}
              hideCheckmarkWhenValid
              showErrorMessages={false}
              style={styles.fullField}
            />
          </Row>
        )}
        {showGenericField && (
          <Row
            title={ci18n("Supporting explanation", "Supporting explanation")}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
            popoverContent={supportingExplanationPopover(disputeReason)}
          >
            <TextInput
              placeholder={ci18n("Describe reason", "Describe reason")}
              isTextArea
              canResize
              rows={4}
              value={state.message}
              onChange={({ text }) => (state.message = text)}
              validators={[requiredValidator]}
              hideCheckmarkWhenValid
              showErrorMessages={false}
              style={styles.fullField}
            />
          </Row>
        )}
        {showCustomerAddressProofField && (
          <>
            <Row
              title={i`Screenshot of customer's listed address`}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
              popoverContent={i`Go to Orders > History > Ship To, or Order Status page`}
            >
              <SecureFileInput
                accepts=".jpeg,.png,.pdf"
                bucket="TEMP_UPLOADS_V2"
                maxAttachments={1}
                maxSizeMB={5}
                attachments={customerAddressProof}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  const fileInput = onAttachmentChange(attachments);
                  setCustomerAddressProof(attachments);
                  state.customerAddressProof = fileInput;
                }}
                style={styles.fullField}
              />
            </Row>
            <Row
              title={i`Attach proof that the carrier can't ship to the customer's address`}
              underline={false}
              style={styles.row}
              contentStyles={styles.field}
              popoverContent={
                i`e.g. Screenshot of the error message from the shipping provider or screenshot ` +
                i`showing address cannot be found on map providers`
              }
            >
              <SecureFileInput
                accepts=".jpeg,.png,.pdf"
                bucket="TEMP_UPLOADS_V2"
                maxAttachments={1}
                maxSizeMB={5}
                attachments={invalidAddressProof}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  const fileInput = onAttachmentChange(attachments);
                  setInvalidAddressProof(attachments);
                  state.invalidAddressProof = fileInput;
                }}
                style={styles.fullField}
              />
            </Row>
          </>
        )}
        {showWarehouseCountryField && (
          <Row
            title={i`Warehouse country impacted`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
            popoverContent={warehouseImpactedPopover(disputeReason)}
          >
            <CountrySelect
              placeholder={i`Select a country/region`}
              onCountry={(countryCode: CountryCode | undefined) => {
                state.warehouseCountryCode = countryCode;
                state.showFormErrors = true;
              }}
              countries={countryCodes().map((countryCode) => ({
                cc: countryCode as CountryCode,
                name: getCountryName(countryCode as CountryCode),
              }))}
              currentCountryCode={state.warehouseCountryCode}
              error={state.showFormErrors && state.warehouseCountryCode == null}
              style={[styles.fullField, styles.select]}
            />
          </Row>
        )}
        {showGenericUploadField && (
          <Row
            title={i`Supporting document (optional)`}
            underline={false}
            style={styles.row}
            contentStyles={styles.field}
            popoverContent={supportingDocumentPopover(disputeReason)}
          >
            <SecureFileInput
              accepts=".jpeg,.png,.pdf"
              bucket="TEMP_UPLOADS_V2"
              maxAttachments={1}
              maxSizeMB={5}
              attachments={uploadFiles}
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                const fileInput = onAttachmentChange(attachments);
                setUploadFiles(attachments);
                state.uploadFiles = fileInput;
              }}
              style={styles.fullField}
            />
          </Row>
        )}
      </>
    );
  };

  const renderDisputeForm = () => {
    return (
      <Section
        title={ci18n("Dispute details", "Dispute details")}
        style={styles.card}
      >
        <Row
          title={ci18n("Dispute reason", "Dispute reason")}
          underline={false}
          style={styles.row}
          contentStyles={styles.field}
        >
          <FormSelect
            placeholder={ci18n("Please select", "Please select")}
            options={reasonOptions}
            selectedValue={state.disputeSubreason}
            onSelected={onDisputeReasonChange}
            style={[styles.fullField, styles.select]}
          />
        </Row>
        {state.disputeSubreason && (
          <>
            {showOrderDetails && (
              <Layout.FlexRow style={styles.subtitle}>
                <H6>Review order information received by Wish</H6>
              </Layout.FlexRow>
            )}
            {renderOrderDetails()}
            <Layout.FlexRow style={styles.subtitle}>
              <H6>
                Provide required order information that supports your dispute
              </H6>
            </Layout.FlexRow>
            {renderDisputeSupportFields()}
          </>
        )}
        <Layout.FlexRow justifyContent="space-between" style={styles.submit}>
          <SecondaryButton padding="5px 25px" onClick={() => navigation.back()}>
            {ci18n("Cancel dispute", "Cancel dispute")}
          </SecondaryButton>
          <PrimaryButton
            onClick={async () => await state.createDispute()}
            isDisabled={!state.isValid || state.isSubmitting}
          >
            {ci18n("Submit", "Submit")}
          </PrimaryButton>
        </Layout.FlexRow>
      </Section>
    );
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      {renderDisputeForm()}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          ":not(:first-child)": {
            marginTop: 32,
          },
        },
        row: {
          padding: "14px 24px",
        },
        subtitle: {
          padding: "14px 24px",
          borderTop: `1px solid ${borderPrimary}`,
          borderBottom: `1px solid ${borderPrimary}`,
          margin: "8px 0px",
        },
        submit: {
          padding: "34px 24px",
          borderTop: `1px solid ${borderPrimary}`,
        },
        field: {
          flex: 1,
        },
        smallField: {
          width: "50%",
        },
        fullField: {
          width: "100%",
        },
        select: {
          paddingLeft: 0,
        },
      }),
    [borderPrimary],
  );
};

export default observer(InfractionDisputeForm);
