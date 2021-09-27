import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import {
  TextInput,
  HorizontalField,
  Select,
  Field,
  Text,
} from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";
import { HorizontalFieldProps } from "@ContextLogic/lego";

import { DEPRECATEDFileInput } from "@merchant/component/core";

/* Relative Imports */
import InfoTip from "./InfoTip";
import { getDocOptions } from "@toolkit/seller-profile-verification/doc-type";
import IdentityPageDateOfBirthField from "./IdentityPageDateOfBirthField";
import CardHeader from "./CardHeader";

/* Merchant API Params */
import { DocType } from "@merchant/api/seller-profile-verification";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { mdLink, mdList } from "@ContextLogic/lego/toolkit/string";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import { AttachmentInfo } from "@ContextLogic/lego";

type IdentityPageCompanyProps = BaseProps & {
  readonly countryCodeDomicile: CountryCode | null | undefined;
  readonly firstName: string | null | undefined;
  readonly lastName: string | null | undefined;
  readonly middleName: string | null | undefined;
  readonly onFirstNameChange: (name: string) => void;
  readonly onLastNameChange: (name: string) => void;
  readonly onMiddleNameChange: (name: string) => void;
  readonly birthDay: Date | null;
  readonly onBirthDayChange: (day: Date) => void;
  readonly birthYear: number | null;
  readonly onBirthYearChange: (year: number) => void;
  readonly companyName: string | null | undefined;
  readonly onCompanyNameChange: (name: string | null | undefined) => void;
  readonly onSelectDocType: (docType: DocType) => void;
  readonly uploadedImages: ReadonlyArray<AttachmentInfo>;
  readonly onUpload: (images: ReadonlyArray<AttachmentInfo>) => void;
  readonly onBack: () => unknown;
};

