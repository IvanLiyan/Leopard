import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { HorizontalField, TitleAlignment } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { getLocalizedDateDisplayText } from "@toolkit/brand/branded-products/utils";

/* Relative Imports */
import Flags from "./Flags";
import ABSBApplicationStatusDisplay from "./ABSBApplicationStatusDisplay";
import ABSBApplicatioNDetailAccordion from "./ABSBApplicationDetailAccordion";
import ABSBApplicationAuthTypeDisplay from "./ABSBApplicationAuthTypeDisplay";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplication } from "@toolkit/brand/branded-products/abs";
import { CountryCode } from "@schema/types";

type AdminInfo = {
  readonly merchantId: string;
  readonly merchantName: string;
  readonly merchantIp: string | null | undefined;
  readonly merchantIpCc: CountryCode | null | undefined;
  readonly merchantCcDomicile: CountryCode | null | undefined;
  readonly accountManagerName: string | null | undefined;
};

export type ABSBApplicationDetailCardProps = BaseProps & {
  readonly brandName: string;
  readonly application: ABSBApplication;
  readonly adminInfo?: AdminInfo;
};

const ABSBApplicationDetailCard = ({
  brandName,
  application,
  adminInfo,
  style,
}: ABSBApplicationDetailCardProps) => {
  const styles = useStylesheet();
  const baseFieldProps = {
    titleStyle: styles.header,
    titleWidth: 200,
    titleAlign: "start" as TitleAlignment,
    centerTitleVertically: true,
  };

  const fieldProps = {
    style: styles.field,
    ...baseFieldProps,
  };

  const flagProps = {
    displayCountryName: true,
    flagContainerStyle: css(styles.flagContainer),
    countryNameStyle: css(styles.flagName),
  };

  return (
    <Card style={style}>
      {adminInfo && (
        <>
          <div className={css(styles.field)}>
            <HorizontalField
              title={i`Merchant name`}
              style={[styles.field, styles.leftField, styles.halfField]}
              {...baseFieldProps}
            >
              <div>{adminInfo.merchantName}</div>
            </HorizontalField>

            <HorizontalField
              title={i`Merchant ID`}
              style={[styles.field, styles.halfField]}
              {...baseFieldProps}
            >
              <Link
                href={`/merchants#merchant_id=${adminInfo.merchantId}`}
                openInNewTab
                className={css(styles.merchantIdLink)}
              >
                {adminInfo.merchantId}
              </Link>
              <Link
                href={`/authentic-brand-seller-badge-application-review?search_text=${adminInfo.merchantId}&status=ALL`}
                openInNewTab
                className={css(styles.merchantIdLink)}
              >
                View merchant applications
              </Link>
            </HorizontalField>
          </div>
          <HorizontalField title={i`Account Manager`} {...fieldProps}>
            <div>{adminInfo.accountManagerName}</div>
          </HorizontalField>
          {adminInfo.merchantIp && adminInfo.merchantIpCc && (
            <HorizontalField title={i`Merchant IP Address`} {...fieldProps}>
              <div className={css(styles.row)}>
                <div>{adminInfo.merchantIp}</div>
                <Flag
                  className={css(styles.flag)}
                  countryCode={adminInfo.merchantIpCc}
                  {...flagProps}
                />
              </div>
            </HorizontalField>
          )}
          {adminInfo.merchantCcDomicile && (
            <HorizontalField title={i`Country of Domicile`} {...fieldProps}>
              <Flag
                className={css(styles.flag)}
                countryCode={adminInfo.merchantCcDomicile}
                {...flagProps}
              />
            </HorizontalField>
          )}
          <HorizontalField title={i`Authorization Type`} {...fieldProps}>
            <ABSBApplicationAuthTypeDisplay
              type={application.authorization_type}
            />
          </HorizontalField>
        </>
      )}
      <HorizontalField title={i`Brand name`} {...fieldProps}>
        <div>{brandName}</div>
      </HorizontalField>

      <HorizontalField title={i`Application ID`} {...fieldProps}>
        <CopyButton
          text={application.application_id}
          copyOnBodyClick
          className={css(styles.copyBtn)}
        >
          {application.application_id}
        </CopyButton>
      </HorizontalField>
      <div className={css(styles.field)}>
        <HorizontalField
          title={i`Status`}
          style={[styles.field, styles.leftField, styles.halfField]}
          {...baseFieldProps}
        >
          <ABSBApplicationStatusDisplay status={application.status} />
        </HorizontalField>

        <HorizontalField
          title={i`Date submitted`}
          style={[styles.field, styles.halfField]}
          {...baseFieldProps}
        >
          <div>{getLocalizedDateDisplayText(application.date_submitted)}</div>
        </HorizontalField>
      </div>

      {application.expiration_date && (
        <HorizontalField title={i`Expiration date`} {...fieldProps}>
          <div>{getLocalizedDateDisplayText(application.expiration_date)}</div>
        </HorizontalField>
      )}
      {application.confirmed_countries && (
        <HorizontalField title={i`Badge region(s)`} {...fieldProps}>
          <Flags
            countries={application.confirmed_countries}
            initialDisplay={10}
            {...flagProps}
          />
        </HorizontalField>
      )}
      {application.status === "REJECTED" && application.note && (
        <HorizontalField title={i`Status reason`} {...fieldProps}>
          <div>{application.note}</div>
        </HorizontalField>
      )}
      <ABSBApplicatioNDetailAccordion application={application} />
    </Card>
  );
};

export default observer(ABSBApplicationDetailCard);

const useStylesheet = () => {
  const { borderPrimary, textBlack, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        field: {
          display: "flex",
          alignItems: "center",
          minHeight: 56,
          borderBottom: "1px solid",
          borderBottomColor: borderPrimary,
        },
        leftField: {
          borderRight: "1px solid",
          borderRightColor: borderPrimary,
        },
        halfField: {
          width: "50%",
          borderBottom: "none",
        },
        header: {
          marginLeft: 24,
          fontWeight: fonts.weightSemibold,
          color: textBlack,
        },
        flagContainer: {
          backgroundColor: surfaceLight,
          padding: "0px 12px",
          borderRadius: 5,
          margin: 6,
          minHeight: 32,
          width: "fit-content",
        },
        flagName: {
          marginLeft: 5,
        },
        copyBtn: {
          width: "fit-content",
        },
        merchantIdLink: {
          marginRight: 50,
        },
        row: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        flag: {
          height: 30,
          width: 30,
          marginRight: 5,
        },
      }),
    [borderPrimary, textBlack, surfaceLight]
  );
};
