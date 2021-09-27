import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { setData, DocType } from "@merchant/api/seller-profile-verification";

/* Relative Imports */
import ContinueButton from "./ContinueButton";
import IdentityPageChooseEntityType from "./IdentityPageChooseEntityType";
import IdentityPageIndividual from "./IdentityPageIndividual";
import IdentityPageCompany from "./IdentityPageCompany";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { EntityTypeName } from "@merchant/api/seller-profile-verification";
import { CountryCode } from "@toolkit/countries";
import { AttachmentInfo } from "@ContextLogic/lego";
import moment from "moment/moment";

type IdentityProps = BaseProps & {
  readonly countryCodeDomicile: CountryCode | null | undefined;
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const IdentityPage = (props: IdentityProps) => {
  const {
    className,
    style,
    onNext,
    isRefetchingData,
    countryCodeDomicile,
  } = props;
  const { userStore } = useStore();
  const { loggedInMerchantUser } = userStore;
  const {
    entity_type: defaultEntityTypeNumber,
    first_name: defaultFirstName,
    last_name: defaultLastName,
    company_name: defaultCompanyName,
  } = loggedInMerchantUser;

  const defaultEntityType = (): EntityTypeName | null | undefined => {
    if (defaultEntityTypeNumber == 1) {
      return "individual";
    } else if (defaultEntityTypeNumber == 2) {
      return "company";
    }
    return null;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currEntityType, setCurrEntityType] = useState(defaultEntityType());
  const [currPage, setCurrPage] = useState(1);
  const [currFirstName, setCurrFirstName] = useState(defaultFirstName);
  const [currLastName, setCurrLastName] = useState(defaultLastName);
  const [currMiddleName, setCurrMiddleName] = useState("");
  const [currCompanyName, setCurrCompanyName] = useState(defaultCompanyName);
  const [currBirthYear, setCurrBirthYear] = useState<number | null>(null);
  const [currBirthDay, setCurrBirthDay] = useState<Date | null>(null);
  const [currDocType, setCurrDocType] = useState<DocType | null>(null);
  const [images, setImages] = useState<ReadonlyArray<AttachmentInfo>>([]);

  const isValid = () => {
    if (currPage == 1) {
      return currEntityType != null;
    }

    if (!currFirstName || !currLastName || !currDocType || images.length == 0) {
      return false;
    }
    if (currEntityType != "individual" && currEntityType != "company") {
      return false;
    }
    if (currEntityType == "company" && !currCompanyName) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    }

    if (currPage == 1) {
      setCurrPage(2);
      return;
    }

    let hasError = false;
    setIsSubmitting(true);
    try {
      let birthday = null;
      if (currBirthDay && currBirthYear) {
        birthday = moment(currBirthDay).year(currBirthYear);
      }

      await setData({
        page_name: "IdentityPage",
        entity_type_name: currEntityType || "individual",
        first_name: currFirstName || "",
        last_name: currLastName || "",
        middle_name: currMiddleName || "",
        birthday_timestamp: birthday ? birthday.unix() : 0,
        company_name: currCompanyName,
        uploaded_images: JSON.stringify(images),
        doc_type: currDocType || "national_id",
      }).call();
      hasError = false;
    } catch (e) {
      hasError = true;
      setIsSubmitting(false);
    }

    if (!hasError) {
      onNext();
    }
  };

  const handleBack = () => {
    if (currPage == 1) {
      return;
    }
    setCurrPage(1);
  };

  const styles = useStylesheet();

  const renderPage2 = () => {
    if (currEntityType == "individual") {
      return (
        <IdentityPageIndividual
          countryCodeDomicile={countryCodeDomicile}
          firstName={currFirstName}
          lastName={currLastName}
          middleName={currMiddleName}
          birthDay={currBirthDay}
          birthYear={currBirthYear}
          onFirstNameChange={setCurrFirstName}
          onLastNameChange={setCurrLastName}
          onSelectDocType={setCurrDocType}
          onMiddleNameChange={setCurrMiddleName}
          onBirthDayChange={setCurrBirthDay}
          onBirthYearChange={setCurrBirthYear}
          uploadedImages={images}
          onUpload={setImages}
          onBack={handleBack}
        />
      );
    }
    return (
      <IdentityPageCompany
        countryCodeDomicile={countryCodeDomicile}
        firstName={currFirstName}
        lastName={currLastName}
        middleName={currMiddleName}
        birthDay={currBirthDay}
        birthYear={currBirthYear}
        onFirstNameChange={setCurrFirstName}
        onLastNameChange={setCurrLastName}
        companyName={currCompanyName}
        onCompanyNameChange={setCurrCompanyName}
        onSelectDocType={setCurrDocType}
        onMiddleNameChange={setCurrMiddleName}
        onBirthDayChange={setCurrBirthDay}
        onBirthYearChange={setCurrBirthYear}
        uploadedImages={images}
        onUpload={setImages}
        onBack={handleBack}
      />
    );
  };

  return (
    <div className={css(styles.root, style, className)}>
      {currPage == 1 ? (
        <IdentityPageChooseEntityType
          entityType={currEntityType}
          onEntityTypeChange={setCurrEntityType}
        />
      ) : (
        renderPage2()
      )}
      <ContinueButton
        className={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        text={currPage == 1 ? i`Continue` : i`Submit`}
        isDisabled={!isValid()}
      />
    </div>
  );
};

export default IdentityPage;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        button: {
          marginTop: 40,
        },
      }),
    []
  );
};
