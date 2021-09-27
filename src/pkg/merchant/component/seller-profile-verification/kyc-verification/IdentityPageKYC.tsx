import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { getKYCRedirection, setData } from "@merchant/api/kyc-verification";
import { GenderType } from "@merchant/api/kyc-verification";

/* SellerProfileVerification Imports */
import IdentityPageChooseEntityType from "@merchant/component/seller-profile-verification/IdentityPageChooseEntityType";
import FooterButton from "@merchant/component/seller-profile-verification/kyc-verification/FooterButton";

/* Relative Imports */
import FourthlineAdditionalInfo from "./FourthlineAdditionalInfo";
import DnBRedirectPage from "./DnBRedirectPage";
import FourthlineRedirectPage from "./FourthlineRedirectPage";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  GetKYRedirectionParam,
  EntityTypeName,
} from "@merchant/api/kyc-verification";

import { CountryCode } from "@toolkit/countries";
import moment from "moment/moment";
import DnBAdditionalInfo from "@merchant/component/seller-profile-verification/kyc-verification/DnBAdditionalInfo";

type IdentityKYCProps = BaseProps & {
  readonly isRefetchingData: boolean;
  readonly skipVerification: boolean;
  readonly onBack: () => void;
  readonly onFinished: () => void;
};

const IdentityPageKYC = (props: IdentityKYCProps) => {
  const {
    className,
    style,
    isRefetchingData,
    onBack,
    skipVerification,
    onFinished,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currEntityType, setCurrEntityType] = useState<
    EntityTypeName | null | undefined
  >(null);
  const [currPage, setCurrPage] = useState(1);
  const [KYCRedirect, setKYCRedirect] = useState("");

  const [birthCity, setBirthCity] = useState<string | null>(null);
  const [birthCountry, setBirthCountry] = useState<
    CountryCode | null | undefined
  >(null);
  const [birthDay, setBirthDay] = useState<Date | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [gender, setGender] = useState<GenderType | null>(null);
  const [nationality, setNationality] = useState<
    CountryCode | null | undefined
  >(null);
  const [businessNumber, setBusinessNumber] = useState<string | null>(null);

  const isValid = () => {
    if (currPage == 1) {
      return currEntityType != null;
    } else if (currPage == 2) {
      if (currEntityType === "individual") {
        return (
          birthCity &&
          birthYear &&
          birthDay &&
          birthCountry &&
          nationality &&
          gender
        );
      }
      return businessNumber && businessNumber.trim().length > 0;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    }

    if (skipVerification) {
      if (currEntityType) {
        setIsSubmitting(true);
        await setData({
          page_name: "IdentityPageKYC",
          entity_type_name: currEntityType,
        }).call();
        onFinished();
      }
      return;
    }

    let hasError = false;

    if (currPage == 2) {
      setIsSubmitting(true);
      let processData: GetKYRedirectionParam;
      if (currEntityType == "individual") {
        // TS does not recognize the check from isValid
        if (
          !(
            birthCity &&
            birthYear &&
            birthDay &&
            birthCountry &&
            nationality &&
            gender
          )
        ) {
          return;
        }

        const birthday = moment(birthDay).year(birthYear);
        processData = {
          entity_type_name: "individual",
          nationality,
          birth_city: birthCity,
          birth_country: birthCountry,
          birthday_timestamp: birthday ? birthday.unix() : 0,
          gender,
        };
      } else {
        if (!businessNumber) {
          return;
        }
        processData = {
          entity_type_name: "company",
          business_number: businessNumber,
        };
      }
      const resp = await getKYCRedirection(processData).call();
      setIsSubmitting(false);
      const data = resp?.data;
      if (!data) {
        return;
      }
      setKYCRedirect(data.kyc_redirect_code);
    }

    setIsSubmitting(true);
    if (!currEntityType) {
      return;
    }
    try {
      await setData({
        page_name: "IdentityPageKYC",
        entity_type_name: currEntityType,
      }).call();
      hasError = false;
    } catch (e) {
      hasError = true;
    }
    setIsSubmitting(false);

    if (!hasError) {
      handleNext();
    }
  };

  const handleBack = () => {
    if (!isSubmitting) {
      if (currPage == 1) {
        onBack();
      }
      setCurrPage(currPage - 1);
    }
  };
  const handleNext = () => {
    setCurrPage(currPage + 1);
  };

  const styles = useStylesheet();

  const renderButton = () => {
    return (
      <FooterButton
        className={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        isDisabled={!isValid()}
        text={skipVerification ? i`Submit` : i`Next`}
      />
    );
  };

  const renderPage1 = () => {
    return (
      <>
        <IdentityPageChooseEntityType
          entityType={currEntityType}
          onEntityTypeChange={setCurrEntityType}
          onBack={handleBack}
          hidePageDisplay
        />
        {renderButton()}
      </>
    );
  };

  const renderPage2 = () => {
    if (currEntityType == "individual") {
      return (
        <>
          <FourthlineAdditionalInfo
            nationality={nationality}
            setNationality={setNationality}
            birthCity={birthCity}
            setBirthCity={setBirthCity}
            birthCountry={birthCountry}
            setBirthCountry={setBirthCountry}
            birthDay={birthDay}
            setBirthDay={setBirthDay}
            birthYear={birthYear}
            setBirthYear={setBirthYear}
            gender={gender}
            setGender={setGender}
            onBack={handleBack}
          />
          {renderButton()}
        </>
      );
    }
    return (
      <>
        <DnBAdditionalInfo
          onBack={handleBack}
          businessNumber={businessNumber}
          setBusinessNumber={setBusinessNumber}
        />
        {renderButton()}
      </>
    );
  };

  const renderPage3 = () => {
    if (currEntityType == "individual") {
      return <FourthlineRedirectPage onBack={handleBack} code={KYCRedirect} />;
    }
    return <DnBRedirectPage onBack={handleBack} url={KYCRedirect} />;
  };

  const renderPage = [renderPage1, renderPage2, renderPage3];

  return (
    <div className={css(styles.root, style, className)}>
      {renderPage[currPage - 1]()}
    </div>
  );
};

export default IdentityPageKYC;

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
