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
import { Text } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

/* SVGs */
import businessIdIllustration from "@assets/img/business-id-illustration.svg";
import legalRepIdIllustration from "@assets/img/legal-representative-illustration.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import NavigationStore from "@merchant/stores/NavigationStore";

type CompanyIdentificationProps = BaseProps;

@observer
class CompanyIdentification extends Component<CompanyIdentificationProps> {
  @observable
  companyName: string | null | undefined;

  @observable
  companyNameIsValid = false;

  @observable
  businessLicense: string | null | undefined;

  @observable
  businessLicenseIsValid = false;

  @observable
  businessLicenseFilename: string | null | undefined;

  @observable
  businessLicenseUploadUrl: string | null | undefined;

  @observable
  legalRepName: string | null | undefined;

  @observable
  legalRepNameIsValid = false;

  @observable
  legalRepId: string | null | undefined;

  @observable
  legalRepIdIsValid = false;

  @observable
  legalRepIdUploadUrl: string | null | undefined;

  @observable
  legalRepIdFilename: string | null | undefined;

  @observable
  isLoading = false;

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get canSubmit() {
    return (
      this.companyNameIsValid &&
      this.legalRepNameIsValid &&
      this.businessLicenseIsValid &&
      _.isEmpty(this.businessLicenseUploadUrl) === false &&
      this.legalRepIdIsValid &&
      _.isEmpty(this.legalRepIdUploadUrl) === false
    );
  }

