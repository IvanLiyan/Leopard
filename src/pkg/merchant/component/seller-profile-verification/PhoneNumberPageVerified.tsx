import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import AreaCodes from "@toolkit/area-codes";
import { Flags4x3 } from "@toolkit/countries";
import { useTheme } from "@merchant/stores/ThemeStore";
/* Merchant API */
//import { setCountryOfDomicile } from "@merchant/api/seller-profile-verification";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

type PhoneNumberPageVerifiedProps = BaseProps & {
  readonly phoneNumber: string | null | undefined;
  readonly countryCodeDomicile: CountryCode | null | undefined;
};

const PhoneNumberPageVerified = (props: PhoneNumberPageVerifiedProps) => {
  const { className, style, phoneNumber, countryCodeDomicile } = props;

  const styles = useStylesheet();

  const infoLink = `[${i`View details`}](/settings#change-phone-number)`;
  const infoText = i`Note that you can update your phone number as needed. ${infoLink}`;

  const countryCode: CountryCode = countryCodeDomicile || "CN";

  return (
    <div className={css(styles.root, style, className)}>
      <Text weight="bold" className={css(styles.title)}>
        Your phone number is verified!
      </Text>
      <Icon className={css(styles.icon)} name="cyanCheckmark" alt="" />
      <div className={css(styles.text)}>Your phone number</div>
      <div className={css(styles.numberLine)}>
        <img
          src={Flags4x3[countryCode.toLowerCase()]}
          className={css(styles.flag)}
        />
        <div>{countryCode}</div>
        <div>{` (+${
          AreaCodes[countryCode.toUpperCase() as CountryCode]
        })`}</div>
        <div className={css(styles.numberSpace)}>{phoneNumber}</div>
      </div>
      <div className={css(styles.info)}>
        <Illustration
          className={css(styles.illustration)}
          name="lightBulbBackgroundColorYellow"
          alt=""
        />
        <Markdown
          className={css(styles.infoText)}
          text={infoText}
          openLinksInNewTab
        />
      </div>
    </div>
  );
};

export default PhoneNumberPageVerified;

const useStylesheet = () => {
  const { textBlack, textDark, pageBackground } = useTheme();
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
        title: {
          marginTop: 40,
          fontSize: 24,
          lineHeight: "32px",
          color: textBlack,
          textAlign: "center",
        },
        icon: {
          width: 64,
          marginTop: 44,
        },
        text: {
          marginTop: 24,
          color: textDark,
          textAlign: "center",
        },
        numberLine: {
          marginTop: 8,
          color: textBlack,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        flag: {
          width: 24,
          marginRight: 4,
        },
        numberSpace: {
          marginLeft: 16,
        },
        info: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 16,
          marginTop: 48,
          backgroundColor: pageBackground,
        },
        illustration: {
          width: 40,
        },
        infoText: {
          textAlign: "justify",
          marginLeft: 12,
          flex: 1,
          color: textBlack,
          fontSize: 14,
        },
      }),
    [textBlack, textDark, pageBackground]
  );
};