const IdentityPageCompany = (props: IdentityPageCompanyProps) => {
  const {
    className,
    style,
    countryCodeDomicile,
    firstName,
    lastName,
    middleName,
    birthDay,
    birthYear,
    onFirstNameChange,
    onLastNameChange,
    onMiddleNameChange,
    onBirthDayChange,
    onBirthYearChange,
    companyName,
    onCompanyNameChange,
    onSelectDocType,
    uploadedImages,
    onUpload,
    onBack,
  } = props;

  const styles = useStylesheet();

  const handleSelectDocType = (docType: DocType) => {
    setSelectedDocType(docType);
    onSelectDocType(docType);
  };

  const renderFieldTitle = (text: string) => {
    return <div className={css(styles.fieldTitle)}>{text}</div>;
  };

  const renderFullnameFieldsForCN = () => {
    return (
      <div className={css(styles.nameFields)}>
        <TextInput
          value={lastName}
          placeholder={`姓`}
          onChange={({ text }) => onLastNameChange(text)}
        />
        <TextInput
          value={firstName}
          placeholder={`名`}
          onChange={({ text }) => onFirstNameChange(text)}
        />
      </div>
    );
  };

  const renderFullnameFieldsForNonCN = () => {
    return (
      <div className={css(styles.nameFields)}>
        <Field title={i`First Name`}>
          <TextInput
            value={firstName}
            placeholder={i`Enter your first name`}
            onChange={({ text }) => onFirstNameChange(text)}
            disabled
          />
        </Field>
        <Field title={i`Last Name`}>
          <TextInput
            value={lastName}
            placeholder={i`Enter your last name`}
            onChange={({ text }) => onLastNameChange(text)}
            disabled
          />
        </Field>
        <Field title={i`Middle Name (Optional)`}>
          <TextInput
            value={middleName}
            placeholder={i`Enter your middle name`}
            onChange={({ text }) => onMiddleNameChange(text)}
          />
        </Field>
      </div>
    );
  };

  const renderFullnameFields = () => {
    if (countryCodeDomicile == "CN") {
      return renderFullnameFieldsForCN();
    }
    return renderFullnameFieldsForNonCN();
  };

  const horizontalFieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.field),
    titleAlign: "start",
    titleWidth: 220,
  };

  const handleViewImage = (
    images: ReadonlyArray<AttachmentInfo>,
    index: number
  ) => {
    const img = images[index];
    if (!img) {
      return;
    }
    const url = img.url;
    window.open(url);
  };

  const nameTip = () => (
    <div className={css(styles.tip)}>
      <p>
        Provide the name of your Primary Contact Person who has access to your
        merchant account and can provide the registration information on your
        behalf.
      </p>
      <p>
        In other words, your Primary Contact Person can initiate transactions
        such as disbursements and refunds. Any actions taken by the Primary
        Contact Person are deemed to be taken by the merchant account holder.
      </p>
    </div>
  );

  const companyTip = () => (
    <div className={css(styles.tip)}>
      <p>
        Your company name must be consistent with the name on your Proof of
        Identity
      </p>
    </div>
  );
  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null);

  const info1 = {
    subtitle: i`Accepted documents include the following:`,
    paragraphs: [
      mdList(
        mdLink(
          i`Government-issued Business License`,
          "https://en.wikipedia.org/wiki/Business_license"
        )
      ),
      mdList(
        mdLink(
          i`Articles of Incorporation, Certificate of Incorporation` +
            i` or a Partnership agreement`,
          "https://en.wikipedia.org/wiki/Articles_of_incorporation"
        )
      ),
      mdList(
        mdLink(
          i`Recent business returns`,
          "https://www.irs.gov/businesses/small-businesses-self-employed/business-taxes"
        ) +
          " " +
          i`(i.e. US Corporation Income Tax Return Form 1120` +
          i` or Form 1120-S, Partnership Return Form 1065 or K-1s associated with the` +
          i` business, other non-US local country business tax returns)`
      ),
      mdList(
        mdLink(
          i`VAT Registration Certificate`,
          "https://en.wikipedia.org/wiki/Value-added_tax"
        )
      ),
    ],
    textSectionStyles: {
      subtitleFontSize: 14,
      spaceBetweenTitleAreaAndText: 10,
      spaceBetweenParagraphs: 0,
    },
  };

  const info2 = {
    paragraphs:
      i`The document(s) you upload should clearly show your **full name** and the` +
      i` **country/region of domicile** you have previously provided.`,
  };

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"both"}
        pageNumberDisplay={"2 / 2"}
      />
      <Text weight="bold" className={css(styles.title)}>
        Validate your business merchant account type
      </Text>
      <div className={css(styles.content)}>
        Provide information that confirms your company's identity.
      </div>
      <HorizontalField
        title={() => renderFieldTitle(i`Account type`)}
        centerTitleVertically
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue)}>Company</div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Primary contact person`)}
        popoverContent={nameTip}
        {...horizontalFieldProps}
      >
        {renderFullnameFields()}
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Date of birth`)}
        {...horizontalFieldProps}
      >
        <IdentityPageDateOfBirthField
          birthDay={birthDay}
          onBirthDayChange={onBirthDayChange}
          birthYear={birthYear}
          onBirthYearChange={onBirthYearChange}
        />
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Company name`)}
        centerTitleVertically
        popoverContent={companyTip}
        {...horizontalFieldProps}
      >
        <TextInput
          value={companyName}
          onChange={({ text }) => onCompanyNameChange(text)}
          placeholder={i`Enter your company name`}
        />
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Proof of identity`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValueGrid)}>
          <Select
            placeholder={i`Select a document type`}
            options={getDocOptions(false, countryCodeDomicile == "CN")}
            selectedValue={selectedDocType}
            onSelected={handleSelectDocType}
            position="bottom center"
          />
          {countryCodeDomicile != "CN" && <InfoTip {...info1} />}
          <DEPRECATEDFileInput
            bucket="TEMP_UPLOADS"
            accepts=".jpeg,.jpg,.png,.gif"
            maxSizeMB={5}
            attachments={uploadedImages}
            maxAttachments={5}
            onAttachmentsChanged={onUpload}
            onViewAttachments={handleViewImage}
          />
          <InfoTip {...info2} />
        </div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Proof of identity must show`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue, styles.proofGrid)}>
          <div>Company name</div>
          <div>{companyName}</div>
          <div>Country/region of domicile</div>
          {countryCodeDomicile && (
            <Flag
              className={css(styles.flag)}
              countryCode={countryCodeDomicile}
              displayCountryName
            />
          )}
        </div>
      </HorizontalField>
    </div>
  );
};

export default IdentityPageCompany;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        header: {
          marginTop: 24,
          color: palettes.greyScaleColors.DarkerGrey,
        },
        back: {
          cursor: "pointer",
        },
        title: {
          fontSize: 24,
          lineHeight: "32px",
          color: palettes.textColors.Ink,
          textAlign: "center",
        },
        content: {
          marginTop: 16,
          color: palettes.textColors.DarkInk,
          textAlign: "center",
        },
        tip: {
          padding: "10px 10px 0 10px",
          fontSize: 14,
          maxWidth: 300,
        },
        field: {
          marginTop: 40,
          maxWidth: 700,
          width: "100%",
        },
        fieldTitle: {
          color: palettes.textColors.DarkInk,
        },
        fieldValue: {
          color: palettes.textColors.Ink,
        },
        fieldValueGrid: {
          display: "grid",
          gridTemplateColumns: "1fr",
          gridGap: 10,
        },
        nameFields: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
        },
        proofGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
        },
        row: {
          display: "flex",
          alignItems: "center",
        },
        flag: {
          width: 24,
        },
      }),
    []
  );
};
