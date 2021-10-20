import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { difference } from "lodash";

/* Lego Components */
import {
  Card,
  CellInfo,
  EditButton,
  Info,
  Markdown,
  OptionsButton,
  Table,
} from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useStringQueryParam } from "@toolkit/url";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useTaxStore } from "@merchant/stores/TaxStore";
import { Popover } from "@merchant/component/core";

/* Merchant Components */
import NorwayVATDetailsModal from "@merchant/component/tax/enrollment-v2/no/NorwayVATDetailsModal";
import EuVATDetailsModal from "@merchant/component/tax/enrollment-v2/eu/EuVATDetailsModal";
import ValidateStoreBanner from "./ValidateStoreBanner";
import USMarketplaceStatesTable from "./USMarketplaceStatesTable";
import USMarketplaceMunicipalities from "./USMarketplaceMunicipalities";
import CaMarketplaceProvincesTable from "./CaMarketplaceProvincesTable";
import EuCountriesTable from "./EuCountriesTable";
import MPFDescription from "./MPFDescription";
import TaxStatusLabel from "./TaxStatusLabel";
import CountriesUpdatedBanner from "./CountriesUpdatedBanner";
import USTaxInfo from "./USTaxInfo";
import CATable from "./settings-tables/CATable";
import EUTable from "./settings-tables/EUTable";
import MXTaxInfo from "./settings-tables/MXTaxInfo";
import OtherTaxInfo from "./settings-tables/OtherTaxInfo";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import {
  isCaDropdown,
  isEuDropdown,
  isGbDropdown,
  isMxDropdown,
  isTaxDropdown,
  isUsMpfDropdown,
  isUsNonTaxDropdown,
  isUsOtherDropdown,
  isCaMpfDropdown,
  isEuMpfDropdown,
  PickedShippingOriginSettings,
  TaxRow,
  TaxConstants,
  UnionCode,
  DropdownData,
} from "@toolkit/tax/types-v2";
import { CommerceMerchantEuEntityStatus } from "@schema/types";

/* Schema */
import { CountryCode } from "@schema/types";
import GBMpfTaxInfo from "./settings-tables/GBMpfTaxInfo";

export type CurrentTaxSettingsCardProps = BaseProps & {
  readonly countryOfDomicileCode?: CountryCode | null | undefined;
  readonly verificationRequired: boolean;
  readonly hasConfiguredTaxesBefore: boolean;
  readonly taxRows: ReadonlyArray<TaxRow>;
  readonly shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
  readonly taxConstants: TaxConstants;
  readonly euVatEntityStatus: CommerceMerchantEuEntityStatus | null | undefined;
  readonly euVatCountryCodes: ReadonlySet<CountryCode>;
  readonly euVatSelfRemittanceEligible: boolean | null | undefined;
};

