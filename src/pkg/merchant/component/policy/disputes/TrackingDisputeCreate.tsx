import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import moment from "moment-timezone";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { BackButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { HorizontalField } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

import { CountrySelect } from "@merchant/component/core";
import { Accordion } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Link } from "@ContextLogic/lego";
import { Label } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import CountryNames from "@toolkit/countries";
import {
  UrlValidator,
  RequiredValidator,
  DateFormatValidator,
} from "@toolkit/validators";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

/* Toolkit */
import DateSanityValidator from "@toolkit/disputes/DateSanityValidator";

import { CountryCode } from "@toolkit/countries";
import { CountryType } from "@merchant/component/core/CountrySelect";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import NavigationStore from "@merchant/stores/NavigationStore";
import DimenStore from "@merchant/stores/DimenStore";
import { StateField } from "@merchant/component/core";

type TrackingDisputeCreateProps = BaseProps & {
  readonly orderId: string;
  readonly trackingId?: string | null | undefined;
  readonly shippingCarrier?: string | null | undefined;
  readonly trackingModifiedDate?: string | null | undefined;
  readonly wishFulfillmentTime?: string | null | undefined;
  readonly wishDeliveredTime?: string | null | undefined;
  readonly fineAmount?: number | null | undefined;
  readonly fineCurrency?: string | null | undefined;
  readonly confirmExptectedDeadline?: string | null | undefined;
  readonly deliverExpectedDeadline?: string | null | undefined;
  readonly customerCountry?: string | null | undefined;
  readonly customerState?: string | null | undefined;
  readonly pastTrackingId?: string | null | undefined;
  readonly pastShippingCarrier?: string | null | undefined;
  readonly pastCarrierLastUpdated?: string | null | undefined;
  readonly trackingNumberModifiedAfterFine?: boolean | null | undefined;
};

@observer
class TrackingDisputeCreate extends Component<TrackingDisputeCreateProps> {
  @observable
  warningStatus: "accepted" | "declined" | "none" = "none";

  @observable
  orderSectionExpanded = true;

  @observable
  basicSectionExpanded = true;

  @observable
  proofSectionExpanded = true;

  @observable
  reportedFulfillmentDate: string | null | undefined;

  @observable
  isReportedFulfillmentDateValid = false;

  @observable
  reportedDeliveredDate: string | null | undefined = null;

  @observable
  isReportedDeliveredDateValid = false;

  @observable
  reportedCountry: CountryCode | null | undefined;

  @observable
  reportedState: string | null | undefined;

  @observable
  link: string | null | undefined;

  @observable
  isLinkValid = false;

  @observable
  screenshotFile:
    | { url: string; original_filename: string }
    | null
    | undefined = null;

  @observable
  screenshotAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  isLoading = false;

  @observable
  reportedFulfillmentDateQualifiedReversedFineMessage:
    | string
    | null
    | undefined;

  @observable
  reportedDeliveredDateQualifiedReversedFineMessage: string | null | undefined;

  @observable
  reportedDatesEqualToExistingMessage: string | null = null;

  @computed
  get isReportedCountryValid() {
    return this.reportedCountry !== null;
  }

  @computed
  get isReportedCountryMatchedCustomer() {
    const { customerCountry } = this.props;
    return (
      customerCountry == null ||
      this.reportedCountry == null ||
      customerCountry == this.reportedCountry
    );
  }

  @computed
  get isReportedStateValid() {
    return this.reportedCountry !== "US" || this.reportedState !== null;
  }

  @computed
  get isReportedStateMatchedCustomer() {
    const {
      reportedState,
      props: { customerState },
    } = this;
    if (reportedState == null) {
      return true;
    }

    return (
      customerState == null ||
      customerState.toUpperCase() === reportedState.toUpperCase()
    );
  }

  @computed
  get hasFine() {
    const { fineAmount } = this.props;
    return fineAmount != null;
  }