  @action
  onSubmit = async () => {
    const navigationStore = NavigationStore.instance();

    const {
      companyName,
      businessLicense,
      businessLicenseFilename,
      businessLicenseUploadUrl,
      legalRepId,
      legalRepName,
      legalRepIdFilename,
      legalRepIdUploadUrl,
    } = this;

    if (
      companyName == null ||
      businessLicense == null ||
      businessLicenseFilename == null ||
      businessLicenseUploadUrl == null ||
      legalRepId == null ||
      legalRepName == null ||
      legalRepIdFilename == null ||
      legalRepIdUploadUrl == null
    ) {
      return;
    }

    this.isLoading = true;

    try {
      await onboardingApi
        .setStoreIdentification({
          entity_type: 2,
          company_name: companyName,

          business_license: businessLicense,
          business_license_url: businessLicenseUploadUrl,
          business_license_filename: businessLicenseFilename,

          legal_rep_id: legalRepId,
          legal_rep_name: legalRepName,
          legal_rep_id_url: legalRepIdUploadUrl,
          legal_rep_id_filename: legalRepIdFilename,
        })
        .call();
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
      uploadIllustration: {
        minWidth: 120,
        marginBottom: 10,
      },
      uploadNote: {
        lineHeight: 1.33,
        fontSize: 12,
        marginBottom: 5,
        alignSelf: "flex-start",
      },
    });
  }

  renderBusinessIdUploadInstructions = () => {
    return (
      <div className={css(this.styles.uploadInstructions)}>
        <img
          src={businessIdIllustration}
          draggable={false}
          width={12}
          className={css(this.styles.uploadIllustration)}
          alt="upload illustration"
        />
        <ul style={{ marginBottom: 0 }}>
          <li className={css(this.styles.uploadNote)}>
            Upload an image of your Business License.
          </li>
          <li className={css(this.styles.uploadNote)}>
            The file needs to be smaller than 2MB.
          </li>
        </ul>
      </div>
    );
  };

  renderLegalRepresentativeIdUploadInstructions = () => {
    return (
      <div className={css(this.styles.uploadInstructions)}>
        <img
          src={legalRepIdIllustration}
          draggable={false}
          width={12}
          className={css(this.styles.uploadIllustration)}
          alt="upload illustration"
        />
        <ul style={{ marginBottom: 0 }}>
          <li className={css(this.styles.uploadNote)}>
            Upload a clear image of you (Legal Representative) holding your
            government-issued photo ID to allow us to verify your identity.
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

  render() {
    const { className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        <Text weight="bold" className={css(this.styles.title)}>
          Please provide supporting documents to verify your identity.
        </Text>
        <Card>
          <div className={css(this.styles.form)}>
            <div className={css(this.styles.formSection)}>
              <HorizontalField
                title={i`Company name`}
                popoverContent={
                  i`Company name must be consistent ` +
                  i`with name on Business License.`
                }
                className={css(this.styles.field)}
              >
                <TextInput
                  disabled={this.isLoading}
                  validators={[this.requiredValidator]}
                  onChange={({ text }: OnTextChangeEvent) => {
                    this.companyName = text;
                  }}
                  placeholder={i`Enter your company name`}
                  onValidityChanged={(isValid) => {
                    this.companyNameIsValid = isValid;
                  }}
                  focusOnMount
                  debugValue={faker.company.companyName()}
                />
              </HorizontalField>
              <HorizontalField
                title={i`Business License ID`}
                popoverContent={
                  i`Must be consistent with ID number on ` +
                  i`Business License.`
                }
                className={css(this.styles.field)}
              >
                <TextInput
                  disabled={this.isLoading}
                  validators={[this.requiredValidator]}
                  onChange={({ text }: OnTextChangeEvent) => {
                    this.businessLicense = text;
                  }}
                  placeholder={i`Enter Business License ID`}
                  onValidityChanged={(isValid) => {
                    this.businessLicenseIsValid = isValid;
                  }}
                  debugValue={faker.random.number().toString()}
                />
              </HorizontalField>
              <HorizontalField
                title={i`Proof of Business License ID`}
                className={css(this.styles.field)}
                popoverContent={this.renderBusinessIdUploadInstructions}
                popoverPosition="bottom center"
              >
                <div className={css(this.styles.fileContainer)}>
                  <DEPRECATEDFileInput
                    bucket="TEMP_UPLOADS"
                    disabled={this.isLoading}
                    className={css(this.styles.fileInput)}
                    accepts=".jpeg,.jpg,.png,.pdf"
                    onAttachmentsChanged={(
                      attachments: ReadonlyArray<AttachmentInfo>
                    ) => {
                      if (attachments.length > 0) {
                        this.businessLicenseUploadUrl = attachments[0].url;
                        this.businessLicenseFilename = attachments[0].fileName;
                      } else {
                        this.businessLicenseUploadUrl = null;
                      }
                    }}
                    maxSizeMB={2}
                  />
                </div>
              </HorizontalField>
              <HorizontalField
                title={i`Legal Representative Name`}
                popoverContent={i`Name of your legal representative`}
                className={css(this.styles.field)}
              >
                <TextInput
                  disabled={this.isLoading}
                  validators={[this.requiredValidator]}
                  onChange={({ text }: OnTextChangeEvent) => {
                    this.legalRepName = text;
                  }}
                  placeholder={i`Enter the name of your legal representative`}
                  onValidityChanged={(isValid) => {
                    this.legalRepNameIsValid = isValid;
                  }}
                  debugValue={faker.name.findName()}
                />
              </HorizontalField>
              <HorizontalField
                title={i`Legal Representative ID`}
                popoverContent={i`Enter Legal Representative ID`}
                className={css(this.styles.field)}
              >
                <TextInput
                  disabled={this.isLoading}
                  validators={[this.requiredValidator]}
                  onChange={({ text }: OnTextChangeEvent) => {
                    this.legalRepId = text;
                  }}
                  placeholder={i`Enter Legal Representative ID`}
                  onValidityChanged={(isValid) => {
                    this.legalRepIdIsValid = isValid;
                  }}
                  debugValue={faker.random.number().toString()}
                />
              </HorizontalField>
              <HorizontalField
                title={i`Proof of Legal Representative ID`}
                className={css(this.styles.field)}
                popoverContent={
                  this.renderLegalRepresentativeIdUploadInstructions
                }
                popoverPosition="bottom center"
              >
                <div className={css(this.styles.fileContainer)}>
                  <DEPRECATEDFileInput
                    bucket="TEMP_UPLOADS"
                    disabled={this.isLoading}
                    className={css(this.styles.fileInput)}
                    accepts=".jpeg,.jpg,.png,.pdf"
                    onAttachmentsChanged={(
                      attachments: ReadonlyArray<AttachmentInfo>
                    ) => {
                      if (attachments.length > 0) {
                        this.legalRepIdUploadUrl = attachments[0].url;
                        this.legalRepIdFilename = attachments[0].fileName;
                      } else {
                        this.legalRepIdUploadUrl = null;
                      }
                    }}
                    maxSizeMB={2}
                  />
                </div>
              </HorizontalField>
            </div>

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
export default CompanyIdentification;
