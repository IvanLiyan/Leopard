import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import AreaCodes from "@toolkit/area-codes";

/* Merchant API */
import { setData } from "@merchant/api/seller-profile-verification";

/* Relative Imports */
import ContinueButton from "./ContinueButton";
import PhoneNumberPageEnterNumber, {
  PhoneNumberPageEnterNumberProps,
} from "./PhoneNumberPageEnterNumber";
import PhoneNumberPageVerified from "./PhoneNumberPageVerified";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type PhoneNumberProps = BaseProps & {
  readonly countryCodeDomicile: CountryCode | null | undefined;
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const PhoneNumberPage = (props: PhoneNumberProps) => {
  const {
    className,
    style,
    onNext,
    isRefetchingData,
    countryCodeDomicile,
  } = props;
  const { userStore } = AppStore.instance();
  const { loggedInMerchantUser } = userStore;
  const { phone_number: phoneNumberInMU } = loggedInMerchantUser;

  const defaultPhoneNumber = () => {
    let countryCode = null;
    if (countryCodeDomicile) {
      countryCode = AreaCodes[countryCodeDomicile.toUpperCase() as CountryCode];
    }
    if (countryCode == null) {
      return null;
    }

    const ccStr = `+${countryCode}`;
    if (phoneNumberInMU.startsWith(ccStr)) {
      return phoneNumberInMU.substr(ccStr.length);
    }

    return null;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currPhoneNumber, setCurrPhoneNumber] = useState<
    string | null | undefined
  >(defaultPhoneNumber());
  const [veriCode, setVeriCode] = useState("");
  const [currPhoneNumberValid, setCurrPhoneNumberValid] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const isValid = () => {
    return !!(currPhoneNumber && veriCode);
  };
  const handleSubmit = async () => {
    if (!phoneVerified) {
      if (!currPhoneNumber || !veriCode) {
        return;
      }
      setIsSubmitting(true);
      let areaCode = "";
      if (countryCodeDomicile) {
        areaCode = AreaCodes[countryCodeDomicile].toString();
      }
      try {
        await setData({
          page_name: "PhoneNumberPage",
          phone_number_area_code: areaCode,
          phone_number: currPhoneNumber || "",
          verification_code: veriCode,
        }).call();
        setPhoneVerified(true);
        setIsSubmitting(false);
      } catch (e) {
        setIsSubmitting(false);
      }
    } else {
      onNext();
    }
  };

  const handlePhoneNumberChange = (
    ...args: Parameters<PhoneNumberPageEnterNumberProps["onPhoneNumber"]>
  ) => {
    const [phoneNumber] = args;
    setCurrPhoneNumber(phoneNumber);
  };

  const styles = useStylesheet();

  return (
    <div className={css(styles.root, style, className)}>
      {!phoneVerified ? (
        <PhoneNumberPageEnterNumber
          countryCodeDomicile={countryCodeDomicile}
          phoneNumber={currPhoneNumber}
          onPhoneNumber={handlePhoneNumberChange}
          phoneNumberValid={currPhoneNumberValid}
          onPhoneNumberValidityChanged={setCurrPhoneNumberValid}
          verificationCode={veriCode}
          onVerificationCodeChange={setVeriCode}
        />
      ) : (
        <PhoneNumberPageVerified
          countryCodeDomicile={countryCodeDomicile}
          phoneNumber={currPhoneNumber}
        />
      )}
      <Illustration
        className={css(styles.img)}
        name="computerPhoneOnDesk"
        alt=""
      />
      <ContinueButton
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        text={i`Continue`}
        isDisabled={!isValid()}
      />
    </div>
  );
};

export default PhoneNumberPage;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        img: {
          marginTop: 60,
        },
      }),
    []
  );
};