  @computed
  get isScreenshotFileValid() {
    return this.screenshotFile !== null;
  }

  async reportedFulfillmentDateQualifiedReversedFineCheck() {
    const { trackingNumberModifiedAfterFine } = this.props;
    // skip check for this case
    if (trackingNumberModifiedAfterFine) {
      return null;
    }
    const { fulfillmentDateValidator, reportedFulfillmentDate } = this;
    const msg = await fulfillmentDateValidator.deadlineMeetsWarning(
      reportedFulfillmentDate,
    );
    this.reportedFulfillmentDateQualifiedReversedFineMessage = msg;
  }

  async reportedDeliveredDateQualifiedReversedFineCheck() {
    const { trackingNumberModifiedAfterFine } = this.props;

    // skip check for this case
    if (trackingNumberModifiedAfterFine) {
      return null;
    }
    const { deliveredDateValidator, reportedDeliveredDate } = this;
    const msg = await deliveredDateValidator.deadlineMeetsWarning(
      reportedDeliveredDate,
    );
    this.reportedDeliveredDateQualifiedReversedFineMessage = msg;
  }

  @action
  reportedDatesEqualToExistingCheck = () => {
    const { wishFulfillmentTime, wishDeliveredTime } = this.props;
    let msg: string | null = null;
    if (
      this.isReportedCountryMatchedCustomer &&
      this.isReportedStateMatchedCustomer &&
      this.reportedFulfillmentDate !== null &&
      wishFulfillmentTime !== null
    ) {
      const reportedFulfillmentMoment = moment.utc(
        this.reportedFulfillmentDate,
        "MM/DD/YYYY",
      );
      const wishFulfillmentMoment = moment.utc(
        wishFulfillmentTime,
        "MM-DD-YYYY",
      );

      if (
        reportedFulfillmentMoment.isSame(wishFulfillmentMoment, "day") &&
        this.reportedDeliveredDate === null
      ) {
        msg =
          i`Confirmed fulfillment date matches ` +
          i`existing confirmed fulfillment date on this order.`;
      } else if (
        this.reportedDeliveredDate !== null &&
        wishDeliveredTime !== null
      ) {
        const reportedDeliveredMoment = moment.utc(
          this.reportedDeliveredDate,
          "MM/DD/YYYY",
        );
        const wishDeliveredMoment = moment.utc(wishDeliveredTime, "MM-DD-YYYY");

        if (
          reportedFulfillmentMoment.isSame(wishFulfillmentMoment, "day") &&
          reportedDeliveredMoment.isSame(wishDeliveredMoment, "day")
        ) {
          msg =
            i`Confirmed fulfillment and delivered dates match ` +
            i`the existing confirmed fulfillment and delivered dates on this order.`;
        }
      }
    }
    this.reportedDatesEqualToExistingMessage = msg;
  };

  @computed
  get countryOptions(): ReadonlyArray<CountryType> {
    const countryNamesPartial = _.cloneDeep(CountryNames) as Partial<
      typeof CountryNames
    >;
    delete countryNamesPartial.HK;
    delete countryNamesPartial.TW;
    countryNamesPartial.CN = i`Mainland China`;
    const topCountries: CountryCode[] = [
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
    ];

    let remainingCountryCodes: CountryCode[] = (
      Object.keys(countryNamesPartial) as ReadonlyArray<CountryCode>
    ).filter((cc) => !topCountries.includes(cc));

    remainingCountryCodes = _.sortBy(
      remainingCountryCodes,
      (cc) => CountryNames[cc],
    );

    const countryCodes: CountryCode[] = [
      ...topCountries,
      ...remainingCountryCodes,
    ];
    return countryCodes.map((countryCode) => {
      const countryName = CountryNames[countryCode];
      return {
        name: countryName,
        cc: countryCode,
      };
    });
  }

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get fulfillmentDateValidator() {
    const {
      wishFulfillmentTime,
      trackingModifiedDate,
      confirmExptectedDeadline,
    } = this.props;
    return new DateSanityValidator({
      fieldName: i`confirmed fulfillment date`,
      sysDate: wishFulfillmentTime || "",
      trackingModifiedDate: trackingModifiedDate || "",
      expectedDeadline: confirmExptectedDeadline,
    });
  }

