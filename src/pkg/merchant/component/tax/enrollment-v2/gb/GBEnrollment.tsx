/*
 * GBEnrollment.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { BackButton, PrimaryButton, Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Stores */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Toolkit */
import { AccountTypeDisplayNames } from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";
import GBTaxNumbers from "./GBTaxNumbers";

export type GBEnrollmentProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const GBEnrollment: React.FC<GBEnrollmentProps> = ({
  className,
  style,
  editState,
}: GBEnrollmentProps) => {
  const {
    getCountryLevelSettings,
    pushNext,
    entityType,
    hasCompletedSellerVerification,
  } = editState;

  const countryLevelInfo = useMemo(():
    | CommerceMerchantTaxInfo
    | null
    | undefined => {
    return getCountryLevelSettings("GB");
  }, [getCountryLevelSettings]);

  useMountEffect(() => {
    window.scrollTo(0, 0);
  });

  const toastStore = useToastStore();
  const styles = useStylesheet();

  const onContinueClicked = () => {
    if (countryLevelInfo == null) {
      return;
    }

    if (countryLevelInfo.numberIsInvalid) {
      toastStore.error(i`Please provide valid tax identification.`, {
        timeoutMs: 5000,
      });
      return;
    }

    pushNext();
  };

  if (countryLevelInfo == null) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.topSection)}>
        <div className={css(styles.title)}>Tax for United Kingdom</div>
        <div className={css(styles.content)}>
          <div className={css(styles.fieldLeft, styles.gridCenter)}>
            <div className={css(styles.fieldTitle)}>Account type</div>
            {hasCompletedSellerVerification && (
              <Info
                className={css(styles.titleInfo)}
                position="top center"
                text={
                  i`Based on our record, your account type has been ` +
                  i`successfully validated`
                }
              />
            )}
          </div>
          <div className={css(styles.fieldRight)}>
            {AccountTypeDisplayNames[entityType]}
            {hasCompletedSellerVerification && (
              <ValidatedLabel
                className={css(styles.validatedLabel)}
                state="VALIDATED"
                popoverContent={() => (
                  <div className={css(styles.labelPopover)}>
                    Your Wish store is validated to unlock unlimited sales and
                    additional merchant features to expand your business.
                  </div>
                )}
                popoverPosition="top center"
              />
            )}
          </div>
          <div className={css(styles.fieldLeft)}>
            <div className={css(styles.fieldTitle)}>Tax identification</div>
          </div>
          <div className={css(styles.fieldRight)}>
            <GBTaxNumbers editState={editState} />
          </div>
        </div>
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <PrimaryButton onClick={onContinueClicked}>
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(GBEnrollment);

const useStylesheet = () => {
  const { borderPrimary, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topSection: {
          display: "flex",
          flexDirection: "column",
          padding: "14px 24px 24px 24px",
        },
        title: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: textBlack,
          fontSize: 20,
          lineHeight: 1.4,
          fontWeight: fonts.weightBold,
          marginBottom: 38,
        },
        content: {
          display: "grid",
          gridAutoColumns: "max-content",
          columnGap: "32px",
          rowGap: 24,
          alignItems: "flex-start",
          alignSelf: "center",
        },
        fieldLeft: {
          display: "flex",
          alignItems: "center",
          gridColumn: 1,
        },
        gridCenter: {
          alignSelf: "center",
        },
        fieldRight: {
          display: "flex",
          alignItems: "center",
          gridColumn: 2,
        },
        fieldTitle: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        titleInfo: {
          marginLeft: 4,
        },
        validatedLabel: {
          marginLeft: 12,
        },
        labelPopover: {
          fontSize: 12,
          lineHeight: "16px",
          maxWidth: 240,
          margin: 8,
        },
        countrySelect: {
          maxWidth: 280,
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
      }),
    [borderPrimary, textBlack, textDark]
  );
};
