/*
 * SelectDestinationsStep.tsx
 *
 * Created by Jonah Dlin on Wed Nov 25 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import {
  BackButton,
  CheckboxGrid,
  OptionType,
  Text,
  CheckboxField,
  RadioGroup,
  Info,
  Layout,
  Field,
  FormSelect,
  TextInput,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";
import { Flags4x3 } from "@toolkit/countries";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { TaxNumberValidator } from "@toolkit/validators";

/* Merchant Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { ExtraTaxInfo } from "@merchant/component/tax/enrollment-v2/extra/ExtraInfoRenderer";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useRouteStore } from "@merchant/stores/RouteStore";
import { usePersistenceStore } from "@merchant/stores/PersistenceStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Toolkit */
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

export type SelectDestinationsStepProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

type OssSelection = "YES" | "NO" | "UNSELECTED";

const TAX_EXTRA_INFO_KEY = `TaxExtraInfo`;

const SelectDestinationsStep: React.FC<SelectDestinationsStepProps> = ({
  className,
  style,
  editState,
}: SelectDestinationsStepProps) => {
  const [initialSelected, setInitialSelected] = useState(true);

  const styles = useStylesheet();
  const routeStore = useRouteStore();
  const persistenceStore = usePersistenceStore();
  const navigationStore = useNavigationStore();

  const {
    hasTaxSettings,
    readyToSave,
    nextStepPath,
    setCountrySelected,
    enrollableCountries,
  } = editState;
  const toastStore = useToastStore();

  const [euChecked, setEuChecked] = useState<boolean>(true);
  const [nonEuChecked, setNonEuChecked] = useState<boolean>(true);
  const [ossSelection, setOssSelection] = useState<OssSelection>("UNSELECTED");
  const [ossCountryCode, setOssCountryCode] = useState<CountryCode | undefined>(
    undefined
  );
  const [ossNumber, setOssNumber] = useState<string | undefined>(undefined);
  const [ossNumberIsInvalid, setOssNumberIsInvalid] = useState<boolean>(true);

  const [validator] = useState(new TaxNumberValidator({ countryCode: "OSS" }));

  useMountEffect(() => {
    window.scrollTo(0, 0);
    // Look for countries that should be preselected in persistenceStore
    // This means the user comes from a place that attempts to do things that require tax setting for those countries
    const taxExtraInfoDataKey = persistenceStore.get<string>(
      TAX_EXTRA_INFO_KEY
    );
    const taxExtraInfoData = taxExtraInfoDataKey
      ? persistenceStore.get<{ [countryCode in CountryCode]: any }>(
          taxExtraInfoDataKey
        )
      : null;

    const enrollableCountriesSet = new Set(
      enrollableCountries.map(({ code }) => code)
    );

    if (initialSelected && taxExtraInfoData) {
      Object.keys(taxExtraInfoData).forEach((key) => {
        const country =
          taxExtraInfoData[key as keyof typeof taxExtraInfoData]?.country;
        if (enrollableCountriesSet.has(country)) {
          setCountrySelected(country, true);
        }
      });
    }
  });

  useEffect(() => {
    if (euChecked === false) setOssSelection("UNSELECTED");
  }, [euChecked]);

  const enrollableCountriesList = useMemo(
    () => (enrollableCountries || []).map(({ code }) => code),
    [enrollableCountries]
  );

  const euCountries = useMemo(
    () =>
      (enrollableCountries || []).filter(
        ({ code }) =>
          editState.euVatCountryCodes != null &&
          editState.euVatCountryCodes.has(code)
      ),
    [enrollableCountries, editState.euVatCountryCodes]
  );

  const availableNonEuCountries = useMemo(
    () =>
      (enrollableCountriesList || []).filter(
        (code) =>
          editState.euVatCountryCodes != null &&
          !editState.euVatCountryCodes.has(code)
      ),

    [enrollableCountriesList, editState.euVatCountryCodes]
  );

  const availableEuCountries = useMemo(
    () =>
      enrollableCountriesList.filter(
        (code) =>
          editState.euVatCountryCodes != null &&
          editState.euVatCountryCodes.has(code)
      ),

    [enrollableCountriesList, editState.euVatCountryCodes]
  );

  const nonEUOptions = useMemo(
    (): ReadonlyArray<OptionType> =>
      (availableNonEuCountries || []).map((code) => ({
        title: getCountryName(code),
        value: code as CountryCode,
        icon: Flags4x3[code.toLowerCase()],
      })),
    [availableNonEuCountries]
  );

  const euOptions = useMemo((): ReadonlyArray<OptionType> => {
    const countriesData = (availableEuCountries || []).map((code) => ({
      title: getCountryName(code),
      value: code as CountryCode,
      icon: Flags4x3[code.toLowerCase()],
    }));
    return _.sortBy(countriesData, (country) => country.title);
  }, [availableEuCountries]);

  const options = useMemo((): ReadonlyArray<OptionType> => {
    return [...nonEUOptions, ...euOptions];
  }, [nonEUOptions, euOptions]);

  const nextButtonActive =
    (hasTaxSettings && readyToSave) || nextStepPath != null;

  const renderNonEuModal = (isFromCheck = false) => {
    const alreadySetupCountries = (
      editState.currentNonEuCountries || []
    ).filter((countryCode) =>
      editState.hasStartedSettingsForCountry(countryCode)
    );
    if (alreadySetupCountries.length > 0) {
      new ConfirmationModal(
        i`Looks like you've configured some countries. ` +
          i`Doing this would remove the settings you've made.`
      )
        .setHeader({
          title: i`Remove all countries?`,
        })
        .setCancel(i`Cancel`)
        .setAction(i`Yes, remove all countries`, () => {
          editState.currentNonEuCountries.forEach((countryCode) =>
            editState.setCountrySelected(countryCode, false)
          );
          if (isFromCheck && nonEuChecked) setNonEuChecked(!nonEuChecked);
        })
        .render();
    } else {
      editState.currentNonEuCountries.forEach((countryCode) =>
        editState.setCountrySelected(countryCode, false)
      );
      if (isFromCheck && nonEuChecked) setNonEuChecked(!nonEuChecked);
    }
  };

  const onAllCountriesToggled = () => {
    const numNonEuCountriesSelected = editState.currentNonEuCountries.length;
    if (numNonEuCountriesSelected < availableNonEuCountries.length) {
      availableNonEuCountries.forEach((countryCode) => {
        return editState.setCountrySelected(countryCode, true);
      });
    } else {
      renderNonEuModal();
    }
  };

  const renderEuModal = (isFromCheck = false) => {
    const alreadySetupEUCountries = (
      editState.currentEUCountries || []
    ).filter((countryCode) =>
      editState.hasStartedSettingsForCountry(countryCode)
    );
    if (alreadySetupEUCountries.length > 0) {
      new ConfirmationModal(
        i`Looks like you've configured some European Union countries. ` +
          i`Doing this would remove the settings you've made.`
      )
        .setHeader({
          title: i`Remove European Union countries?`,
        })
        .setCancel(i`Cancel`)
        .setAction(i`Yes, remove all European Union countries`, () => {
          editState.currentEUCountries.forEach((countryCode) =>
            editState.setCountrySelected(countryCode, false)
          );
          if (isFromCheck && euChecked) setEuChecked(!euChecked);
        })
        .render();
    } else {
      editState.currentEUCountries.forEach((countryCode) =>
        editState.setCountrySelected(countryCode, false)
      );
      if (isFromCheck && euChecked) setEuChecked(!euChecked);
    }
  };

  const onAllEUCountriesToggled = () => {
    const numEUCountriesSelected = editState.currentEUCountries.length;
    if (numEUCountriesSelected < availableEuCountries.length) {
      availableEuCountries.forEach((countryCode) => {
        editState.setCountrySelected(countryCode, true);
      });
    } else {
      renderEuModal();
    }
  };

  const onCheckedChanged = (countryCode: CountryCode, checked: boolean) => {
    if (checked) {
      editState.setCountrySelected(countryCode, true);
    } else {
      if (editState.hasStartedSettingsForCountry(countryCode)) {
        const countryName = getCountryName(countryCode);
        new ConfirmationModal(
          i`Looks like you've configured settings for ${countryName}.` +
            i` Doing this would remove the settings you've made`
        )
          .setHeader({
            title: i`Remove ${countryName}?`,
          })
          .setCancel(i`Cancel`)
          .setAction(i`Yes, remove ${countryName}`, () => {
            editState.setCountrySelected(countryCode, false);
          })
          .render();
      } else {
        editState.setCountrySelected(countryCode, false);
      }
    }
  };

  const onContinueClicked = () => {
    if (editState.euVatSelfRemittanceEligible === false) {
      Array.from(editState.euVatCountryCodes).forEach((countryCode) =>
        editState.setCountrySelected(countryCode, false)
      );
    }
    if (
      editState.euVatSelfRemittanceEligible &&
      ossSelection === "YES" &&
      ossNumber != null &&
      ossCountryCode != null
    ) {
      editState.isOss = true;
      editState.ossCountryCode = ossCountryCode;
      editState.ossNumber = ossNumber;
      if (ossNumberIsInvalid) {
        toastStore.error(i`Please provide a valid OSS number.`, {
          timeoutMs: 5000,
        });
        return;
      }
      availableEuCountries.forEach((countryCode) => {
        onCheckedChanged(countryCode, true);
        editState.setOssSelected(countryCode, true);
      });
    } else {
      editState.isOss = false;
      editState.ossCountryCode = undefined;
      editState.ossNumber = undefined;
    }
    editState.pushNext();
  };

  const renderCountries = () => {
    const taxExtraInfoDataKey = persistenceStore.get<string>(
      TAX_EXTRA_INFO_KEY
    );

    const learnMoreLink = `https://ec.europa.eu/taxation_customs/business/vat/oss_en`;
    return editState.euVatSelfRemittanceEligible ? (
      <Layout.FlexColumn>
        <div className={css(styles.taxSectionContainer)}>
          <CheckboxField
            className={css(styles.taxSectionCheckbox)}
            title={i`I want Wish to collect taxes from European Union (EU) customers.`}
            onChange={() => {
              euChecked ? renderEuModal(true) : setEuChecked(!euChecked);
            }}
            checked={euChecked}
          />

          {euChecked && (
            <Layout.FlexColumn>
              <div className={css(styles.taxSectionContent)}>
                <Layout.FlexRow className={css(styles.ossDescription)}>
                  <Text>
                    Do you have a One-Stop Shop (OSS) number for EU VAT
                    purposes?*
                  </Text>
                  <Info
                    className={css(styles.info)}
                    text={
                      i`The One-Stop Shop (OSS) registration enables VAT collection from all EU ` +
                      i`countries at once. ` +
                      i`[Learn more](${learnMoreLink})`
                    }
                  />
                </Layout.FlexRow>
                <RadioGroup
                  className={css(styles.ossRadioGroup)}
                  onSelected={(selection) => setOssSelection(selection)}
                  selectedValue={ossSelection}
                  layout={"horizontal"}
                >
                  <RadioGroup.Item value={"YES"} text={i`Yes`} />
                  <RadioGroup.Item value={"NO"} text={i`No`} />
                </RadioGroup>
                {ossSelection === "YES" && (
                  <div className={css(styles.ossFields)}>
                    <Layout.GridRow templateColumns="1fr 1fr" gap={40}>
                      <Field
                        title={() => (
                          <Layout.FlexRow>
                            <Text className={css(styles.ossFieldLabel)}>
                              Country of OSS registration*
                            </Text>
                            {ossCountryCode != null &&
                              infoCountries.has(ossCountryCode) && (
                                <Info
                                  className={css(styles.info)}
                                  text={getCountryTooltipText(ossCountryCode)}
                                  size={16}
                                  sentiment="info"
                                  position="right"
                                />
                              )}
                          </Layout.FlexRow>
                        )}
                      >
                        <FormSelect
                          options={_.sortBy(
                            (euCountries || []).map((country) => ({
                              value: country.code,
                              text: country.name,
                            })),
                            (country) => country.text
                          )}
                          placeholder={i`Select country`}
                          selectedValue={ossCountryCode}
                          onSelected={(value: string) => {
                            setOssCountryCode(value as CountryCode);
                          }}
                        />
                      </Field>
                      <Field
                        title={() => (
                          <Text className={css(styles.ossFieldLabel)}>
                            OSS number*
                          </Text>
                        )}
                      >
                        <TextInput
                          value={ossNumber}
                          placeholder={i`Enter OSS number`}
                          onChange={({ text }) => {
                            setOssNumber(text);
                          }}
                          required
                          validators={[validator]}
                          onValidityChanged={(isValid) =>
                            setOssNumberIsInvalid(!isValid)
                          }
                          debugValue={TaxEnrollmentV2State.debugValue("OSS")}
                        />
                      </Field>
                    </Layout.GridRow>
                  </div>
                )}
                {ossSelection === "NO" && (
                  <Layout.FlexColumn>
                    <Layout.FlexRow className={css(styles.quickSelect)}>
                      <section className={css(styles.quickSelectTitle)}>
                        Quick select
                      </section>
                      {availableEuCountries.length > 0 && (
                        <SecondaryButton
                          className={css(styles.euCountriesButton)}
                          onClick={onAllEUCountriesToggled}
                        >
                          All countries
                        </SecondaryButton>
                      )}
                    </Layout.FlexRow>
                    <CheckboxGrid
                      className={css(styles.optionsGrid)}
                      options={euOptions}
                      onCheckedChanged={(value: any, checked: boolean) => {
                        setInitialSelected(false);
                        onCheckedChanged(value, checked);
                      }}
                      selected={editState.currentEUCountries}
                      extraContent={(value: string) =>
                        ((taxExtraInfoDataKey && routeStore.currentPath) ||
                          infoCountries.has(value as CountryCode)) && (
                          <ExtraTaxInfo
                            origin={taxExtraInfoDataKey}
                            path={routeStore.currentPath}
                            value={value}
                          />
                        )
                      }
                    />
                  </Layout.FlexColumn>
                )}
              </div>
            </Layout.FlexColumn>
          )}
        </div>
        <div className={css(styles.taxSectionContainer)}>
          <CheckboxField
            className={css(styles.taxSectionCheckbox)}
            title={i`I want Wish to collect taxes from non-EU customers`}
            onChange={() => {
              nonEuChecked
                ? renderNonEuModal(true)
                : setNonEuChecked(!nonEuChecked);
            }}
            checked={nonEuChecked}
          />
          {nonEuChecked && (
            <div className={css(styles.taxSectionContent)}>
              <Layout.FlexRow className={css(styles.quickSelect)}>
                <section className={css(styles.quickSelectTitle)}>
                  Quick select
                </section>
                <SecondaryButton
                  className={css(styles.allCountriesButton)}
                  onClick={onAllCountriesToggled}
                >
                  All countries
                </SecondaryButton>
              </Layout.FlexRow>
              <CheckboxGrid
                className={css(styles.optionsGrid)}
                options={nonEUOptions}
                onCheckedChanged={(value: any, checked: boolean) => {
                  setInitialSelected(false);
                  onCheckedChanged(value, checked);
                }}
                selected={editState.currentNonEuCountries}
                extraContent={(value: string) =>
                  ((taxExtraInfoDataKey && routeStore.currentPath) ||
                    infoCountries.has(value as CountryCode)) && (
                    <ExtraTaxInfo
                      origin={taxExtraInfoDataKey}
                      path={routeStore.currentPath}
                      value={value}
                    />
                  )
                }
              />
            </div>
          )}
        </div>
      </Layout.FlexColumn>
    ) : (
      <Layout.FlexColumn>
        <Layout.FlexRow className={css(styles.quickSelect)}>
          <section className={css(styles.quickSelectTitle)}>
            Quick select
          </section>
          <SecondaryButton
            className={css(styles.allCountriesButton)}
            onClick={onAllCountriesToggled}
          >
            {editState.isEuVatLaunched || availableEuCountries.length === 0
              ? `All countries`
              : `Non-EU countries`}
          </SecondaryButton>
          {availableEuCountries.length > 0 && (
            <SecondaryButton
              className={css(styles.euCountriesButton)}
              onClick={onAllEUCountriesToggled}
            >
              EU countries
            </SecondaryButton>
          )}
        </Layout.FlexRow>
        <CheckboxGrid
          className={css(styles.optionsGrid)}
          options={editState.isEuVatLaunched ? nonEUOptions : options}
          onCheckedChanged={(value: any, checked: boolean) => {
            setInitialSelected(false);
            onCheckedChanged(value, checked);
          }}
          selected={editState.currentCountries}
          extraContent={(value: string) =>
            ((taxExtraInfoDataKey && routeStore.currentPath) ||
              infoCountries.has(value as CountryCode)) && (
              <ExtraTaxInfo
                origin={taxExtraInfoDataKey}
                path={routeStore.currentPath}
                value={value}
              />
            )
          }
        />
      </Layout.FlexColumn>
    );
  };

  const isDisabled = !(
    nextButtonActive ||
    (editState.euVatSelfRemittanceEligible === true &&
      ossSelection === "YES" &&
      ossCountryCode != null &&
      ossNumber != null)
  );

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Layout.FlexColumn className={css(styles.topContent)}>
        <Text weight="bold" className={css(styles.title)}>
          Select countries for tax collection
        </Text>
        <div className={css(styles.description)}>
          {editState.euVatSelfRemittanceEligible
            ? i`Set up tax settings now, separating out between EU & non-EU; OSS ` +
              i`number is universal for all EU countries, so we need to know if ` +
              i`merchants have this number first.`
            : i`Select the jurisdictions where you have indirect tax (e.g. sales tax, ` +
              i`GST and VAT obligations)`}
        </div>
        {renderCountries()}
      </Layout.FlexColumn>
      <Layout.FlexRow
        className={css(styles.footer)}
        justifyContent="space-between"
      >
        <BackButton
          className={css(styles.bottomButton)}
          onClick={() => navigationStore.navigate("/tax/settings")}
        />
        <PrimaryButton
          className={css(styles.bottomButton)}
          onClick={onContinueClicked}
          isDisabled={isDisabled}
          minWidth
        >
          {hasTaxSettings && editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(SelectDestinationsStep);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        topContent: {
          padding: 24,
        },
        title: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          marginBottom: 12,
          cursor: "default",
        },
        description: {
          marginBottom: 24,
          cursor: "default",
          color: textBlack,
          fontSize: 16,
          lineHeight: "24px",
        },
        ossDescription: {
          margin: "0px 10px",
        },
        info: {
          margin: 10,
        },
        ossRadioGroup: {
          margin: 10,
          paddingBottom: 16,
        },
        ossFields: {
          margin: 10,
        },
        taxSectionContainer: {
          marginBottom: 24,
        },
        taxSectionCheckbox: {
          marginBottom: 24,
          width: "fit-content",
        },
        taxSectionContent: {
          margin: "0px 16px",
        },
        quickSelect: {
          margin: 10,
          marginBottom: 24,
        },
        quickSelectTitle: {
          marginRight: 20,
          cursor: "default",
          userSelect: "none",
          color: textBlack,
          fontSize: 16,
          lineHeight: "24px",
        },
        allCountriesButton: {
          marginRight: 16,
        },
        euCountriesButton: {
          marginRight: 16,
        },
        optionsGrid: {
          width: "100%",
        },
        footer: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: 24,
        },
        bottomButton: {
          height: 36,
          boxSizing: "border-box",
          "@media (min-width: 900px)": {
            width: 180,
          },
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        note: {
          fontSize: 12,
          marginTop: 10,
        },
        ossFieldLabel: {
          margin: "8px 0px",
        },
      }),
    [textBlack, borderPrimary]
  );
};
