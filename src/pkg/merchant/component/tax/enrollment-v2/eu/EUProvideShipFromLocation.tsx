import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { BackButton, PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Components */
import EUSelectShipFromCountry from "@merchant/component/tax/enrollment-v2/eu/EUSelectShipFromCountry";
import EUSelectShipFromCountryFBW from "@merchant/component/tax/enrollment-v2/eu/EUSelectShipFromCountryFBW";

/* Merchant Stores */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { usePersistenceStore } from "@merchant/stores/PersistenceStore";
import { useWishExpressStore } from "@merchant/stores/WishExpressStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";
import { useCountryOptions } from "@toolkit/tax/util";

export type EUProvideShipFromLocationProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const EUProvideShipFromLocation: React.FC<EUProvideShipFromLocationProps> = ({
  className,
  style,
  editState,
}: EUProvideShipFromLocationProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const persistenceStore = usePersistenceStore();
  const { isApprovedForWishExpress } = useWishExpressStore();

  const { currentEUCountries } = editState;

  useMountEffect(() => {
    if (currentEUCountries.length === 0) {
      navigationStore.navigate("/tax/v2-enroll");
      return;
    }
  });

  const countryOptions = useCountryOptions();

  const onContinueClicked = () => {
    editState.pushNext();
  };

  const requiresWEShipFrom = isApprovedForWishExpress;
  const taxExtraInfoDataKey = persistenceStore.get("TaxExtraInfo");

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.content)}>
        <div className={css(styles.titleContainer)}>
          Provide default ship-from location for European Economic Area (EEA)
          orders
        </div>
        <div className={css(styles.description)}>
          For orders bound for countries within the European Economic Area
          (EEA), please provide the default location from which your orders will
          be shipped. Your selection may be used for calculating GST/VAT at the
          time of customer purchase.
        </div>
        {taxExtraInfoDataKey === "FBWWarehouseTaxForm" && (
          <EUSelectShipFromCountryFBW
            editState={editState}
            requiresWEShipFrom={requiresWEShipFrom}
            countryOptions={countryOptions}
          />
        )}
        {taxExtraInfoDataKey == null && (
          <EUSelectShipFromCountry
            editState={editState}
            requiresWEShipFrom={requiresWEShipFrom}
            countryOptions={countryOptions}
          />
        )}
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <PrimaryButton
          onClick={onContinueClicked}
          isDisabled={
            editState.euStandardShipFromCountryCode == null ||
            (requiresWEShipFrom &&
              editState.euWishExpressShipFromCountryCode == null)
          }
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(EUProvideShipFromLocation);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        content: {
          padding: 24,
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
        },
        description: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 38,
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }),
    [textBlack, borderPrimary]
  );
};
