/*
 * EnrollmentSummary.tsx
 *
 * Created by Jonah Dlin on Thu Nov 26 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import {
  CheckboxField,
  PrimaryButton,
  BackButton,
  Link,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { weightBold, weightNormal } from "@toolkit/fonts";

/* Merchant Components */
import CurrentTaxSettingsSummary from "@merchant/component/tax/enrollment-v2/summary/CurrentTaxSettingsSummary";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

export type EnrollmentSummaryProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const EnrollmentSummary: React.FC<EnrollmentSummaryProps> = ({
  className,
  style,
  editState,
}: EnrollmentSummaryProps) => {
  const styles = useStylesheet();
  const [settingsConfirmed, setSettingsConfirmed] = useState(false);

  const {
    pushNext,
    pushPrevious,
    currentCountries,
    pendingTaxInfos,
    entityType,
    hasCompletedSellerVerification,
    countryOfDomicile,
  } = editState;

  const onSubmitClicked = () => {
    pushNext();
  };

  if (currentCountries.length == 0) {
    // No countries setup.
    return null;
  }
  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <section className={css(styles.title)}>
          <span>Collect taxes for selected countries</span>
        </section>
        <section className={css(styles.description)}>
          Things are looking good! Review your tax settings for the selected
          countries before submitting.
        </section>
      </div>
      <div className={css(styles.inner)}>
        <CurrentTaxSettingsSummary
          taxInfos={pendingTaxInfos}
          entityType={entityType}
          isValidated={hasCompletedSellerVerification}
          countryOfDomicile={countryOfDomicile}
          editState={editState}
        />
        <CheckboxField
          className={css(styles.confirmation)}
          checked={settingsConfirmed}
          onChange={(checked) => setSettingsConfirmed(checked)}
        >
          <div className={css(styles.confirmationText)}>
            <span>
              By clicking "Submit", you agree that you are responsible for the
              accuracy of any information you have provided and for the
              collection, reporting, and payment of all taxes to the appropriate
              authorities. You further agree to the terms set forth in the Wish
              Merchant Tax Policy.
            </span>
            <Link
              href="/tax/policy"
              openInNewTab
              className={css(styles.policyLink)}
            >
              View policy
            </Link>
          </div>
        </CheckboxField>
        <div className={css(styles.bottomSection)}>
          <BackButton onClick={() => pushPrevious()} isRouterLink />

          <PrimaryButton
            isDisabled={!settingsConfirmed}
            onClick={onSubmitClicked}
          >
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default observer(EnrollmentSummary);

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        titleContainer: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 25px 30px 25px",
          color: textBlack,
        },
        title: {
          fontSize: 20,
          fontWeight: weightBold,
          lineHeight: 1.4,
          marginBottom: 8,
        },
        description: {
          fontSize: 15,
          fontWeight: weightNormal,
          lineHeight: 1.4,
        },
        inner: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        confirmation: {
          margin: "20px 25px",
        },
        confirmationText: {
          fontSize: 14,
          color: textDark,
          textOverflow: "ellipsis",
          wordWrap: "break-word",
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        policyLink: {
          marginTop: 1,
          marginLeft: 3,
        },
      }),
    [textBlack, textDark, borderPrimary]
  );
};
