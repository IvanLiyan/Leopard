import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { Accordion } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { HorizontalField } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator, UrlValidator } from "@toolkit/validators";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import NavigationStore from "@stores/NavigationStore";
import DeviceStore from "@stores/DeviceStore";

type FakeTrackingDisputeCreateProps = BaseProps & {
  readonly disputeType: "fk" | "uc";
  readonly orderId: string;
  readonly trackingId?: string | null | undefined;
  readonly shippingCarrier?: string | null | undefined;
  readonly fineAmount?: number | null | undefined;
  readonly fineCurrency?: string | null | undefined;
};

@observer
class FakeTrackingDisputeCreate extends Component<FakeTrackingDisputeCreateProps> {
  @observable
  warningStatus: "form" | "accepted" | "declined" | "none" = "none";

  @observable
  orderSectionExpanded = true;

  @observable
  knowledgeSectionExpanded = true;

  @observable
  basicSectionExpanded = true;

  @observable
  proofSectionExpanded = true;

  @observable
  optionalSectionExpanded = true;

  @observable
  isReportedFulfillmentDateValid = false;

  @observable
  reportedDeliveredDate = "";

  @observable
  isReportedDeliveredDateValid = false;

  @observable
  link: string | null | undefined;

  @observable
  isLinkValid = false;

  @observable
  screenshotAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  shippingLabelAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  productInvoiceAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  packagePhotoAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  supportDocAttachments: ReadonlyArray<AttachmentInfo> = [];

  @observable
  isLoading = false;

  @computed
  get isScreenshotFileValid() {
    return this.screenshotFile !== null;
  }

  @computed
  get isShippingLabelValid() {
    return this.shippingLabel !== null;
  }

  @computed
  get isProductInvoiceValid() {
    return this.productInvoice !== null;
  }

  @computed
  get isPackagePhotoValid() {
    return this.packagePhoto !== null;
  }

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get urlValidator() {
    return new UrlValidator();
  }

