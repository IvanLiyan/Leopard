import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Lego Components */
import { Card, HorizontalField } from "@ContextLogic/lego";
import { HorizontalFieldProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { UserEntityType } from "@schema/types";
import { useTaxStore } from "@merchant/stores/TaxStore";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";

import AccountTypeLabel from "@merchant/component/tax/enrollment-v2/mx/AccountLabelType";

export type MXTaxSettingsTableProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly entityType: UserEntityType | null | undefined;
};

const MXTaxSettingsTable = ({
  className,
  style,
  taxInfos,
  entityType,
}: MXTaxSettingsTableProps) => {
  const styles = useStylesheet();
  const taxStore = useTaxStore();

  const mxSettings = useMemo(
    () =>
      _.find(taxInfos, {
        countryCode: "MX",
        authorityLevel: "COUNTRY",
      }),
    [taxInfos],
  );

  const fieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.field),
    titleStyle: { ...styles.fieldTitle },
    titleWidth: 340,
    titleAlign: "start",
    // centerTitleVertically: true,
    // centerContentVertically: true,
  };

  const defaultShipFromText = mxSettings?.mxDefaultShipFromIsMX
    ? i`Orders are shipped from Mexico`
    : i`Orders are not shipped from Mexico`;

  return (
    <Card className={css(styles.root, className, style)}>
      <HorizontalField title={i`Account type`} {...fieldProps}>
        <AccountTypeLabel entityType={entityType} />
      </HorizontalField>
      <HorizontalField
        title={taxStore.getTaxNumberName({ countryCode: "MX" })}
        popoverMaxWidth={250}
        popoverContent={taxStore.getTaxDescription({ countryCode: "MX" })}
        {...fieldProps}
      >
        {mxSettings?.taxNumber}
      </HorizontalField>
      <HorizontalField
        title={i`Default ship-from location`}
        popoverContent={
          i`For Mexico-bound orders, please select the default ` +
          i`ship-from location below. Your selection may be used to ` +
          i`calculate VAT at the time of customer purchase.` // TODO (lliepert): add learn more link once FAQ ready (not before launch)
        }
        {...fieldProps}
      >
        {defaultShipFromText}
      </HorizontalField>
    </Card>
  );
};

export default observer(MXTaxSettingsTable);

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          border: `1px solid ${borderPrimary}`,
        },
        field: {
          width: "100%",
          padding: "12px 24px",
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        fieldTitle: {
          color: textBlack,
          fontWeight: weightSemibold,
        },
      }),
    [borderPrimary, textBlack],
  );
};
