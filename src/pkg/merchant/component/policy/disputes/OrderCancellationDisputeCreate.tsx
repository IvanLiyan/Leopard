import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { TextInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { ShippingAddress } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { Accordion } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Select } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

import { Option } from "@ContextLogic/lego";
import { AttachmentInfo } from "@ContextLogic/lego";
import { ShippingDetails } from "@merchant/api/orders";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import NavigationStore from "@stores/NavigationStore";
import DeviceStore from "@stores/DeviceStore";

type OrderCancellationDisputeCreateProps = BaseProps & {
  readonly orderId: string;
  readonly trackingId?: string | null | undefined;
  readonly shippingCarrier?: string | null | undefined;
  readonly shippingDetails: ShippingDetails;
  readonly disputeOpenDeadline?: string | null | undefined;
  readonly fineAmount?: number | null | undefined;
  readonly fineCurrency: string | null | undefined;
  readonly cancelReasonEnum: {
    [type: string]: number;
  };
  readonly cancelReasonTextDict: {
    [type: string]: string;
  };
};

@observer
class OrderCancellationDisputeCreate extends Component<OrderCancellationDisputeCreateProps> {
  @observable
  warningStatus: "accepted" | "declined" | "none" = "none";

  @observable
  orderSectionExpanded = true;

  @observable
  basicSectionExpanded = true;

  @observable
  cancelReason: string | null | undefined;

  @observable
  otherReason: string | null | undefined;

  @observable
  screenshotAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  invalidAddressAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  isLoading = false;

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get isScreenshotFileValid() {
    return this.screenshotFile !== null;
  }

  @computed
  get isInvalidAddressValid() {
    return this.invalidAddress !== null;
  }

