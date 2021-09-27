import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* Legacy */
import MiniProductDetailModalView from "@legacy/view/modal/MiniProductDetail";

/* Lego Components */
import { RichTextBanner } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { Accordion } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { CheckboxField } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

import { Option } from "@ContextLogic/lego";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import NavigationStore from "@merchant/stores/NavigationStore";
import DimenStore from "@merchant/stores/DimenStore";

type BaseProps = any;

type MisleadingVariationDisputeCreateProps = BaseProps & {
  readonly productId?: string;
  readonly productName?: string;
  readonly variationSku?: string;
  readonly variationColor?: string;
  readonly variationSize?: string;
  readonly warningId?: string;
  readonly categories?: {
    [type: string]: string;
  };
};

@observer
class MisleadingVariationDisputeCreate extends Component<
  MisleadingVariationDisputeCreateProps
> {
  @observable
  incorrectRemoved = false;

  @observable
  complyPolicy = false;

  @observable
  productRatedGreat = false;

  @observable
  correctAds = false;

  @observable
  productCategory: string | null | undefined;

  @observable
  productSubcategory: string | null | undefined;

  @observable
  variationBelongReason: string | null | undefined;

  @observable
  variationPolicyReason: string | null | undefined;

  @observable
  isProductCategoryValid = false;

  @observable
  isProductSubcategoryValid = false;

  @observable
  isVariationBelongReasonValid = false;

  @observable
  isVariationPolicyReasonValid = false;

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
  get formStatus(): string {
    if (
      this.complyPolicy &&
      this.correctAds &&
      this.incorrectRemoved &&
      this.productRatedGreat
    ) {
      return "normal";
    }
    return "none";
  }

  @computed
  get pageX(): string | number {
    const { pageGuideX } = DimenStore.instance();
    return pageGuideX;
  }

  @computed
  get productCategoryOptions(): ReadonlyArray<Option<string>> {
    const { categories } = this.props;
    const options = Object.keys(categories).map((k) => {
      return { value: categories[k], text: categories[k] };
    });
    return options;
  }

  @computed
  get isScreenshotFileValid() {
    return this.screenshotFile !== null;
  }

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get canSubmit() {
    return (
      this.productCategory != null &&
      this.isProductSubcategoryValid &&
      this.isVariationBelongReasonValid &&
      this.isVariationPolicyReasonValid &&
      this.isScreenshotFileValid
    );
  }

  @computed
  get submissionParams() {
    const { warningId } = this.props;
    const {
      productCategory,
      productSubcategory,
      variationBelongReason,
      variationPolicyReason,
      screenshotFile,
    } = this;

    return {
      warning_id: warningId,
      // BE handler require diff format
      product_category: productCategory,
      product_subcategory: productSubcategory,
      variation_belong_reason: variationBelongReason,
      variation_policy_reason: variationPolicyReason,
      support_files_str: JSON.stringify([screenshotFile]),
    };
  }

  @action
  onClickSubmit = () => {
    const { submissionParams } = this;
    const navigationStore = NavigationStore.instance();

    if (!submissionParams) {
      return null;
    }

    new ConfirmationModal(
      i`Please confirm that the information you provided is accurate ` +
        i`to prove the removed product variation was incorrectly identified ` +
        i`as misleading. Once your dispute is submitted, you will no longer ` +
        i`be able to make edits. We will review your dispute and inform you ` +
        i`in the next few days.  `
    )
      .setHeader({
        title: i`Submit misleading product variation dispute`,
      })
      .setCancel(i`Cancel`)
      .setIllustration("submitDispute")
      .setAction(i`Yes, submit`, async () => {
        this.isLoading = true;

        try {
          const resp = await disputeApi
            .submitMisleadingVariationDispute(submissionParams)
            .call();
          const warningId = resp.data?.warning_id;
          if (warningId) {
            navigationStore.navigate(`/warning/view/${warningId}`);
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
      alert: {
        margin: "24px 20px 20px 20px",
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
      welcomeHead: {
        marginBottom: 24,
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
      optionField: {
        maxWidth: 180,
      },
      knowledgeField: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 28,
        paddingLeft: 28,
        fontWeight: fonts.weightBold,
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

  renderHead() {
    return (
      <WelcomeHeader
        title={i`Select a type of dispute`}
        body={
          i`Please select a type of dispute you want to submit.` +
          i` Once a type of dispute is selected, you can ` +
          i`submit documents that support your dispute. `
        }
        illustration="submitDispute"
        paddingX={this.pageX}
      />
    );
  }

  renderAgreeSection() {
    return (
      <>
        <div className={css(this.styles.warningBox)}>
          <RichTextBanner
            title={
              i`This product variation is removed for this reason: ` +
              i`Product listing has a misleading variation `
            }
            description={
              i`Before submitting your dispute, please confirm that your` +
              i` product variation complies with Wish policies. You can ` +
              i`provide valid proof about the product variation, including ` +
              i`photos and supporting documents.`
            }
            sentiment="warning"
          />
        </div>
        <Card className={css(this.styles.card)}>
          <div className={css(this.styles.cardTitle)}>
            Misleading product variation dispute
          </div>
          <div className={css(this.styles.card)}>
            <div className={css(this.styles.knowledgeField)}>
              Please confirm the following:
            </div>
            <CheckboxField
              className={css(this.styles.knowledgeField)}
              title={
                i`The variation description is accurate for the ` +
                i`products being shipped.`
              }
              onChange={(value) => {
                this.incorrectRemoved = value;
              }}
              checked={this.incorrectRemoved}
            />
            <CheckboxField
              className={css(this.styles.knowledgeField)}
              title={i`The listing price correctly reflects the products being sold.`}
              onChange={(value) => {
                this.correctAds = value;
              }}
              checked={this.correctAds}
            />
            <CheckboxField
              className={css(this.styles.knowledgeField)}
              title={i`The listing has an average rating of 3 stars or above.`}
              onChange={(value) => {
                this.productRatedGreat = value;
              }}
              checked={this.productRatedGreat}
            />
            <CheckboxField
              className={css(this.styles.knowledgeField)}
              title={i`The variation complies with Wish policies.`}
              onChange={(value) => {
                this.complyPolicy = value;
              }}
              checked={this.complyPolicy}
            />
          </div>
        </Card>
      </>
    );
  }

  renderBasicReadOnlySection() {
    const {
      productId,
      variationSku,
      variationColor,
      variationSize,
      productName = "",
    } = this.props;
    let productNameTrim: string | null = null;
    if (productName.length > 100) {
      productNameTrim = productName.substring(0, 100) + "...";
    } else {
      productNameTrim = productName;
    }
    return (
      <Accordion
        header={i`Here’s the information of your removed product variation.`}
        isOpen
        hideChevron
        backgroundColor={palettes.textColors.White}
      >
        <div className={css(this.styles.sectionContent)}>
          {productId && (
            <>
              <HorizontalField
                title={i`Product Name`}
                className={css(this.styles.field)}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    new MiniProductDetailModalView({
                      product_id: productId,
                    }).render();
                  }}
                >
                  <img
                    alt="product"
                    src={`http://canary.contestimg.wish.com/api/webimage/${productId}-0-small`}
                  />
                  <span style={{ textDecoration: "underline" }}>
                    {productNameTrim}
                  </span>
                </div>
              </HorizontalField>
              <HorizontalField
                title={i`Product ID`}
                className={css(this.styles.field)}
              >
                {productId}
              </HorizontalField>
            </>
          )}
          <HorizontalField title={i`SKU`} className={css(this.styles.field)}>
            {variationSku}
          </HorizontalField>
          <HorizontalField title={i`Color`} className={css(this.styles.field)}>
            {variationColor}
          </HorizontalField>
          <HorizontalField title={i`Size`} className={css(this.styles.field)}>
            {variationSize}
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  renderBasicInputSection() {
    return (
      <Accordion
        header={
          i`Please prove that this product variation is consistent with` +
          i` other variations in the product listing. `
        }
        isOpen
        hideChevron
        backgroundColor={palettes.textColors.White}
      >
        <Alert
          text={
            i`Note that variation SKUs of a given product should be ` +
            i`realistic and consistent with the product being sold. ` +
            i`If unrealistic variations are included in a product, ` +
            i`the product variations are subject to removal ` +
            i`and misleading penalties.`
          }
          link={{ text: i`View policy`, url: `/policy/listing#2.10` }}
          className={css(this.styles.alert)}
          sentiment="warning"
        />
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={i`Product category`}
            className={css(this.styles.field)}
          >
            <div className={css(this.styles.optionField)}>
              <Select
                placeholder={i`Please Select.`}
                options={this.productCategoryOptions}
                onSelected={(code) => {
                  this.productCategory = code;
                }}
                selectedValue={this.productCategory}
                minWidth={120}
                position="bottom center"
              />
            </div>
          </HorizontalField>
          <HorizontalField
            title={i`Product subcategory`}
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              validators={[this.requiredValidator]}
              onChange={({ text }: OnTextChangeEvent) => {
                this.productSubcategory = text;
              }}
              value={this.productSubcategory}
              onValidityChanged={(isValid) => {
                this.isProductSubcategoryValid = isValid;
              }}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Provide reasons why this variation is needed for the product`}
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              validators={[this.requiredValidator]}
              onChange={({ text }: OnTextChangeEvent) => {
                this.variationBelongReason = text;
              }}
              height={100}
              value={this.variationBelongReason}
              isTextArea
              placeholder={i`Enter a reason`}
              onValidityChanged={(isValid) => {
                this.isVariationBelongReasonValid = isValid;
              }}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Explain why the product complies with Wish policies`}
            className={css(this.styles.field)}
          >
            <TextInput
              disabled={this.isLoading}
              validators={[this.requiredValidator]}
              onChange={({ text }: OnTextChangeEvent) => {
                this.variationPolicyReason = text;
              }}
              height={100}
              value={this.variationPolicyReason}
              isTextArea
              placeholder={i`Enter a reason`}
              onValidityChanged={(isValid) => {
                this.isVariationPolicyReasonValid = isValid;
              }}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Supporting Documents`}
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
                  attachments: ReadonlyArray<AttachmentInfo>
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

  render() {
    const { warningId, className, style } = this.props;
    return (
      <div className={css(this.styles.root, className)} style={{ ...style }}>
        {this.renderHead()}

        <div className={css(this.styles.content)}>
          {this.formStatus !== "none" && (
            <div className={css(this.styles.title)}>
              Please provide details for this dispute
            </div>
          )}

          {this.renderAgreeSection()}
          {this.formStatus === "normal" && (
            <Card>
              <div className={css(this.styles.form)}>
                <div className={css(this.styles.formSection)}>
                  {this.renderBasicReadOnlySection()}
                  {this.renderBasicInputSection()}
                </div>

                <div className={css(this.styles.bottomSection)}>
                  {warningId && (
                    <BackButton
                      href={`/misleading-variation-dispute/create/${warningId}`}
                      style={{ padding: "5px 60px" }}
                      disabled={this.isLoading}
                    >
                      Clear Form
                    </BackButton>
                  )}
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

export default MisleadingVariationDisputeCreate;
