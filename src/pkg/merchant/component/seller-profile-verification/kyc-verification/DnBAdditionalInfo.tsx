import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import {
  H4,
  HorizontalField,
  HorizontalFieldProps,
  TextInput,
} from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* SellerProfileVerification Imports */
import CardHeader from "@merchant/component/seller-profile-verification/CardHeader";

type DnBAdditionalInfoProps = BaseProps & {
  readonly businessNumber: string | null;
  readonly setBusinessNumber: (businessNumber: string) => void;
  readonly onBack: () => unknown;
};

const DnBAdditionalInfo = (props: DnBAdditionalInfoProps) => {
  const { className, style, businessNumber, setBusinessNumber, onBack } = props;
  const styles = useStylesheet();
  const info = i`Provide information that confirms your identity.`;
  const businessRegistrationInfo =
    i`The Business Registration Number (also known as the company number, ` +
    i`registration number, or simply, CRN, BRN) is a number issued by your ` +
    i`government body when registering your entity with the federal or local ` +
    i`authority and is used to identify and verify your business.`;

  const renderFieldTitle = (text: string) => {
    return <div className={css(styles.fieldTitle)}>{text}</div>;
  };

  const horizontalFieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.field),
    titleAlign: "start",
    titleWidth: 240,
  };

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"back"}
      />
      <H4>Validate your business merchant account type</H4>
      <div className={css(styles.content)}>{info}</div>

      <HorizontalField
        title={() => renderFieldTitle(i`Account type`)}
        centerTitleVertically
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue)}>Business</div>
      </HorizontalField>

      <HorizontalField
        title={() => renderFieldTitle(i`Business registration number`)}
        popoverContent={businessRegistrationInfo}
        {...horizontalFieldProps}
      >
        <TextInput
          value={businessNumber}
          placeholder={i`Enter your business registration number`}
          onChange={({ text }) => setBusinessNumber(text)}
        />
      </HorizontalField>
    </div>
  );
};

export default DnBAdditionalInfo;

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
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
        },
        content: {
          marginTop: 16,
          color: textDark,
          textAlign: "center",
        },
        field: {
          marginTop: 40,
          maxWidth: 700,
          width: "100%",
        },
        fieldTitle: {
          color: textDark,
        },
        fieldValue: {
          color: textBlack,
        },
      }),
    [textDark, textBlack],
  );
};