const SettingsCard: React.FC<CurrentTaxSettingsCardProps> = ({
  className,
  style,
  countryOfDomicileCode,
  verificationRequired,
  hasConfiguredTaxesBefore,
  taxRows,
  taxConstants,
  euVatEntityStatus,
  euVatCountryCodes,
  euVatSelfRemittanceEligible,
}: CurrentTaxSettingsCardProps) => {
  const styles = useStylesheet();
  const { preferredProperLocale } = useLocalizationStore();
  const navigationStore = useNavigationStore();
  const taxStore = useTaxStore();
  const [countryCodesUpdatedParam] = useStringQueryParam("updated");
  const [expandedRows, setExpandedRows] = useState<ReadonlyArray<number>>([]);

  const countriesUpdated = countryCodesUpdatedParam
    .split(",")
    .map((code) => getCountryName(code as CountryCode))
    .filter((country) => country);

  const validateStoreBanner = (!countryOfDomicileCode ||
    verificationRequired) && (
    <ValidateStoreBanner verificationRequired={verificationRequired} />
  );

  const onRowExpandToggled = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(difference(expandedRows, [index]));
      return;
    }
    setExpandedRows([...expandedRows, index]);
  };

  const renderExpandedRow = ({ dropdown }: TaxRow) => {
    if (dropdown == null) {
      return;
    }

    let content;

    if (isUsNonTaxDropdown(dropdown)) {
      const { stateCodes } = dropdown;
      content = <USMarketplaceStatesTable stateCodes={stateCodes} />;
    }

    if (isUsMpfDropdown(dropdown)) {
      const { remitStates, homeRuleStates } = dropdown;
      content = (
        <>
          <MPFDescription />
          <USMarketplaceStatesTable stateCodes={remitStates} />
          <USMarketplaceMunicipalities
            marketplaceMunicipalities={homeRuleStates}
          />
        </>
      );
    }

    if (isUsOtherDropdown(dropdown)) {
      content = <USTaxInfo usTaxInfo={dropdown} />;
    }

    if (isCaMpfDropdown(dropdown)) {
      const { remitProvinces } = dropdown;
      content = (
        <>
          <MPFDescription />
          <CaMarketplaceProvincesTable
            stateCodes={remitProvinces}
            taxConstants={taxConstants}
          />
        </>
      );
    }

    if (isCaDropdown(dropdown)) {
      content = <CATable info={dropdown} />;
    }

    if (isEuMpfDropdown(dropdown)) {
      const { countryCodes } = dropdown;
      content = (
        <>
          <MPFDescription />
          <EuCountriesTable countryCodes={countryCodes} />
        </>
      );
    }

    if (isEuDropdown(dropdown)) {
      content = <EUTable info={dropdown} />;
    }

    if (isMxDropdown(dropdown)) {
      content = <MXTaxInfo info={dropdown} />;
    }

    if (isGbDropdown(dropdown)) {
      content = <GBMpfTaxInfo info={dropdown} />;
    }

    if (isTaxDropdown(dropdown) && dropdown.taxNumberType !== "OSS") {
      content = <OtherTaxInfo info={dropdown} />;
    }

    return (
      <div className={css(styles.dropdownWrapper)}>
        <div className={css(styles.dropdownContentWrapper)}>{content}</div>
      </div>
    );
  };

  const hasActions = countryOfDomicileCode && hasConfiguredTaxesBefore;

  const handleEditTax = (countryCode: CountryCode | UnionCode) => {
    if (countryCode === "EU") {
      navigationStore.navigate(`/tax/v2-enroll`);
    } else {
      navigationStore.navigate(`/tax/v2-enroll/${countryCode.toUpperCase()}`);
    }
  };

  const handleDisableRow = async (
    countryCode: CountryCode | UnionCode,
    dropdown?: DropdownData,
  ) => {
    if (countryCode === "EU" && dropdown != null) {
      taxStore.deleteCountry(countryCode, dropdown);
    } else {
      await taxStore.deleteCountry(countryCode);
    }
  };

  return (
    <Card className={css(styles.root, className, style)}>
      {validateStoreBanner}
      <CountriesUpdatedBanner countries={countriesUpdated} />
      <div className={css(styles.editContainer)}>
        <div className={css(styles.editTitle)}>My tax settings</div>
        <Markdown
          className={css(styles.editDescription)}
          text={
            i`A list of countries supported for tax collection and reporting ` +
            i`of your Wish store. When you enroll in more countries to ` +
            i`collect taxes, you will see your enrolled countries here. ` +
            i`[Needing help setting up taxes?](${zendeskURL("360020542793")})`
          }
          openLinksInNewTab
        />
      </div>
      <Table
        style={{
          position: "static",
        }}
        hideBorder
        data={taxRows}
        rowExpands={(value, index) => taxRows[index].dropdown != null}
        expandedRows={expandedRows}
        renderExpanded={renderExpandedRow}
        onRowExpandToggled={onRowExpandToggled}
      >
        <Table.Column columnKey="countryCode" title={i`Country`} width={"30%"}>
          {({ row }: CellInfo<TaxRow, TaxRow>) => {
            const { countryCode, postfix, isMpf } = row;
            let info = null;

            if (countryCode == "NO") {
              info = (
                <div
                  className={css(styles.countryInfo)}
                  onClick={() => new NorwayVATDetailsModal().render()}
                >
                  <Info />
                </div>
              );
            }
            const isEuDomicileOrValidated =
              euVatSelfRemittanceEligible ||
              euVatEntityStatus === "VALIDATED" ||
              (countryOfDomicileCode != null &&
                euVatCountryCodes != null &&
                euVatCountryCodes.has(countryOfDomicileCode));
            if (countryCode == "EU" && isMpf) {
              info = (
                <div
                  className={css(styles.countryInfo)}
                  onClick={() =>
                    new EuVATDetailsModal({
                      isEuDomicileOrValidated,
                    }).render()
                  }
                >
                  <Info />
                </div>
              );
            }

            return (
              <div className={css(styles.countryName, styles.font)}>
                <Flag countryCode={countryCode} className={css(styles.flag)} />
                {`${getCountryName(countryCode)}${
                  postfix != null ? ` - ${postfix}` : ""
                }`}
                {info}
              </div>
            );
          }}
        </Table.Column>
        <Table.Column
          columnKey="standardTaxRate"
          title={i`Standard tax rate`}
          align="center"
          noDataMessage=""
          description={
            i`The standard tax rate is utilized to calculate, collect, and ` +
            i`remit relevant taxes on top of customer-paid product and ` +
            i`shipping prices.`
          }
          width={"18%"}
        >
          {({ row: { standardTaxRate } }: CellInfo<TaxRow, TaxRow>) => {
            if (standardTaxRate == null || standardTaxRate == false) {
              return;
            }
            return standardTaxRate == true ? (
              <Popover
                popoverContent={() => (
                  <div className={css(styles.mpfPopover)}>
                    Wish will collect and remit the associated tax on this order
                    as a registered Marketplace Facilitator.
                  </div>
                )}
                position="top center"
              >
                <Icon className={css(styles.check)} name="blueCheckmark" />
              </Popover>
            ) : (
              <div className={css(styles.font)}>{`${standardTaxRate}%`}</div>
            );
          }}
        </Table.Column>
        <Table.Column
          columnKey="taxLiability"
          title={i`Tax liability`}
          align="center"
          description={
            i`With "Merchant remits", you will receive the applicable tax ` +
            i`amount collected by Wish in your next payment disbursement, ` +
            i`excluding refunds or deductions.`
          }
        >
          {({
            row: { taxLiability, mpfLaunchDate, deprecationDate, isMpf },
          }: CellInfo<TaxRow, TaxRow>) => {
            if (mpfLaunchDate != null && isMpf) {
              const date = new Date(
                mpfLaunchDate.unix * 1000,
              ).toLocaleDateString(preferredProperLocale, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <div className={css(styles.stackedLiabilityContainer)}>
                  {typeof taxLiability == "string" && (
                    <div className={css(styles.font)}>{taxLiability}</div>
                  )}
                  <div className={css(styles.font)}>(From {date})</div>
                </div>
              );
            }

            if (deprecationDate != null) {
              const date = new Date(
                deprecationDate.unix * 1000,
              ).toLocaleDateString(preferredProperLocale, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <div className={css(styles.stackedLiabilityContainer)}>
                  {typeof taxLiability == "string" && (
                    <div className={css(styles.font)}>{taxLiability}</div>
                  )}
                  <div className={css(styles.font)}>
                    (Deprecating on {date})
                  </div>
                </div>
              );
            }

            if (typeof taxLiability != "string") {
              if (taxLiability.length === 1) {
                const [liability] = taxLiability;
                const remitString =
                  liability.remitType == "MERCHANT_REMIT"
                    ? i`Merchant remits`
                    : i`Wish remits`;
                return <div className={css(styles.font)}>{remitString}</div>;
              }
              return (
                <div className={css(styles.stackedLiabilityContainer)}>
                  {taxLiability
                    .filter(
                      ({ remitType, remitPercentage }) =>
                        remitPercentage != null &&
                        (remitType == "MERCHANT_REMIT" ||
                          remitType == "WISH_REMIT"),
                    )
                    .map(({ remitType, remitPercentage }) => {
                      const remitString =
                        remitType == "MERCHANT_REMIT"
                          ? i`Merchant remits`
                          : i`Wish remits`;
                      return (
                        <div className={css(styles.font)}>
                          {(remitPercentage || 0) * 100}% ({remitString})
                        </div>
                      );
                    })}
                </div>
              );
            }

            return <div className={css(styles.font)}>{taxLiability}</div>;
          }}
        </Table.Column>
        <Table.Column
          columnKey="status"
          title={i`Status`}
          align="center"
          noDataMessage=""
        >
          {({ row: { status } }: CellInfo<TaxRow, TaxRow>) =>
            status != null && <TaxStatusLabel status={status} />
          }
        </Table.Column>
        {hasActions && (
          <Table.Column
            columnKey="canUserEdit"
            noDataMessage=""
            title={i`Action`}
            align="center"
          >
            {({ row, index }: CellInfo<TaxRow, TaxRow>) => {
              const { canUserEdit, countryCode, isMpf, dropdown } = row;

              if (countryCode == "GB" && !isMpf) {
                return null;
              }

              return (
                canUserEdit != null &&
                canUserEdit && (
                  <div className={css(styles.actionsContainer)}>
                    <EditButton onClick={() => handleEditTax(countryCode)} />
                    <OptionsButton
                      className={css(styles.actionOptionsButton)}
                      options={[
                        {
                          title: i`Cancel tax setup`,
                          onClick: () =>
                            handleDisableRow(countryCode, dropdown),
                        },
                        {
                          title: i`View tax setup details`,
                          onClick: () => onRowExpandToggled(index),
                        },
                      ]}
                      popoverPosition="bottom center"
                    />
                  </div>
                )
              );
            }}
          </Table.Column>
        )}
      </Table>
    </Card>
  );
};

