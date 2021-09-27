import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput, BackButton, HorizontalField } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { TaxNumberValidator } from "@toolkit/validators";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useRouteStore } from "@merchant/stores/RouteStore";

export type USProvideFEINProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const USProvideFEIN: React.FC<USProvideFEINProps> = ({
  className,
  style,
  editState,
}: USProvideFEINProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const routeStore = useRouteStore();

  const { getCountryLevelSettings } = editState;

  const [validator] = useState(new TaxNumberValidator({ countryCode: "US" }));

  const countryLevelInfo = getCountryLevelSettings("US");

  const onContinueClicked = () => {
    if (countryLevelInfo == null) {
      return;
    }

    if (countryLevelInfo.numberIsInvalid) {
      toastStore.error(i`Please provide a valid VAT number.`, {
        timeoutMs: 5000,
      });
      return;
    }

    editState.pushNext();
  };

  if (countryLevelInfo == null) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.titleContainerInner)}>
          <section className={css(styles.title)}>Tax for United States</section>
        </div>
        <>2 of {editState.needStateTaxIdsFromUS ? 3 : 2}</>
      </div>
      <div className={css(styles.content)}>
        <section className={css(styles.subTitle)}>
          Please provide your Federal Employer Identification Number (FEIN) for
          the country/region your business is registered in.
        </section>
        <HorizontalField
          title={i`Federal Employer Identification Number (FEIN)`}
        >
          <TextInput
            className={css(styles.input)}
            value={countryLevelInfo.taxNumber}
            height={35}
            onChange={({ text }: OnTextChangeEvent) => {
              countryLevelInfo.taxNumber = text;
            }}
            onValidityChanged={(isValid) =>
              (countryLevelInfo.numberIsInvalid = !isValid)
            }
            placeholder={i`Enter FEIN here`}
            validators={[validator]}
            focusOnMount
          />
        </HorizontalField>
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => routeStore.push("/tax/v2-enroll/US")} />

        <PrimaryButton onClick={onContinueClicked}>
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(USProvideFEIN);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "0px 25px 15px 25px",
          justifyContent: "space-between",
        },
        title: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          color: textBlack,
        },
        titleContainerInner: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        content: {
          padding: "25px 25px 25px 25px",
        },
        gstContainer: {
          display: "flex",
          flexDirection: "column",
        },
        subTitle: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 15,
        },
        input: {
          "@media (min-width: 900px)": {
            maxWidth: 300,
          },
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
    [textBlack, borderPrimary]
  );
};
