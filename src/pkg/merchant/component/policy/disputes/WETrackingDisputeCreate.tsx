import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import { runInAction } from "mobx";

/* External Libraries */
import _ from "lodash";
import moment from "moment-timezone";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { Accordion } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { RadioGroup } from "@ContextLogic/lego";
import { CountrySelect } from "@merchant/component/core";
import { BackButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import CountryNames from "@toolkit/countries";
import {
  RequiredValidator,
  DateFormatValidator,
  UrlValidator,
} from "@toolkit/validators";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

/* Toolkit */
import DateSanityValidator from "@toolkit/disputes/DateSanityValidator";

import { StateField } from "@merchant/component/core";

import { CountryCode } from "@toolkit/countries";
import { CountryType } from "@merchant/component/core/CountrySelect";
import { Option } from "@ContextLogic/lego";
import { RadioOption } from "@ContextLogic/lego";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import DeviceStore from "@stores/DeviceStore";
import NavigationStore from "@stores/NavigationStore";

type WETrackingDisputeCreateProps = BaseProps & {
  readonly orderId: string;
  readonly trackingId?: string | null | undefined;
  readonly shippingCarrier?: string | null | undefined;
  readonly trackingModifiedDate?: string | null | undefined;
  readonly wishFulfillmentTime?: string | null | undefined;
  readonly wishDeliveredTime?: string | null | undefined;
  readonly fineAmount?: number | null | undefined;
  readonly weDisputeDay?: number | null | undefined;
  readonly fineCurrency?: string | null | undefined;
  readonly deliverExpectedDeadline?: string | null | undefined;
  readonly customerCountry?: string | null | undefined;
  readonly customerState?: string | null | undefined;
  readonly weLateReasonTextDict: {
    [type: string]: string;
  };
  readonly weReasonEnum: {
    [type: string]: number;
  };
  readonly disasterTimepointsTextDict?: {
    [type: string]: string;
  };
};

@observer
class WETrackingDisputeCreate extends Component<WETrackingDisputeCreateProps> {
  @observable
  formStatus: "normal" | "we-new" | "none" = "none";

  @observable
  weLateReason: string | null | undefined;

  @observable
  disasterReason: string | null | undefined;

  @observable
  orderConfirmedStatus: "accepted" | "rejected" | "none" = "none";

  @observable
  validProofStatus: "accepted" | "rejected" | "none" = "none";

  @observable
  orderSectionExpanded = true;

  @observable
  basicSectionExpanded = true;

  @observable
  proofSectionExpanded = true;

  @observable
  reportedFulfillmentDate: string | null | undefined;

  @observable
  reportedDeliveredDateQualifiedReversedFineMessage: string | null | undefined;

  @observable
  isReportedFulfillmentDateValid = false;

  @observable
  reportedDeliveredDate: string | null | undefined;

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
  note: string | null | undefined;

  @observable
  isNoteValid = false;

  @observable
  screenshotFile:
    | { url: string; original_filename: string }
    | null
    | undefined = null;

  @observable
  screenshotAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  isLoading = false;

  @computed
  get pageX(): string | number {
    const { pageGuideX } = DeviceStore.instance();
    return pageGuideX;
  }

  @computed
  get isReportedCountryValid() {
    return this.reportedCountry !== null;
  }

  @computed
  get disasterReasonsOptions(): ReadonlyArray<Option<string>> {
    const { disasterTimepointsTextDict } = this.props;
    if (!disasterTimepointsTextDict) {
      return [];
    }

    return Object.keys(disasterTimepointsTextDict).map((k) => {
      return { value: k, text: disasterTimepointsTextDict[k] };
    });
  }

  @computed
  get weLateReasonsOptions(): ReadonlyArray<RadioOption> {
    const { weLateReasonTextDict } = this.props;
    let options = Object.keys(weLateReasonTextDict).map((k) => {
      return { value: k, text: weLateReasonTextDict[k] };
    });
    options = [...options, { value: "", text: i`None of the reasons above` }];
    return options;
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
      Object.keys(countryNamesPartial) as CountryCode[]
    ).filter((cc: CountryCode) => !topCountries.includes(cc));

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
    const { wishFulfillmentTime, trackingModifiedDate } = this.props;
    return new DateSanityValidator({
      fieldName: i`confirmed fulfillment date`,
      sysDate: wishFulfillmentTime || "",
      trackingModifiedDate: trackingModifiedDate || "",
      expectedDeadline: null,
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

  async reportedDeliveredDateQualifiedReversedFineCheck() {
    const { deliveredDateValidator, reportedDeliveredDate } = this;
    const msg = await deliveredDateValidator.deadlineMeetsWarning(
      reportedDeliveredDate,
    );
    this.reportedDeliveredDateQualifiedReversedFineMessage = msg;
  }

  @computed
  get canSubmit() {
    const { weReasonEnum } = this.props;

    if (this.formStatus === "normal") {
      return (
        this.isReportedDeliveredDateValid &&
        this.isReportedFulfillmentDateValid &&
        this.isLinkValid &&
        this.isReportedCountryValid &&
        this.isReportedStateValid &&
        this.isScreenshotFileValid
      );
    } else if (this.formStatus === "we-new") {
      return (
        this.isLinkValid &&
        this.isNoteValid &&
        (this.weLateReason != String(weReasonEnum.NATURAL_DISASTER) ||
          this.disasterReason != null) &&
        this.isScreenshotFileValid
      );
    }
    return false;
  }

  @computed
  get submissionParams(): disputeApi.SubmitTrackingDisputeParams | null {
    const { orderId } = this.props;
    const {
      reportedFulfillmentDate,
      reportedDeliveredDate,
      reportedCountry,
      reportedState,
      link,
      screenshotFile,
      weLateReason,
      disasterReason,
      note,
    } = this;

    if (this.formStatus === "normal") {
      if (
        reportedFulfillmentDate != null &&
        reportedDeliveredDate != null &&
        reportedCountry != null &&
        link != null &&
        screenshotFile != null
      ) {
        return {
          order_id: orderId,
          // BE handler require diff format
          reported_fulfillment_date: moment
            .utc(reportedFulfillmentDate, "MM/DD/YYYY")
            .format("DD/MM/YYYY"),
          reported_delivered_date: moment
            .utc(reportedDeliveredDate, "MM/DD/YYYY")
            .format("DD/MM/YYYY"),
          reported_country: reportedCountry,
          reported_state: reportedState,
          dispute_type: "lcp",
          link,
          screenshot_file: JSON.stringify(screenshotFile),
        };
      }
    } else {
      if (
        link != null &&
        screenshotFile != null &&
        weLateReason != null &&
        note != null
      ) {
        return {
          order_id: orderId,
          new_we_reason: weLateReason,
          new_we_disaster_timepoint: disasterReason,
          extra_notes: note,
          dispute_type: "we",
          link,
          screenshot_file: JSON.stringify(screenshotFile),
        };
      }
    }

    return null;
  }

  @action
  onClickSubmit = () => {
    const navigationStore = NavigationStore.instance();
    const { submissionParams } = this;

    if (!submissionParams) {
      return null;
    }

    new ConfirmationModal(
      i`Are you sure you want to submit the Wish Express tracking dispute?`,
    )
      .setHeader({
        title: i`Submit tracking dispute`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Yes, submit`, async () => {
        this.isLoading = true;

        try {
          const resp = await disputeApi
            .submitTrackingDispute(submissionParams)
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
        fontWeight: fonts.weightBold,
        color: palettes.textColors.Ink,
        padding: "24px 0px",
        fontSize: 25,
        lineHeight: 1.33,
      },
      cardTitle: {
        fontWeight: fonts.weightBold,
        color: palettes.textColors.Ink,
        padding: "24px 24px",
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
          padding: "0px 20px",
        },
        "@media (min-width: 900px)": {
          padding: 0,
        },
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        color: palettes.textColors.Ink,
        marginBottom: 30,
        cursor: "default",
      },
      alert: {
        margin: "24px 0px",
      },
      headerLink: {
        marginTop: 17,
        fontSize: 18,
      },
      welcomeHead: {
        marginBottom: 24,
      },
      radioGroupField: {
        padding: 24,
      },
      field: {
        ":first-child": {
          paddingTop: 40,
        },
        ":not(:first-child)": {
          paddingTop: 20,
        },
        paddingBottom: 20,
        paddingRight: 28,
      },
      countryField: {
        maxWidth: 260,
      },
      disasterField: {
        maxWidth: 150,
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
      card: {
        marginBottom: 20,
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
          href={({ row }) => `/order/${row.orderId}`}
          text={({ row }) => `${row.orderId}`}
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
          href={`/policy/wish_express`}
          text={({ row }) => `${row.policy}`}
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
        href={({ row }) => `/order/${row.orderId}`}
        text={({ row }) => `${row.orderId}`}
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
        href={`/policy/wish_express`}
        text={({ row }) => `${row.policy}`}
        openInNewTab
      />,
      <Table.LinkColumn
        title={i`Action`}
        columnKey="link"
        align="left"
        href={({ row }) => `/penalties/orders?order_id=${row.orderId}`}
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
        policy: i`Wish Express`,
        link: "",
      },
    ];
  }

  renderHead() {
    const { orderId } = this.props;
    return (
      this.formStatus === "none" && (
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
      <Card className={css(this.styles.card)}>
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
    const { weDisputeDay } = this.props;
    return (
      <div>
        <div className={css(this.styles.warningBox)}>
          <Alert
            text={
              i`You have ${weDisputeDay} days left to submit a dispute for this order,` +
              i`and it will be subjected to a Wish Express late shipment penalty.`
            }
            link={{ text: i`View policy`, url: `/policy/wish_express` }}
            className={css(this.styles.alert)}
            sentiment="warning"
          />
        </div>
        <Card className={css(this.styles.card)}>
          <div className={css(this.styles.cardTitle)}>
            Wish Express tracking dispute
          </div>
          <HorizontalField
            title={i`Was your order confirmed delivered?`}
            className={css(this.styles.field)}
            titleWidth={285}
          >
            <div className={css(this.styles.agreebox)}>
              {this.orderConfirmedStatus === "accepted" ? (
                <PrimaryButton
                  onClick={() => {
                    this.formStatus = "normal";
                  }}
                  style={{ padding: "7px 60px" }}
                  className={css(this.styles.agreebutton)}
                >
                  Yes
                </PrimaryButton>
              ) : (
                <SecondaryButton
                  onClick={() => {
                    this.formStatus = "normal";
                  }}
                  type="default"
                  padding="7px 60px"
                  className={css(this.styles.agreebutton)}
                >
                  Yes
                </SecondaryButton>
              )}
              {this.orderConfirmedStatus === "rejected" ? (
                <PrimaryButton
                  onClick={() => {
                    this.orderConfirmedStatus = "rejected";
                  }}
                  style={{ padding: "7px 60px" }}
                >
                  No
                </PrimaryButton>
              ) : (
                <SecondaryButton
                  onClick={() => {
                    this.orderConfirmedStatus = "rejected";
                  }}
                  type="default"
                  padding="7px 60px"
                >
                  No
                </SecondaryButton>
              )}
            </div>
          </HorizontalField>
        </Card>
        {this.orderConfirmedStatus === "rejected" && (
          <Card className={css(this.styles.card)}>
            <div className={css(this.styles.cardTitle)}>
              Was your order not delivered because of any of the following
              reasons?
            </div>
            <RadioGroup
              onSelected={(value) => {
                this.weLateReason = value;
              }}
              className={css(this.styles.radioGroupField)}
              selectedValue={this.weLateReason}
            >
              {this.weLateReasonsOptions.map((option) => (
                <RadioGroup.Item
                  key={option.value}
                  value={option.value}
                  text={option.text}
                />
              ))}
            </RadioGroup>
          </Card>
        )}
        {this.weLateReason != null && this.weLateReason.trim().length > 0 && (
          <Card className={css(this.styles.card)}>
            <HorizontalField
              title={i`Can you provide valid proof for the reason you selected above?`}
              className={css(this.styles.field)}
              titleWidth={480}
            >
              <div className={css(this.styles.agreebox)}>
                {this.validProofStatus === "accepted" ? (
                  <PrimaryButton
                    onClick={() => {
                      runInAction(() => {
                        this.formStatus = "we-new";
                        this.validProofStatus = "accepted";
                      });
                    }}
                    style={{ padding: "7px 60px" }}
                    className={css(this.styles.agreebutton)}
                  >
                    Yes
                  </PrimaryButton>
                ) : (
                  <SecondaryButton
                    onClick={() => {
                      runInAction(() => {
                        this.formStatus = "we-new";
                        this.validProofStatus = "accepted";
                      });
                    }}
                    padding="7px 60px"
                    className={css(this.styles.agreebutton)}
                    type="default"
                  >
                    Yes
                  </SecondaryButton>
                )}
                {this.validProofStatus === "rejected" ? (
                  <PrimaryButton
                    onClick={() => {
                      this.validProofStatus = "rejected";
                    }}
                    style={{ padding: "7px 60px" }}
                  >
                    No
                  </PrimaryButton>
                ) : (
                  <SecondaryButton
                    onClick={() => {
                      this.validProofStatus = "rejected";
                    }}
                    padding="7px 60px"
                    type="default"
                  >
                    No
                  </SecondaryButton>
                )}
              </div>
            </HorizontalField>
          </Card>
        )}
        {((this.weLateReason && this.weLateReason.trim().length === 0) ||
          this.validProofStatus === "rejected") && (
          <div className={css(this.styles.warningBox)}>
            <Alert
              text={
                i`You are not eligible to submit the dispute based on ` +
                i`the information provided. If the Wish Express order was ` +
                i`not confirmed delivered and without valid proof, the ` +
                i`dispute will not be approved, and the penalty will not be ` +
                i`reversed. `
              }
              link={{ text: i`View policy`, url: `/policy/wish_express` }}
              className={css(this.styles.alert)}
              sentiment="negative"
            />
          </div>
        )}
      </div>
    );
  }

  renderBasicReadOnlySection() {
    const { trackingId, shippingCarrier, weLateReasonTextDict } = this.props;
    return (
      <Accordion
        header={i`Please provide details for this dispute.`}
        onOpenToggled={() => {}}
        isOpen
        hideChevron
        backgroundColor={palettes.textColors.White}
      >
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={i`Tracking ID`}
            className={css(this.styles.field)}
          >
            <TextInput
              disabled
              defaultValue={trackingId || undefined}
              validators={[]}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Shipping Carrier`}
            className={css(this.styles.field)}
          >
            <TextInput
              disabled
              defaultValue={shippingCarrier || undefined}
              validators={[]}
            />
          </HorizontalField>
          {this.formStatus === "we-new" && (
            <HorizontalField
              title={i`Dispute Reason`}
              className={css(this.styles.field)}
            >
              <TextInput
                disabled
                defaultValue={weLateReasonTextDict[this.weLateReason || ""]}
                validators={[]}
              />
            </HorizontalField>
          )}
        </div>
      </Accordion>
    );
  }

  renderBasicInputSection() {
    const { weReasonEnum } = this.props;
    const header =
      this.formStatus === "normal"
        ? i`Provide proof that the order was correctly` +
          i` shipped and delivered`
        : i`Provide valid proof for the reason you selected `;
    return (
      <Accordion
        header={header}
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
          {this.weLateReason == String(weReasonEnum.NATURAL_DISASTER) && (
            <HorizontalField
              title={i`Natural disaster occurred`}
              className={css(this.styles.field)}
            >
              <div className={css(this.styles.disasterField)}>
                <Select
                  placeholder={i`Please Select.`}
                  options={this.disasterReasonsOptions}
                  onSelected={(code) => {
                    this.disasterReason = code;
                  }}
                  selectedValue={this.disasterReason}
                  minWidth={120}
                  position="bottom center"
                />
              </div>
            </HorizontalField>
          )}
          {this.formStatus === "we-new" && (
            <HorizontalField
              title={i`Notes`}
              className={css(this.styles.field)}
            >
              <TextInput
                disabled={this.isLoading}
                validators={[this.requiredValidator]}
                onChange={({ text }: OnTextChangeEvent) => {
                  this.note = text;
                }}
                height={100}
                value={this.note}
                isTextArea
                placeholder={i`Enter a note`}
                onValidityChanged={(isValid) => {
                  this.isNoteValid = isValid;
                }}
              />
            </HorizontalField>
          )}
        </div>
      </Accordion>
    );
  }

  renderEvidenceSection() {
    if (this.formStatus !== "normal") {
      return null;
    }
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
                  onState={(stateName) => (this.reportedState = stateName)}
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
                this.requiredValidator,
                this.dateFormatValidator,
                this.deliveredDateValidator,
              ]}
              onChange={({ text }: OnTextChangeEvent) => {
                this.reportedDeliveredDate = text;
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
              }}
              placeholder={i`mm/dd/yyyy`}
              onValidityChanged={(isValid) => {
                this.isReportedFulfillmentDateValid = isValid;
              }}
            />
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  render() {
    const { orderId, className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        {this.renderHead()}

        <div className={css(this.styles.content)}>
          <div className={css(this.styles.title)}>
            {this.formStatus !== "none" && i`Provide tracking dispute details`}
          </div>

          {this.formStatus !== "none" && this.renderOrderSection()}

          {this.formStatus === "none" ? (
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
                    href={`/tracking-dispute/v2/create/we/${orderId}`}
                    style={{ padding: "5px 60px" }}
                    disabled={this.isLoading}
                  >
                    Back
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

export default WETrackingDisputeCreate;