export default observer(SettingsCard);

const useStylesheet = () => {
  const { borderPrimary, textBlack, pageBackground } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        font: {
          fontSize: 14,
          lineHeight: "20px",
        },
        stackedLiabilityContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0px 12px 0px",
        },
        editContainer: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          padding: "25px 25px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        editTitle: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          color: textBlack,
          marginBottom: 15,
          cursor: "default",
        },
        editDescription: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: textBlack,
          cursor: "default",
        },
        editButton: {
          marginTop: 25,
        },
        reviewStatusLabel: {
          minWidth: 90,
        },
        dropdownWrapper: {
          padding: 24,
          backgroundColor: pageBackground,
        },
        dropdownContentWrapper: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          overflow: "hidden",
        },
        countryName: {
          display: "flex",
          alignItems: "center",
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        countryInfo: {
          marginLeft: 4,
          cursor: "pointer",
        },
        check: {
          height: 24,
          width: 24,
        },
        mpfPopover: {
          maxWidth: 236,
          padding: 8,
          fontSize: 12,
          lineHeight: "16px",
        },
        actionsContainer: {
          display: "flex",
          alignItems: "center",
        },
        actionOptionsButton: {
          marginLeft: 2,
        },
      }),
    [borderPrimary, textBlack, pageBackground],
  );
};
