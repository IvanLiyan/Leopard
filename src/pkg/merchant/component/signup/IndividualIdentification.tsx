/* eslint-disable local-rules/unnecessary-list-usage */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import faker from "faker/locale/en";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { RadioGroup } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator, StoreUrlValidator } from "@toolkit/validators";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

/* SVGs */
import photoIdIllustration from "@assets/img/illustration-photo-id-instructions.svg";
import screenshotIllustration from "@assets/img/store-screenshot-illustration.svg";

import ToastStore from "@stores/ToastStore";
import NavigationStore from "@stores/NavigationStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { IndividualStoreIdentificationParams } from "@merchant/api/onboarding";

type ProofType = "id" | "online_store_ownership";

type IndividualIdentificationProps = BaseProps;

@observer
class IndividualIdentification extends Component<IndividualIdentificationProps> {
  @observable
  proofType: ProofType = "id";

  @observable
  individualId: string | null | undefined;

  @observable
  individualIdIsValid = false;

  @observable
  individualIdUploadUrl: string | null | undefined;

  @observable
  individualIdUploadFilename: string | null | undefined;

  @observable
  storeUrl: string | null | undefined;

  @observable
  storeUrlIsValid = false;

  @observable
  storeScreenshots: ReadonlyArray<AttachmentInfo> = [];

  @observable
  isLoading = false;

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get urlValidator() {
    return new StoreUrlValidator();
  }

  @computed
  get canSubmit() {
    if (this.proofType === "id") {
      return this.individualIdIsValid && !_.isEmpty(this.individualIdUploadUrl);
    }

    return this.storeUrlIsValid;
  }