  @computed
  get supportDoc():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { supportDocAttachments } = this;
    return this.extractFileData(supportDocAttachments);
  }

  @computed
  get packagePhoto():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { packagePhotoAttachments } = this;
    return this.extractFileData(packagePhotoAttachments);
  }

  @computed
  get productInvoice():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { productInvoiceAttachments } = this;
    return this.extractFileData(productInvoiceAttachments);
  }

  @computed
  get shippingLabel():
    | { url: string; original_filename: string }
    | null
    | undefined {
    const { shippingLabelAttachments } = this;
    return this.extractFileData(shippingLabelAttachments);
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
    return (
      this.isLinkValid &&
      this.isScreenshotFileValid &&
      this.isShippingLabelValid
    );
  }

  @action
  onClickSubmit = () => {
    const { orderId, disputeType } = this.props;
    const {
      shippingLabel,
      productInvoice,
      packagePhoto,
      supportDoc,
      link,
      screenshotFile,
    } = this;
    const navigationStore = NavigationStore.instance();

    if (orderId == null || link == null) {
      return;
    }
    const params = {
      order_id: orderId,
      link,
      request_fine_reverse: false,
      request_fine_uc: false,
      screenshot_file: JSON.stringify(screenshotFile),
      shipping_label: JSON.stringify(shippingLabel),
      log_invoice: JSON.stringify(productInvoice),
      package_pic: JSON.stringify(packagePhoto),
      support_doc: JSON.stringify(supportDoc),
    };
    if (disputeType === "fk") {
      params.request_fine_reverse = true;
    } else if (disputeType === "uc") {
      params.request_fine_uc = true;
    }
    new ConfirmationModal(
      disputeType === "fk"
        ? i`Are you sure you want to submit the fake tracking dispute?`
        : i`Are you sure you want to submit the unconfirmed carrier tracking dispute?`,
    )
      .setHeader({
        title: i`Submit tracking dispute`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Yes, submit`, async () => {
        this.isLoading = true;

        try {
          const resp = await disputeApi.submitTrackingDispute(params).call();

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
      welcomeHead: {
        marginBottom: 24,
      },
      warningBox: {
        marginTop: 14,
      },
      alert: {
        margin: 12,
      },
      form: {
        display: "flex",
        flexDirection: "column",
      },
      formSection: {
        display: "flex",
        flexDirection: "column",
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        color: palettes.textColors.Ink,
        marginBottom: 30,
        cursor: "default",
      },
      headerLink: {
        marginTop: 17,
        fontSize: 18,
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
        margin: 24,
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
      questionSection: {
        display: "flex",
        padding: "25px 25px",
        flexDirection: "row",
        justifyContent: "flex-end",
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
    const { fineCurrency, orderId } = this.props;

    if (!orderId) {
      return null;
    }

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
        href={({ row }) => `${row.policyLink}`}
        text={({ row }) => `${row.policy}`}
        openInNewTab
      />,
      <Table.LinkColumn
        title={i`Action`}
        columnKey="link"
        align="left"
        href={({ row }) => `${row.actionLink}`}
        text={i`View Penalties`}
        openInNewTab
      />,
    ];
  }

  @computed
  get tableRows() {
    const { orderId, fineAmount, disputeType } = this.props;
    if (disputeType === "fk") {
      return [
        {
          orderId,
          disputeType: i`Fake Tracking Dispute`,
          fineAmount,
          policy: i`Fake tracking information`,
          policyLink: `/policy/fulfillment#5.6`,
          actionLink: `/penalties/orders?fine_types=19&order_id=${orderId}`,
          link: "",
        },
      ];
    } else if (disputeType === "uc") {
      return [
        {
          orderId,
          disputeType: i`Unconfirmed Tracking of Accepted Carriers`,
          fineAmount,
          policy: i`Unconfirmed Tracking of Accepted Carriers`,
          policyLink: `/policy/fulfillment#5.15`,
          actionLink: `/penalties/orders?fine_types=36&order_id=${orderId}`,
          link: "",
        },
      ];
    }
  }

  renderHeader() {
    const { orderId } = this.props;
    if (!orderId) {
      return null;
    }

    return (
      this.warningStatus !== "form" && (
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

  renderAgreeSectionUC() {
    return (
      <div>
        <Card className={css(this.styles.card)}>
          <div className={css(this.styles.cardTitle)}>
            Dispute for unconfirmed tracking of accepted carriers
          </div>
          <HorizontalField
            title={i`Is your order confirmed delivered?`}
            className={css(this.styles.field)}
            titleWidth={268}
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
          <Card className={css(this.styles.card)}>
            <Alert
              text={
                i`You are not eligible to submit the dispute based on the ` +
                i`information provided. If you cannot prove the correct ` +
                i`product was confirmed delivered to the customer, ` +
                i`the dispute will not be approved, and the penalty will ` +
                i`not be reversed. `
              }
              link={{ text: i`View policy`, url: `/policy/fulfillment#5.6` }}
              sentiment="negative"
            />
          </Card>
        )}
        {this.warningStatus === "accepted" && (
          <Card className={css(this.styles.card)}>
            <Alert
              className={css(this.styles.alert)}
              text={
                i` You are eligible to submit the dispute based on the ` +
                i`information provided. The next step to submit the ` +
                i`appropriate documents and Wish will review your ` +
                i`dispute. Upon approval of your dispute, the penalty will ` +
                i`be reversed. If you cannot prove the correct product was ` +
                i`confirmed delivered to the customer, the dispute will not ` +
                i`be approved, and the penalty will not be reversed.`
              }
              link={{ text: i`View policy`, url: `/policy/fulfillment#5.15` }}
              sentiment="positive"
            />
            <div className={css(this.styles.questionSection)}>
              <SecondaryButton
                onClick={() => {
                  this.warningStatus = "form";
                }}
                padding="7px 60px"
              >
                Get started
              </SecondaryButton>
            </div>
          </Card>
        )}
        <Card className={css(this.styles.card)}>
          <Accordion
            header={
              i`What should I know about disputing unconfirmed ` +
              i`tracking of accepted carriers?`
            }
            onOpenToggled={(isOpen) => {
              this.knowledgeSectionExpanded = isOpen;
            }}
            isOpen={this.knowledgeSectionExpanded}
            backgroundColor={palettes.textColors.White}
          >
            <Alert
              className={css(this.styles.alert)}
              text={
                i`Merchants are required to ship certain orders with a ` +
                i`Wish-accepted shipping carrier and provide a valid ` +
                i`tracking number, so that they deliver the orders to ` +
                i`customers in a timely and reliable manner. ` +
                i`For this type of orders, when using the merchant-provided ` +
                i`tracking number, if an order with (merchant price + ` +
                i`shipping price) per item < ${formatCurrency(
                  100,
                )} is not confirmed ` +
                i`shipped by an accepted carrier within 168 hours from ` +
                i`the order released time, or if an order with (merchant price ` +
                i`+ shipping price) per item ≥ ${formatCurrency(
                  100,
                )} is not confirmed ` +
                i`shipped by an accepted carrier within 336 hours from the ` +
                i`order released time, the merchant will be penalized. `
              }
              link={{ text: i`View policy`, url: `/policy/fulfillment#5.15` }}
              sentiment="info"
            />
            <Alert
              className={css(this.styles.alert)}
              text={
                i`Note that the tracking information on this order cannot be ` +
                i`edited when this dispute is open. Once the dispute is ` +
                i`closed, you will be able to modify the tracking ` +
                i`information again.`
              }
              sentiment="info"
            />
          </Accordion>
        </Card>
      </div>
    );
  }

  renderAgreeSectionFK() {
    return (
      <div>
        <Card className={css(this.styles.card)}>
          <div className={css(this.styles.cardTitle)}>
            Fake tracking dispute
          </div>
          <HorizontalField
            title={i`Is your order confirmed delivered?`}
            className={css(this.styles.field)}
            titleWidth={268}
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
          <Card className={css(this.styles.card)}>
            <Alert
              text={
                i`You are not eligible to submit the dispute based on the ` +
                i`information provided. If you cannot prove the correct ` +
                i`product was confirmed delivered to the customer, ` +
                i`the dispute will not be approved, and the penalty ` +
                i`will not be reversed.`
              }
              link={{ text: i`View policy`, url: `/policy/fulfillment#5.6` }}
              sentiment="negative"
            />
          </Card>
        )}
        {this.warningStatus === "accepted" && (
          <Card className={css(this.styles.card)}>
            <Alert
              className={css(this.styles.alert)}
              text={
                i`You are eligible to submit the dispute based on the ` +
                i`information provided. The next step to submit the ` +
                i`appropriate documents and Wish admin will review your ` +
                i`dispute. Upon approval of your dispute, the penalty will ` +
                i`be reversed. If you cannot prove the correct product ` +
                i`was confirmed delivered to the customer, the dispute ` +
                i`will not be approved, and the penalty will not be reversed.`
              }
              link={{ text: i`View policy`, url: `/policy/fulfillment#5.6` }}
              sentiment="positive"
            />
            <div className={css(this.styles.questionSection)}>
              <SecondaryButton
                onClick={() => {
                  this.warningStatus = "form";
                }}
                padding="7px 60px"
              >
                Get started
              </SecondaryButton>
            </div>
          </Card>
        )}
        <Card className={css(this.styles.card)}>
          <Accordion
            header={i`What should I know about fake tracking disputes?`}
            onOpenToggled={(isOpen) => {
              this.knowledgeSectionExpanded = isOpen;
            }}
            isOpen={this.knowledgeSectionExpanded}
            backgroundColor={palettes.textColors.White}
          >
            <Alert
              className={css(this.styles.alert)}
              text={
                i`Fake tracking numbers are defined as tracking numbers that ` +
                i`are intentionally inaccurate. Wish customers and the Wish ` +
                i`platform are misled to believe these orders to be delivered ` +
                i`or shipped when they are not. `
              }
              link={{ text: i`View detail`, url: `/policy/fulfillment#5.6` }}
              sentiment="info"
            />
            <Alert
              className={css(this.styles.alert)}
              text={
                i`Note that the tracking information on this order cannot be ` +
                i`edited when the fake tracking dispute is open. ` +
                i`Once the dispute is closed, you will be able to modify the ` +
                i`tracking information again. `
              }
              sentiment="info"
            />
          </Accordion>
        </Card>
      </div>
    );
  }

  renderBasicReadOnlySection() {
    const { trackingId, shippingCarrier } = this.props;
    return (
      <Accordion
        header={i`Please provide details for this dispute.`}
        onOpenToggled={() => {}}
        isOpen
        hideChevron
        backgroundColor={palettes.textColors.White}
      >
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
      </Accordion>
    );
  }

  renderBasicInputSection() {
    return (
      <Accordion
        header={i`Provide correct tracking information *`}
        isOpen={this.basicSectionExpanded}
        onOpenToggled={(isOpen) => (this.basicSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
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
          popoverContent={
            i`Upload a screenshot of the carrier website ` +
            i`that proves the tracking number has valid tracking. `
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
          title={i`Attach the shipping label`}
          className={css(this.styles.field)}
          popoverContent={
            i`Upload an image of the package's shipping label that shows ` +
            i`the tracking number, shipping address, and shipping carrier or ` +
            i`an issued document confirming 1) origin address and ` +
            i`2) destination address`
          }
        >
          <div className={css(this.styles.fileContainer)}>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              disabled={this.isLoading}
              className={css(this.styles.fileInput)}
              accepts=".jpeg,.jpg,.png,.pdf"
              maxAttachments={1}
              attachments={this.shippingLabelAttachments}
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                this.shippingLabelAttachments = attachments;
              }}
              maxSizeMB={2}
            />
          </div>
        </HorizontalField>
      </Accordion>
    );
  }

  renderEvidenceSection() {
    return (
      <Accordion
        header={
          i`Provide proof that the correct product was ` +
          i`shipped and delivered (optional)`
        }
        isOpen={this.proofSectionExpanded}
        onOpenToggled={(isOpen) => (this.proofSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
        <HorizontalField
          title={i`Attach a product invoice from the supplier or manufactor`}
          className={css(this.styles.field)}
          popoverContent={
            i`Upload a file of an invoice from a supplier ` +
            i`from which the product was purchased.`
          }
        >
          <div className={css(this.styles.fileContainer)}>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              disabled={this.isLoading}
              className={css(this.styles.fileInput)}
              accepts=".jpeg,.jpg,.png,.pdf"
              maxAttachments={1}
              attachments={this.productInvoiceAttachments}
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                this.productInvoiceAttachments = attachments;
              }}
              maxSizeMB={2}
            />
          </div>
        </HorizontalField>
        <HorizontalField
          title={i`Attach a photo of the package`}
          className={css(this.styles.field)}
          popoverContent={
            i`Upload a photo of the original package with the ` +
            i`shipping label before it was shipped out.`
          }
        >
          <div className={css(this.styles.fileContainer)}>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              disabled={this.isLoading}
              className={css(this.styles.fileInput)}
              accepts=".jpeg,.jpg,.png,.pdf"
              maxAttachments={1}
              attachments={this.packagePhotoAttachments}
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                this.packagePhotoAttachments = attachments;
              }}
              maxSizeMB={2}
            />
          </div>
        </HorizontalField>
      </Accordion>
    );
  }

  renderOptionalSection() {
    return (
      <Accordion
        header={i`Provide other supporting documents (optional)`}
        isOpen={this.optionalSectionExpanded}
        onOpenToggled={(isOpen) => (this.optionalSectionExpanded = isOpen)}
        backgroundColor={palettes.textColors.White}
      >
        <HorizontalField
          title={i`Attach supporting documents`}
          className={css(this.styles.field)}
        >
          <div className={css(this.styles.fileContainer)}>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              disabled={this.isLoading}
              className={css(this.styles.fileInput)}
              accepts=".jpeg,.jpg,.png,.pdf"
              maxAttachments={1}
              attachments={this.supportDocAttachments}
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                this.supportDocAttachments = attachments;
              }}
              maxSizeMB={2}
            />
          </div>
        </HorizontalField>
      </Accordion>
    );
  }

  render() {
    const { orderId, className, style, disputeType } = this.props;
    if (!orderId) {
      return null;
    }
    const backButtonLink =
      disputeType === "fk"
        ? `/tracking-dispute/v2/create/fk/${orderId}`
        : `/tracking-dispute/v2/create/uc/${orderId}`;
    return (
      <div className={css(this.styles.root, className, style)}>
        {this.renderHeader()}

        <div className={css(this.styles.content)}>
          <div className={css(this.styles.title)}>
            {this.warningStatus === "form" && (
              <div className={css(this.styles.title)}>
                {this.warningStatus === "form" &&
                  i`Provide tracking dispute details`}
              </div>
            )}
          </div>
          {this.warningStatus === "form" && this.renderOrderSection()}

          {this.warningStatus !== "form" ? (
            <>
              {disputeType === "fk" && this.renderAgreeSectionFK()}
              {disputeType === "uc" && this.renderAgreeSectionUC()}
            </>
          ) : (
            <Card className={css(this.styles.card)}>
              <div className={css(this.styles.form)}>
                <div className={css(this.styles.formSection)}>
                  {this.renderBasicReadOnlySection()}
                  {this.renderBasicInputSection()}
                  {this.renderEvidenceSection()}
                  {this.renderOptionalSection()}
                </div>

                <div className={css(this.styles.bottomSection)}>
                  <BackButton
                    href={backButtonLink}
                    style={{ padding: "5px 60px" }}
                    disabled={this.isLoading}
                  >
                    Back
                  </BackButton>
                  <PrimaryButton
                    isLoading={this.isLoading}
                    onClick={this.onClickSubmit}
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

export default FakeTrackingDisputeCreate;