  @computed
  get invalidAddress():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { invalidAddressAttachments } = this;
    return this.extractFileData(invalidAddressAttachments);
  }

  @computed
  get cancelReasonsOptions(): ReadonlyArray<Option<string>> {
    const { cancelReasonTextDict } = this.props;
    if (!cancelReasonTextDict) {
      return [];
    }

    return Object.keys(cancelReasonTextDict).map((k) => {
      return { value: k, text: cancelReasonTextDict[k] };
    });
  }

  extractFileData(
    attachments: ReadonlyArray<AttachmentInfo>,
  ): { url: string; original_filename: string } | null | undefined {
    if (attachments.length == 0) {
      return null;
    }
    return attachments[0].serverParams;
  }

  @computed
  get screenshotFile():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { screenshotAttachments } = this;
    return this.extractFileData(screenshotAttachments);
  }

  @computed
  get canSubmit() {
    const { cancelReasonEnum } = this.props;
    return (
      this.cancelReason != null &&
      this.isScreenshotFileValid &&
      this.isInvalidAddressValid &&
      (this.cancelReason != String(cancelReasonEnum.OTHER) ||
        (this.otherReason != null && this.otherReason.trim().length > 0))
    );
  }

  @action
  onClickSubmit = () => {
    const { orderId, shippingDetails } = this.props;
    const { screenshotFile, cancelReason, otherReason, invalidAddress } = this;
    const navigationStore = NavigationStore.instance();

    if (cancelReason == null) {
      return;
    }

    new ConfirmationModal(
      i`Are you sure you want to submit the merchant cancellation penalty dispute?`,
    )
      .setHeader({
        title: i`Submit dispute`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Yes, submit`, async () => {
        this.isLoading = true;

        try {
          const resp = await disputeApi
            .submitTrackingDispute({
              order_id: orderId,
              request_cancel_fine_dispute: true,
              customer_addr_proof: JSON.stringify(screenshotFile),
              invalid_address_proof: JSON.stringify(invalidAddress),
              cancel_reason: cancelReason,
              other_reason: otherReason,
              // back-compatible with BE handler params
              customer_street1: shippingDetails.street_address1,
              customer_street2: shippingDetails.street_address2,
              customer_city: shippingDetails.city,
              customer_state: shippingDetails.state,
              customer_country: shippingDetails.country_code,
              customer_zipcode: shippingDetails.zipcode,
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
    const { pageGuideX } = DeviceStore.instance();
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
        padding: "24px 0px",
        fontSize: 25,
        lineHeight: 1.33,
      },
      cardTitle: {
        color: palettes.textColors.Ink,
        padding: "24px 24px",
        fontSize: 25,
        lineHeight: 1.33,
      },
      warningBox: {
        marginTop: 14,
      },
      alert: {
        margin: "24px 0px",
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
      headerLink: {
        marginTop: 17,
        fontSize: 18,
      },
      selectField: {
        maxWidth: 330,
        marginBottom: 20,
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
        paddingLeft: 24,
      },
      table: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 24,
        marginRight: 24,
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
      card: {
        marginBottom: 20,
      },
    });
  }

  renderColumns() {
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
        href={`/policy/fulfillment#5.9`}
        text={({ row }) => `${row.policy}`}
        openInNewTab
      />,
      <Table.LinkColumn
        title={i`Action`}
        columnKey="link"
        align="left"
        href={({ row }) =>
          `/penalties/orders?fine_types=25&order_id=${row.orderId}`
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
        disputeType: i`Merchant Cancellation Dispute`,
        fineAmount,
        policy: i`Merchant Cancellation Policy`,
        link: "",
      },
    ];
  }

  renderHeader() {
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
    const { disputeOpenDeadline } = this.props;
    return (
      <>
        <Alert
          text={
            i`This dispute needs to be submitted by ${disputeOpenDeadline} ` +
            i`to avoid a temporary impression suspension for the related ` +
            i`product. Upon approval of your dispute, the penalty will be ` +
            i`reversed and the impression suspension will be cancelled.`
          }
          link={{ text: i`View policy`, url: `/policy/fulfillment#5.9` }}
          className={css(this.styles.alert)}
          sentiment="warning"
        />
        <Card className={css(this.styles.card)}>
          <Text weight="bold" className={css(this.styles.cardTitle)}>
            Merchant cancellation penalty
          </Text>
          <HorizontalField
            title={
              i`Customer has entered a wrong address or the item ` +
              i`cannot be shipped to certain location.`
            }
            className={css(this.styles.field)}
            titleWidth={642}
          >
            <div className={css(this.styles.agreebox)}>
              {this.warningStatus === "accepted" ? (
                <PrimaryButton
                  onClick={() => {
                    this.warningStatus = "accepted";
                  }}
                  style={{ padding: "7px 60px" }}
                  className={css(this.styles.agreebutton)}
                >
                  Yes
                </PrimaryButton>
              ) : (
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
              )}
              {this.warningStatus === "declined" ? (
                <PrimaryButton
                  onClick={() => {
                    this.warningStatus = "declined";
                  }}
                  style={{ padding: "7px 60px" }}
                >
                  No
                </PrimaryButton>
              ) : (
                <SecondaryButton
                  onClick={() => {
                    this.warningStatus = "declined";
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
        {this.warningStatus === "declined" && (
          <Alert
            className={css(this.styles.alert)}
            text={
              i`You are not eligible to submit the dispute based ` +
              i`on the information provided. `
            }
            link={{ text: i`View policy`, url: `/policy/fulfillment#5.9` }}
            sentiment="negative"
          />
        )}
      </>
    );
  }

  renderBasicReadOnlySection() {
    const { trackingId, shippingCarrier } = this.props;
    if (!trackingId) {
      return null;
    }
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
            <TextInput disabled defaultValue={trackingId} validators={[]} />
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
        </div>
      </Accordion>
    );
  }

  renderBasicInputSection() {
    const { shippingDetails, cancelReasonEnum } = this.props;
    return (
      <Accordion
        header={i`Provide proof of customer’s address`}
        isOpen={this.basicSectionExpanded}
        onOpenToggled={(isOpen) => (this.basicSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={i`Provide the invalid customer address`}
            className={css(this.styles.field)}
            popoverContent={i`View Shipping Address for this order`}
          >
            <ShippingAddress shippingDetails={shippingDetails} />
          </HorizontalField>
          <HorizontalField
            title={i`Attach proof that this is the customer's listed address`}
            className={css(this.styles.field)}
            popoverContent={
              i`Provide a screenshot of the customer's address. ` +
              i`Go to Orders > History > Ship To, or Order Status page. `
            }
          >
            <div className={css(this.styles.fileContainer)}>
              <DEPRECATEDFileInput
                bucket="TEMP_UPLOADS"
                disabled={this.isLoading}
                className={css(this.styles.fileInput)}
                accepts=".jpeg,.jpg,.png,.pdf"
                maxAttachments={1}
                attachments={this.screenshotAttachments}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  this.screenshotAttachments = attachments;
                }}
                maxSizeMB={2}
              />
            </div>
          </HorizontalField>
          <HorizontalField
            title={i`Choose the reason`}
            className={css(this.styles.field)}
          >
            <div className={css(this.styles.selectField)}>
              <Select
                placeholder={i`Please Select.`}
                options={this.cancelReasonsOptions}
                onSelected={(code) => {
                  this.cancelReason = code;
                }}
                selectedValue={this.cancelReason}
                position="bottom left"
              />
            </div>
          </HorizontalField>
          {this.cancelReason == String(cancelReasonEnum.OTHER) && (
            <HorizontalField
              title={i`Describe "Other" Reason`}
              className={css(this.styles.field)}
            >
              <TextInput
                disabled={this.isLoading}
                validators={[this.requiredValidator]}
                onChange={({ text }: OnTextChangeEvent) => {
                  this.otherReason = text;
                }}
                height={100}
                value={this.otherReason}
                isTextArea
                placeholder={i`Enter a reason`}
              />
            </HorizontalField>
          )}
          <HorizontalField
            title={i`Attach proof that the above address is invalid`}
            className={css(this.styles.field)}
            popoverContent={
              i`e.g. Screenshot of the error message from the ` +
              i`shipping provider, screenshot showing address cannot be ` +
              i`found on map providers. `
            }
          >
            <div className={css(this.styles.fileContainer)}>
              <DEPRECATEDFileInput
                bucket="TEMP_UPLOADS"
                disabled={this.isLoading}
                className={css(this.styles.fileInput)}
                accepts=".jpeg,.jpg,.png,.pdf"
                maxAttachments={1}
                attachments={this.invalidAddressAttachments}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  this.invalidAddressAttachments = attachments;
                }}
                maxSizeMB={2}
              />
            </div>
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  render() {
    const { orderId, className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        {this.renderHeader()}
        <div className={css(this.styles.content)}>
          <Text weight="bold" className={css(this.styles.title)}>
            {this.warningStatus === "accepted" &&
              i`Dispute merchant cancellation penalty`}
          </Text>
          {this.warningStatus === "accepted" && this.renderOrderSection()}

          {this.warningStatus !== "accepted" ? (
            this.renderAgreeSection()
          ) : (
            <Card className={css(this.styles.card)}>
              <div className={css(this.styles.form)}>
                <div className={css(this.styles.formSection)}>
                  {this.renderBasicReadOnlySection()}
                  {this.renderBasicInputSection()}
                </div>

                <div className={css(this.styles.bottomSection)}>
                  <BackButton
                    href={`/tracking-dispute/v2/create/oc/${orderId}`}
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
                    Submit Dispute
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
export default OrderCancellationDisputeCreate;