  @action
  onSubmit = async () => {
    const {
      storeUrl,
      individualId,
      storeScreenshots,
      individualIdUploadUrl,
      individualIdUploadFilename,
    } = this;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    if (
      this.proofType === "online_store_ownership" &&
      storeScreenshots.length < 2
    ) {
      toastStore.negative(
        i`Please provide at least 2 screenshots of your online store`,
      );
      this.isLoading = false;
      return;
    }

    let params: IndividualStoreIdentificationParams | null | undefined;

    if (this.proofType === "id") {
      if (
        individualId == null ||
        individualIdUploadUrl == null ||
        individualIdUploadFilename == null
      ) {
        return;
      }

      params = {
        entity_type: 1,
        photo_id_number: individualId,
        photo_id_url: individualIdUploadUrl,
        photo_id_filename: individualIdUploadFilename,
      };
    } else {
      if (storeUrl == null) {
        return;
      }

      const screenshots = storeScreenshots.map(({ url }) => url).join(",");
      params = {
        entity_type: 1,
        store_url: storeUrl,
        screenshots,
      };
    }

    if (!params) {
      return;
    }

    this.isLoading = true;

    try {
      await onboardingApi.setStoreIdentification(params).call();
    } catch (e) {
      this.isLoading = false;
      return;
    }

    navigationStore.navigate("/");
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      title: {
        color: palettes.textColors.Ink,
        marginBottom: 25,
        fontSize: 25,
        lineHeight: 1.33,
      },
      form: {
        display: "flex",
        flexDirection: "column",
      },
      formSection: {
        padding: "25px 25px",
        display: "flex",
        flexDirection: "column",
        ":not(:last-child)": {
          borderBottom: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        },
      },
      sectionTitle: {
        fontSize: 16,
        color: palettes.textColors.Ink,
        marginBottom: 30,
        cursor: "default",
      },
      field: {
        ":not(:last-child)": {
          marginBottom: 20,
        },
      },
      fileInput: {
        flex: 1,
      },
      fileContainer: {
        display: "flex",
        flexDirection: "column",
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
        marginBottom: 6,
        alignSelf: "flex-start",
      },
      photoIdIllustration: {
        height: 150,
        alignSelf: "flex-start",
        marginBottom: 15,
        borderRadius: 4,
      },
    });
  }

  renderIdProofSection() {
    return (
      <div className={css(this.styles.formSection)}>
        <Text weight="medium" className={css(this.styles.sectionTitle)}>
          Provide details
        </Text>
        <HorizontalField
          title={i`ID number`}
          popoverContent={
            i`Enter the ID number as it appears on ` +
            i`your government-issued photo ID.`
          }
          className={css(this.styles.field)}
        >
          <TextInput
            key="id_number"
            validators={[this.requiredValidator]}
            onChange={({ text }: OnTextChangeEvent) => {
              this.individualId = text;
            }}
            placeholder={i`Enter ID number`}
            onValidityChanged={(isValid) => {
              this.individualIdIsValid = isValid;
            }}
            debugValue={faker.random.uuid()}
            disabled={this.isLoading}
            focusOnMount
          />
        </HorizontalField>
        <HorizontalField
          title={i`Proof of photo ID`}
          popoverContent={this.renderIdProofInstructions}
          className={css(this.styles.field)}
        >
          <div className={css(this.styles.fileContainer)}>
            <img
              className={css(this.styles.photoIdIllustration)}
              src={photoIdIllustration}
              draggable={false}
            />
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              key="id_file_upload"
              className={css(this.styles.fileInput)}
              accepts=".jpeg,.jpg,.png,.pdf"
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                if (attachments.length > 0) {
                  this.individualIdUploadUrl = attachments[0].url;
                  this.individualIdUploadFilename = attachments[0].fileName;
                } else {
                  this.individualIdUploadUrl = null;
                }
              }}
              maxSizeMB={2}
              disabled={this.isLoading}
            />
          </div>
        </HorizontalField>
      </div>
    );
  }

  renderStoreScreenshotInstructions = () => {
    return (
      <div className={css(this.styles.uploadInstructions)}>
        <img
          src={screenshotIllustration}
          draggable={false}
          width={12}
          alt="upload illustration"
        />
        <ul style={{ marginBottom: 0 }}>
          <li className={css(this.styles.uploadNote)}>
            Upload screenshot(s) of your store URL's product management and
            admin contact info page.
          </li>
          <li className={css(this.styles.uploadNote)}>
            The screenshot(s) should include your store URL, and must be in full
            window view.
          </li>
          <li className={css(this.styles.uploadNote)}>
            The file needs to be smaller than 2MB.
          </li>
        </ul>
      </div>
    );
  };

  renderIdProofInstructions = () => {
    return (
      <div className={css(this.styles.uploadInstructions)}>
        <ul style={{ marginBottom: 0 }}>
          <li className={css(this.styles.uploadNote)}>
            Upload a clear image of you holding your government-issued photo ID
            to allow us to verify your identity.
          </li>
          <li className={css(this.styles.uploadNote)}>
            The photo ID must be clearly visible and legible in the submitted
            image.
          </li>
          <li className={css(this.styles.uploadNote)}>
            The file needs to be smaller than 2MB.
          </li>
        </ul>
      </div>
    );
  };

  renderStoreProofSection() {
    return (
      <div className={css(this.styles.formSection)}>
        <Text weight="medium" className={css(this.styles.sectionTitle)}>
          Provide details
        </Text>
        <HorizontalField
          title={i`Enter your store URL`}
          popoverContent={i`Enter the URL of your online store.`}
          className={css(this.styles.field)}
        >
          <TextInput
            key="store_url"
            disabled={this.isLoading}
            debugValue={faker.internet.url()}
            validators={[this.requiredValidator, this.urlValidator]}
            onChange={({ text }: OnTextChangeEvent) => {
              this.storeUrl = text;
            }}
            placeholder={i`Enter your store URL`}
            onValidityChanged={(isValid) => {
              this.storeUrlIsValid = isValid;
            }}
            focusOnMount
          />
        </HorizontalField>
        <HorizontalField
          title={i`Screenshots of the Admin panel of your store URL`}
          className={css(this.styles.field)}
          popoverContent={this.renderStoreScreenshotInstructions}
          popoverPosition="bottom center"
        >
          <div className={css(this.styles.fileContainer)}>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              disabled={this.isLoading}
              className={css(this.styles.fileInput)}
              key="store_url_screenshot_upload"
              accepts=".jpeg,.jpg,.png"
              onAttachmentsChanged={(
                attachments: ReadonlyArray<AttachmentInfo>,
              ) => {
                this.storeScreenshots = attachments;
              }}
              maxSizeMB={2}
              maxAttachments={3}
            />
          </div>
        </HorizontalField>
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <Text weight="bold" className={css(this.styles.title)}>
          Provide individual identification
        </Text>
        <Card>
          <div className={css(this.styles.form)}>
            <div className={css(this.styles.formSection)}>
              <Text weight="medium" className={css(this.styles.sectionTitle)}>
                Please provide supporting documents to verify your identity.
              </Text>
              <HorizontalField
                title={i`Please choose a type of proof`}
                className={css(this.styles.field)}
              >
                <RadioGroup
                  onSelected={(proofType: ProofType) => {
                    this.proofType = proofType;
                  }}
                  selectedValue={this.proofType}
                  disabled={this.isLoading}
                >
                  <RadioGroup.Item value="id" text={i`Proof of your ID`} />
                  <RadioGroup.Item
                    value="online_store_ownership"
                    text={i`Proof of ownership of your online store URL`}
                  />
                </RadioGroup>
              </HorizontalField>
            </div>
            {this.proofType === "id"
              ? this.renderIdProofSection()
              : this.renderStoreProofSection()}
            <div className={css(this.styles.bottomSection)}>
              <BackButton
                href="/onboarding-v4/store-id"
                style={{ padding: "5px 60px" }}
                disabled={this.isLoading}
                isRouterLink
              >
                Change store type
              </BackButton>
              <PrimaryButton
                isLoading={this.isLoading}
                onClick={this.onSubmit}
                style={{ padding: "7px 60px" }}
                isDisabled={!this.canSubmit}
              >
                Submit
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default IndividualIdentification;
