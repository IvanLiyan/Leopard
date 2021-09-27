import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

import {
  TextInput,
  Select,
  HorizontalField,
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

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import { AttachmentInfo } from "@ContextLogic/lego";
import moment from "moment/moment";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type IdentityPageIndividualProps = BaseProps & {
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
  readonly onSelectDocType: (docType: DocType) => void;
  readonly uploadedImages: ReadonlyArray<AttachmentInfo>;
  readonly onUpload: (images: ReadonlyArray<AttachmentInfo>) => void;
  readonly onBack: () => unknown;
};

const IdentityPageIndividual = (props: IdentityPageIndividualProps) => {
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
    onSelectDocType,
    uploadedImages,
    onUpload,
    onBack,
  } = props;

  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null);

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

  const getName = () => {
    if (lastName == null || firstName == null) {
      return null;
    }

    if (countryCodeDomicile == "CN") {
      return `${lastName}${firstName}`;
    }
    return `${firstName} ${lastName}`;
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

  const nameTipText =
    i`You may provide your full name in your native alphabet.` +
    i` If your native alphabet contains non-roman characters` +
    i` (e.g., Chinese, Russian, etc.), you can enter your name` +
    i` in the characters of your native alphabet.`;
  const nameTip = () => (
    <div className={css(styles.tip)}>
      <p>{nameTipText}</p>
    </div>
  );

  const info =
    i`The document(s) you upload should clearly show your **full name** and` +
    i` the **country/region of domicile** you have previously provided.`;

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"both"}
        pageNumberDisplay={"2 / 2"}
      />
      <Text weight="bold" className={css(styles.title)}>
        Validate your individual merchant account type
      </Text>
      <div className={css(styles.content)}>
        Provide information that confirms your identity.
      </div>
      <HorizontalField
        title={() => renderFieldTitle(i`Account type`)}
        centerTitleVertically
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue)}>Individual</div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Full name`)}
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
        title={() => renderFieldTitle(i`Proof of identity`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValueGrid)}>
          <Select
            placeholder={i`Select a document type`}
            options={getDocOptions(true, countryCodeDomicile == "CN")}
            selectedValue={selectedDocType}
            onSelected={handleSelectDocType}
            position="bottom center"
          />
          <DEPRECATEDFileInput
            bucket="TEMP_UPLOADS"
            accepts=".jpeg,.jpg,.png,.gif"
            maxSizeMB={5}
            attachments={uploadedImages}
            maxAttachments={5}
            onAttachmentsChanged={onUpload}
            onViewAttachments={handleViewImage}
          />
          <InfoTip paragraphs={info} />
        </div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Proof of identity must show`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue, styles.proofGrid)}>
          <div>Full name</div>
          <div>{getName()}</div>
          <div>Date of birth</div>
          <div>
            {birthDay &&
              birthYear &&
              formatDatetimeLocalized(
                moment(birthDay).year(birthYear),
                "YYYY-MM-DD"
              )}
          </div>
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

export default IdentityPageIndividual;

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
