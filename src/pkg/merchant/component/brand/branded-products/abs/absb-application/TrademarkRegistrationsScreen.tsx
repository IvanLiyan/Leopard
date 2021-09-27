import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import faker from "faker/locale/en";

/* Lego Components */
import { H5 } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { PhoneNumberField } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator, EmailValidator } from "@toolkit/validators";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import Footer from "./Footer";
import MultiCountryInput from "./MultiCountryInput";
import { getDownloadLink } from "./TemplateDownloader";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBTrademarkCountryCode } from "@toolkit/brand/branded-products/abs";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";
import { CountryCode } from "@toolkit/countries";

type TrademarkRegistrationsScreenProps = BaseProps & {
  currentApplication: ABSBApplicationState;
  acceptedTrademarkCountries: ReadonlyArray<ABSBTrademarkCountryCode>;
};

const TrademarkRegistrationsScreen = ({
  style,
  currentApplication,
  acceptedTrademarkCountries,
}: TrademarkRegistrationsScreenProps) => {
  const styles = useStylesheet();
  const [continuePressed, setContinuePressed] = useState(false);
  const [phoneNumberCountry, setPhoneNumberCountry] = useState<CountryCode>(
    "US"
  );
  const downloadLink = getDownloadLink(currentApplication.authorizationType);

  const titleText =
    currentApplication.authorizationType === "BRAND_OWNER"
      ? i`Trademark Registration(s)`
      : i`Brand’s Trademark Registration(s) and Reseller Authentication`;
  const downloadSuggestedTemplateLink = `[${i`Download suggested template`}](${downloadLink})`;
  const subTitleText =
    currentApplication.authorizationType === "BRAND_OWNER"
      ? i`Please provide a list of the brand's trademark registration(s) on ` +
        i`the brand owner's company letterhead. Be sure to include a table ` +
        i`of registration number(s), region(s) in which the trademark(s) are ` +
        i`registered, and expiration date(s) of each trademark registration. ` +
        downloadSuggestedTemplateLink
      : i`Please provide a list of the brand’s trademark registration(s) on the ` +
        i`brand owner’s company letterhead. Be sure to include a table of ` +
        i`registration number(s), region(s) in which the trademark(s) are ` +
        i`registered, and expiration date(s) of each trademark registration. ` +
        i`In addition, please include a section where the brand owner names your ` +
        i`Wish merchant name as an authorized reseller of the brand's products.  ` +
        downloadSuggestedTemplateLink;

  const validate = (isValid: boolean | string | null | undefined) => {
    if (!continuePressed || !!isValid) {
      return null;
    }

    return i`This is a required field.`;
  };

  const documentsValid =
    !continuePressed || currentApplication.documents.length > 0;

  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>{titleText}</H5>
      <Markdown
        style={css(styles.subtitle, documentsValid ? null : styles.errorText)}
        text={subTitleText}
        openLinksInNewTab
      />

      <HorizontalField
        title={i`Upload Document(s)`}
        style={css(styles.field)}
        required
      >
        <DEPRECATEDFileInput
          bucket="TEMP_UPLOADS"
          accepts=".jpeg,.jpg,.png,.pdf"
          onAttachmentsChanged={(attachments) => {
            currentApplication.documents = attachments;
          }}
          attachments={currentApplication.documents}
          maxSizeMB={2}
          maxAttachments={5}
        />
      </HorizontalField>

      <MultiCountryInput
        acceptedTrademarkCountries={acceptedTrademarkCountries}
        title={i`Region(s) Listed on your Document`}
        popoverContent={
          i`On the uploaded document(s), the list of region(s) where the brand ` +
          i`has trademark registration(s); e.g. United States, European Union, or Global`
        }
        placeholder={i`e.g. United States, European Union, Global, etc.`}
        value={
          currentApplication.regions
            ? (currentApplication.regions.split(",") as ReadonlyArray<
                ABSBTrademarkCountryCode
              >)
            : ([] as ReadonlyArray<ABSBTrademarkCountryCode>)
        }
        onChange={(newValue) => {
          const newRegions = newValue ? newValue.join(",") : "";
          currentApplication.regions = newRegions;
          currentApplication.regionsValid = newRegions.length > 0;
          currentApplication.trademarkEdited = true;
        }}
        style={css(styles.field)}
        inputProps={{
          validationResponse: validate(currentApplication.regionsValid),
        }}
      />

      <HorizontalField
        title={i`Name of Brand Owner`}
        popoverContent={i`The name of the person, company, or entity that owns the brand`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.brandOwner = text;
            currentApplication.trademarkEdited = true;
          }}
          value={currentApplication.brandOwner}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid: boolean) => {
            currentApplication.brandOwnerValid = isValid;
          }}
          validationResponse={validate(currentApplication.brandOwner)}
          placeholder={i`e.g. Adidas AG`}
          debugValue={faker.company.companyName()}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Name of Brand Representative`}
        popoverContent={i`The name of the brand representative who prepared the document(s)`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.brandRep = text;
            currentApplication.trademarkEdited = true;
          }}
          value={currentApplication.brandRep}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) => {
            currentApplication.brandRepValid = isValid;
          }}
          validationResponse={validate(currentApplication.brandRep)}
          placeholder={i`e.g. Roland Auschel`}
          debugValue={faker.name.findName()}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Title of Brand Representative`}
        popoverContent={i`The professional title of the brand representative who prepared the document(s)`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.brandRepTitle = text;
            currentApplication.trademarkEdited = true;
          }}
          value={currentApplication.brandRepTitle}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) => {
            currentApplication.brandRepTitleValid = isValid;
          }}
          validationResponse={validate(currentApplication.brandRepTitle)}
          placeholder={i`e.g. Executive Board Member for Global Sales`}
          debugValue={faker.name.jobTitle()}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Phone Number`}
        popoverContent={i`The phone number of the brand representative who prepared the document(s)`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <PhoneNumberField
          country={phoneNumberCountry}
          onPhoneNumber={({ country, areaCode, phoneNumber }) => {
            setPhoneNumberCountry(country);
            currentApplication.phoneNumber = areaCode + phoneNumber;
            currentApplication.trademarkEdited = true;
          }}
          onValidityChanged={(isValid) => {
            currentApplication.phoneNumberValid = isValid;
          }}
          validators={[new RequiredValidator()]}
          validationResponse={validate(currentApplication.phoneNumber)}
          showTitle={false}
          showViewExamples={false}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Email Address`}
        popoverContent={i`The email address of the brand representative who prepared the document(s)`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.email = text;
            currentApplication.trademarkEdited = true;
          }}
          value={currentApplication.email}
          validators={[new RequiredValidator(), new EmailValidator()]}
          onValidityChanged={(isValid) => {
            currentApplication.emailValid = isValid;
          }}
          validationResponse={validate(currentApplication.email)}
          placeholder={i`e.g. rauschel@adidasgroup.com`}
          debugValue={faker.internet.email()}
        />
      </HorizontalField>

      <Footer
        continueDisabled={!currentApplication.trademarkEdited}
        onContinue={() => {
          if (currentApplication.trademarkRegistrationsStepComplete) {
            currentApplication.setCurrentStep("BRANDED_PRODUCT_DECLARATION");
          } else {
            setContinuePressed(true);
          }
        }}
        style={css(styles.footer)}
        currentApplication={currentApplication}
      />
    </div>
  );
};
export default observer(TrademarkRegistrationsScreen);

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        title: {
          marginTop: 24,
        },
        subtitle: {
          margin: "8px 0px 36px",
          width: "calc(100% - 192px)",
          textAlign: "center",
        },
        field: {
          margin: "8px 0px",
          width: "calc(100% - 192px)",
          minHeight: 40,
        },
        footer: {
          marginTop: 32,
        },
        errorText: {
          color: negative,
        },
      }),
    [negative]
  );
};