  @computed
  get deliveredDateValidator() {
    const { wishDeliveredTime, trackingModifiedDate, deliverExpectedDeadline } =
      this.props;
    return new DateSanityValidator({
      fieldName: i`confirmed delivered date`,
      sysDate: wishDeliveredTime || "",
      trackingModifiedDate: trackingModifiedDate || "",
      expectedDeadline: deliverExpectedDeadline,
    });
  }

  @computed
  get urlValidator() {
    return new UrlValidator();
  }

  @computed
  get dateFormatValidator() {
    return new DateFormatValidator();
  }

  @computed
  get canSubmit() {
    return (
      (this.reportedDeliveredDate == null ||
        this.isReportedDeliveredDateValid) &&
      this.isReportedFulfillmentDateValid &&
      this.isLinkValid &&
      this.isReportedCountryValid &&
      this.isReportedStateValid &&
      this.isScreenshotFileValid &&
      this.reportedDatesEqualToExistingMessage === null
    );
  }

  @action
  onClickSubmit = () => {
    const { orderId } = this.props;
    const {
      reportedFulfillmentDate,
      reportedDeliveredDate,
      reportedCountry,
      reportedState,
      link,
      screenshotFile,
    } = this;
    const navigationStore = NavigationStore.instance();

    if (
      reportedFulfillmentDate == null ||
      link == null ||
      screenshotFile == null
    ) {
      return;
    }

    new ConfirmationModal(
      i`Are you sure you want to submit the tracking dispute?`,
    )
      .setHeader({
        title: i`Submit tracking dispute`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Yes, submit`, async () => {
        this.isLoading = true;

        try {
          const resp = await disputeApi
            .submitTrackingDispute({
              order_id: orderId,
              // BE handler require diff format
              reported_fulfillment_date: moment
                .utc(reportedFulfillmentDate, "MM/DD/YYYY")
                .format("DD/MM/YYYY"),
              reported_delivered_date:
                reportedDeliveredDate == null
                  ? ""
                  : moment
                      .utc(reportedDeliveredDate, "MM/DD/YYYY")
                      .format("DD/MM/YYYY"),
              reported_country: reportedCountry,
              reported_state: reportedState,

              link,
              dispute_type: "lcp",
              screenshot_file: JSON.stringify(screenshotFile),
            })
            .call();
          const disputeId = resp.data?.tracking_dispute_id;
          if (disputeId) {
            navigationStore.navigate(`/tracking-dispute/${disputeId}`);
          }
        } catch (e) {
          this.isLoading = false;
          return;
        }
      })
      .render();
  };

  @computed
  get pageX(): string | number {
    const { pageGuideX } = DimenStore.instance();
    return pageGuideX;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        display: "flex",
        flexDirection: "column",
        padding: `20px ${this.pageX} 100px ${this.pageX}`,
      },
      title: {
        color: palettes.textColors.Ink,
        marginBottom: 25,
        fontSize: 25,
        lineHeight: 1.33,
      },
      warningBox: {
        marginTop: 14,
      },
      form: {
        display: "flex",
        flexDirection: "column",
      },
      formSection: {
        display: "flex",
        flexDirection: "column",
      },
      sectionContent: {
        display: "flex",
        flexDirection: "column",
        "@media (max-width: 900px)": {
          padding: `0px 20px`,
        },
        "@media (min-width: 900px)": {
          padding: 0,
        },
      },
      textWithLabel: {
        display: "flex",
        flexDirection: "row",
      },
      label: {
        marginLeft: 8,
      },
      headerLink: {
        marginTop: 17,
        fontSize: 18,
      },
      field: {
        ":first-child": {
          marginTop: 40,
        },
        ":not(:first-child)": {
          marginTop: 20,
        },
        marginBottom: 20,
        paddingRight: 28,
      },
      alert: {
        marginBottom: 20,
      },
      countryField: {
        maxWidth: 260,
      },
      stateField: {
        maxWidth: 200,
      },
      table: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 24,
        marginRight: 24,
      },
      dateField: {
        maxWidth: 260,
      },
      fileInput: {
        flex: 1,
      },
      fileContainer: {
        display: "flex",
        flexDirection: "column",
      },
      agreebox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      },
      agreebutton: {
        marginRight: 4,
      },
      bottomSection: {
        display: "flex",
        padding: "25px 25px",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      uploadInstructions: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 300,
        padding: "7px 0px 7px 0px",
      },
      uploadNote: {
        lineHeight: 1.33,
        fontSize: 12,
        marginBottom: 5,
        alignSelf: "flex-start",
      },
    });
  }

  renderColumns() {
    if (!this.hasFine) {
      return [
        <Table.LinkColumn
          title={i`Order ID`}
          columnKey="orderId"
          align="left"
          href={({ value }) => `/order/${value}`}
          text={({ value }) => value}
          openInNewTab
        />,
        <Table.Column
          title={i`Dispute Type`}
          columnKey="disputeType"
          align="left"
        />,
        <Table.LinkColumn
          title={i`Policy`}
          columnKey="policy"
          align="left"
          href="/policy/fulfillment#5.5"
          text={({ value }) => value}
          openInNewTab
        />,
      ];
    }
    const { fineCurrency } = this.props;
    return [
      <Table.LinkColumn
        title={i`Order ID`}
        columnKey="orderId"
        align="left"
        href={({ value }) => `/order/${value}`}
        text={({ value }) => value}
        openInNewTab
      />,
      <Table.Column
        title={i`Dispute Type`}
        columnKey="disputeType"
        align="left"
      />,
      <Table.CurrencyColumn
        title={i`Penalty Amount`}
        columnKey="fineAmount"
        align="left"
        currencyCode={fineCurrency || "USD"}
      />,
      <Table.LinkColumn
        title={i`Policy`}
        columnKey="policy"
        align="left"
        href="/policy/fulfillment#5.5"
        text={({ value }) => value}
        openInNewTab
      />,
      <Table.LinkColumn
        title={i`Action`}
        columnKey="link"
        align="left"
        href={({ row }) =>
          `/penalties/orders?fine_types=11&order_id=${row.orderId}`
        }
        text={i`View Penalties`}
        openInNewTab
      />,
    ];
  }

  @computed
  get tableRows() {
    const { orderId, fineAmount } = this.props;
    return [
      {
        orderId,
        disputeType: i`Tracking Dispute`,
        fineAmount,
        policy: i`Late Confirm Fulfillment`,
        link: "",
      },
    ];
  }

  renderHead() {
    const { orderId } = this.props;
    return (
      this.warningStatus !== "accepted" && (
        <WelcomeHeader
          title={i`Select a type of dispute`}
          body={
            i`Please select a type of dispute you want to submit for ` +
            i`the order. Once a type of dispute is selected, you can ` +
            i`submit documents that support your dispute. `
          }
          illustration="submitDispute"
          paddingX={this.pageX}
        >
          <Link
            className={css(this.styles.headerLink)}
            href={`/order/${orderId}`}
            openInNewTab
          >
            View Order
          </Link>
        </WelcomeHeader>
      )
    );
  }

  renderOrderSection() {
    return (
      <Card style={{ marginBottom: 20 }}>
        <Accordion
          header={i`Order Details`}
          isOpen={this.orderSectionExpanded}
          onOpenToggled={(isOpen) => (this.orderSectionExpanded = isOpen)}
          backgroundColor={palettes.textColors.White}
        >
          <Table className={css(this.styles.table)} data={this.tableRows}>
            {this.renderColumns()}
          </Table>
        </Accordion>
      </Card>
    );
  }

  renderAgreeSection() {
    return (
      <div className={css(this.styles.sectionContent)}>
        <HorizontalField
          title={
            i`Do you want to update the confirmed fulfillment ` +
            i`information of this order?`
          }
          popoverContent={
            i`Confirmed fulfillment information ` +
            i`includes confirmed fulfilled date, ` +
            i`confirmed delivery destination and tracking ` +
            i`information from the shipping carrier's site. `
          }
          titleWidth={545}
        >
          <div className={css(this.styles.agreebox)}>
            <SecondaryButton
              onClick={() => {
                this.warningStatus = "accepted";
              }}
              padding="7px 60px"
              className={css(this.styles.agreebutton)}
              type="default"
            >
              Yes
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                this.warningStatus = "declined";
              }}
              padding="7px 60px"
              type="default"
            >
              No
            </SecondaryButton>
          </div>
        </HorizontalField>
        {this.warningStatus === "declined" && (
          <div className={css(this.styles.warningBox)}>
            <Alert
              text={
                i`You are not eligible to submit the dispute based ` +
                i`on the information provided.`
              }
              sentiment="negative"
            />
          </div>
        )}
      </div>
    );
  }

  renderBasicReadOnlySection() {
    const {
      trackingId,
      shippingCarrier,
      pastTrackingId,
      pastShippingCarrier,
      pastCarrierLastUpdated,
      trackingNumberModifiedAfterFine,
    } = this.props;
    return (
      <>
        <Accordion
          header={i`Tracking details`}
          onOpenToggled={() => {}}
          isOpen
          hideChevron
          backgroundColor={palettes.textColors.White}
        >
          <div className={css(this.styles.sectionContent)}>
            <HorizontalField
              title={i`Tracking id`}
              className={css(this.styles.field)}
            >
              <div className={css(this.styles.textWithLabel)}>
                {trackingNumberModifiedAfterFine ? pastTrackingId : trackingId}
                {trackingNumberModifiedAfterFine && (
                  <Label
                    textColor="#2fb7ec"
                    fontSize={12}
                    className={css(this.styles.label)}
                    backgroundColor="#cef2fd"
                  >
                    Has been penalized
                  </Label>
                )}
              </div>
            </HorizontalField>
            <HorizontalField
              title={i`Shipping carrier`}
              className={css(this.styles.field)}
            >
              {trackingNumberModifiedAfterFine
                ? pastShippingCarrier
                : shippingCarrier}
            </HorizontalField>
          </div>
        </Accordion>
        {trackingNumberModifiedAfterFine && (
          <Accordion
            header={i`Updated tracking details`}
            onOpenToggled={() => {}}
            isOpen
            hideChevron
            backgroundColor={palettes.textColors.White}
          >
            <div className={css(this.styles.sectionContent)}>
              <HorizontalField
                title={i`Current tracking id`}
                className={css(this.styles.field)}
              >
                <div className={css(this.styles.textWithLabel)}>
                  {trackingId}
                  <Label
                    textColor="white"
                    fontSize={12}
                    className={css(this.styles.label)}
                    backgroundColor="#2fb7ec"
                  >
                    Current
                  </Label>
                </div>
              </HorizontalField>
              <HorizontalField
                title={i`Current shipping carrier`}
                className={css(this.styles.field)}
              >
                {shippingCarrier}
              </HorizontalField>
              <HorizontalField
                title={i`Date updated`}
                className={css(this.styles.field)}
              >
                {pastCarrierLastUpdated}
              </HorizontalField>
            </div>
          </Accordion>
        )}
      </>
    );
  }

  renderBasicInputSection() {
    return (
      <Accordion
        header={
          i`Provide proof that the order was correctly` +
          i` shipped and delivered`
        }
        isOpen={this.basicSectionExpanded}
        onOpenToggled={(isOpen) => (this.basicSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={
              i`Link to the carrier's site that includes the ` +
              i`tracking information`
            }
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              validators={[this.requiredValidator, this.urlValidator]}
              onChange={({ text }: OnTextChangeEvent) => {
                this.link = text;
              }}
              value={this.link}
              placeholder={i`Enter carrier site URL`}
              onValidityChanged={(isValid) => {
                this.isLinkValid = isValid;
              }}
              focusOnMount
            />
          </HorizontalField>
          <HorizontalField
            title={
              i`Screenshot of the tracking information from the ` +
              i`carrier’s site`
            }
            className={css(this.styles.field)}
          >
            <div className={css(this.styles.fileContainer)}>
              <DEPRECATEDFileInput
                bucket="TEMP_UPLOADS"
                disabled={this.isLoading}
                className={css(this.styles.fileInput)}
                accepts=".jpeg,.jpg,.png,.pdf"
                maxAttachments={1}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  this.screenshotAttachments = attachments;
                  if (attachments.length > 0) {
                    this.screenshotFile = attachments[0].serverParams;
                  } else {
                    this.screenshotFile = null;
                  }
                }}
                maxSizeMB={2}
                attachments={this.screenshotAttachments}
              />
            </div>
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  renderEvidenceSection() {
    const { customerCountry, customerState } = this.props;
    return (
      <Accordion
        header={i`Provide correct tracking information`}
        isOpen={this.proofSectionExpanded}
        onOpenToggled={(isOpen) => (this.proofSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={i`Select the destination country for delivery`}
            popoverContent={i`Please select this order's destination country. `}
            className={css(this.styles.field)}
          >
            <div className={css(this.styles.countryField)}>
              <CountrySelect
                onCountry={(countryCode: CountryCode | undefined) => {
                  this.reportedCountry = countryCode;
                  this.reportedState = null;
                  this.reportedDatesEqualToExistingCheck();
                }}
                disabled={this.isLoading}
                currentCountryCode={this.reportedCountry}
                countries={this.countryOptions}
              />
            </div>

            {!this.isReportedCountryMatchedCustomer && (
              <div className={css(this.styles.warningBox)}>
                <Alert
                  text={
                    i`The destination country does not match with ` +
                    i`country code of customer address: ${customerCountry}`
                  }
                  sentiment="warning"
                />
              </div>
            )}
          </HorizontalField>
          {this.reportedCountry === "US" && (
            <HorizontalField
              title={i`Select the destination state/province for delivery`}
              popoverContent={i`Please select this order's destination state.`}
              className={css(this.styles.field)}
            >
              <div className={css(this.styles.stateField)}>
                <StateField
                  currentState={this.reportedState}
                  disabled={this.isLoading}
                  height={40}
                  countryCode="US"
                  onState={(stateName) => {
                    this.reportedState = stateName;
                    this.reportedDatesEqualToExistingCheck();
                  }}
                />
              </div>
              {!this.isReportedStateMatchedCustomer && (
                <div className={css(this.styles.warningBox)}>
                  <Alert
                    text={
                      i`The destination state does not match with ` +
                      i`the state of customer address:${customerState}.`
                    }
                    sentiment="warning"
                  />
                </div>
              )}
            </HorizontalField>
          )}

          <HorizontalField
            title={i`Confirmed delivery date`}
            popoverContent={
              i`Please provide this order's confirmed delivery ` +
              i`date by the shipping carrier. `
            }
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              className={css(this.styles.dateField)}
              validators={[
                this.dateFormatValidator,
                this.deliveredDateValidator,
              ]}
              onChange={({ text }: OnTextChangeEvent) => {
                if (text.trim().length === 0) {
                  this.reportedDeliveredDate = null;
                } else {
                  this.reportedDeliveredDate = text;
                }
                this.reportedDatesEqualToExistingCheck();
              }}
              value={this.reportedDeliveredDate}
              placeholder={i`mm/dd/yyyy`}
              onValidityChanged={(isValid) => {
                this.isReportedDeliveredDateValid = isValid;
                this.reportedDeliveredDateQualifiedReversedFineCheck();
              }}
            />
            {this.reportedDeliveredDateQualifiedReversedFineMessage && (
              <div className={css(this.styles.warningBox)}>
                <Alert
                  text={this.reportedDeliveredDateQualifiedReversedFineMessage}
                  sentiment="warning"
                />
              </div>
            )}
          </HorizontalField>
          <HorizontalField
            title={i`Confirmed fulfillment date`}
            popoverContent={
              i`Please provide this order's confirmed ` +
              i`fulfillment date by the shipping carrier.`
            }
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              className={css(this.styles.dateField)}
              validators={[
                this.requiredValidator,
                this.dateFormatValidator,
                this.fulfillmentDateValidator,
              ]}
              value={this.reportedFulfillmentDate}
              onChange={({ text }: OnTextChangeEvent) => {
                this.reportedFulfillmentDate = text;
                this.reportedDatesEqualToExistingCheck();
              }}
              placeholder={i`mm/dd/yyyy`}
              onValidityChanged={(isValid) => {
                this.isReportedFulfillmentDateValid = isValid;
                this.reportedFulfillmentDateQualifiedReversedFineCheck();
              }}
            />
            {this.reportedFulfillmentDateQualifiedReversedFineMessage && (
              <div className={css(this.styles.warningBox)}>
                <Alert
                  text={
                    this.reportedFulfillmentDateQualifiedReversedFineMessage
                  }
                  sentiment="warning"
                />
              </div>
            )}
            {this.reportedDatesEqualToExistingMessage && (
              <div className={css(this.styles.warningBox)}>
                <Alert
                  text={this.reportedDatesEqualToExistingMessage}
                  sentiment="negative"
                />
              </div>
            )}
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  render() {
    const { orderId, trackingNumberModifiedAfterFine, className, style } =
      this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        {this.renderHead()}

        <div className={css(this.styles.content)}>
          {trackingNumberModifiedAfterFine && (
            <div className={css(this.styles.warningBox)}>
              <Alert
                text={
                  i`Your Late Confirmed Fulfillment penalty will ` +
                  i`not be reversed even if your dispute is approved ` +
                  i`because tracking information has been modified. `
                }
                sentiment="warning"
                className={css(this.styles.alert)}
                link={{ text: i`View policy`, url: `/policy/fulfillment#5.5` }}
              />
            </div>
          )}
          <Text weight="bold" className={css(this.styles.title)}>
            {this.warningStatus !== "accepted"
              ? i`Tracking Dispute`
              : i`Provide tracking dispute details`}
          </Text>
          {this.warningStatus === "accepted" && this.renderOrderSection()}
          {this.warningStatus !== "accepted" ? (
            this.renderAgreeSection()
          ) : (
            <Card>
              <div className={css(this.styles.form)}>
                <div className={css(this.styles.formSection)}>
                  {this.renderBasicReadOnlySection()}
                  {this.renderBasicInputSection()}
                  {this.renderEvidenceSection()}
                </div>

                <div className={css(this.styles.bottomSection)}>
                  <BackButton
                    href={`/tracking-dispute/v2/create/lcp/${orderId}`}
                    style={{ padding: "5px 60px" }}
                    disabled={this.isLoading}
                  >
                    Cancel Dispute
                  </BackButton>
                  <PrimaryButton
                    isLoading={this.isLoading}
                    onClick={this.onClickSubmit}
                    style={{ padding: "7px 60px" }}
                    isDisabled={!this.canSubmit}
                  >
                    Submit
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }
}
export default TrackingDisputeCreate;
