/* eslint-disable filenames/match-regex */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Flag } from "@merchant/component/core";
import {
  HorizontalField,
  Layout,
  Markdown,
  PrimaryButton,
  TextInput,
  FormSelect,
  RadioGroup,
  AttachmentInfo,
} from "@ContextLogic/lego";
import { SecureFileInput } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { TaxNumberValidator } from "@toolkit/validators";
import * as icons from "@assets/icons";
import { OnTextChangeEvent } from "@ContextLogic/lego";

/* Merchant Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";

/* Merchant Stores */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTaxStore } from "@merchant/stores/TaxStore";
import { usePersistenceStore } from "@merchant/stores/PersistenceStore";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { CountryCode, getCountryName } from "@toolkit/countries";
import { UstSt1T1Validator } from "@merchant/component/tax/enrollment-v2/de/DEEnrollment";

type FBWWarehouseTaxFormProps = {
  readonly warehouseType: string;
  readonly warehouseName: string;
  readonly warehouseCountry: CountryCode;
  readonly onSaveTaxID?: (arg0: boolean) => void;
  readonly editState: TaxEnrollmentV2State;
  readonly refetchTaxData: () => void;
};

const validator = (countryCode: string) => {
  return new TaxNumberValidator({ countryCode });
};

const FBWWarehouseTaxForm: React.FC<FBWWarehouseTaxFormProps> = (
  props: FBWWarehouseTaxFormProps
) => {
  const {
    onSaveTaxID,
    warehouseType,
    warehouseName,
    warehouseCountry,
    editState,
    refetchTaxData,
  } = props;
  const toastStore = useToastStore();
  const taxStore = useTaxStore();
  const persistenceStore = usePersistenceStore();

  const [isValid, setIsValid] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isCancelDisabled, setCancelDisabled] = useState(true);

  const [taxNumber, setTaxNumber] = useState<string | undefined>(undefined);
  const [userInput, setUserInput] = useState<string | undefined>(undefined);

  const [ossSelection, setOssSelection] = useState<"YES" | "NO" | "UNSELECTED">(
    "UNSELECTED"
  );
  const [ossCountryCode, setOssCountryCode] = useState<CountryCode | undefined>(
    undefined
  );

  const [ustNumber, setUstNumber] = useState<string | undefined>(undefined);
  const [ustIsValid, setUstIsValid] = useState<boolean>(false);
  const [taxCertificateUrl, setTaxCertificateUrl] = useState<
    string | undefined
  >(undefined);

  const styles = useStylesheet(isEditing, isCancelDisabled);
  // Check whether user has already set tax number before
  useEffect(() => {
    const taxExtraInfoKey = `TaxExtraInfo`;
    const fbwTaxStoreKey = `FBWWarehouseTaxForm`;

    if (warehouseType === "unbonded" && editState.savedTaxInfos.length === 0) {
      // Push warehouse name and country into persistence so that the user can see it during separate tax setup process
      persistenceStore.set(taxExtraInfoKey, fbwTaxStoreKey);
      persistenceStore.set(fbwTaxStoreKey, {
        warehouse: {
          name: warehouseName,
          country: warehouseCountry,
        },
      });
    } else {
      const taxInfo = editState.savedTaxInfos.find(
        (ti) => ti.countryCode === warehouseCountry
      );
      if (taxInfo) {
        setTaxNumber(taxInfo.taxNumber || "");
        setIsEditing(false);
        setCancelDisabled(true);
      }
    }
  }, [
    editState.savedTaxInfos,
    warehouseName,
    warehouseCountry,
    warehouseType,
    persistenceStore,
  ]);

  const isEuVatCountry = editState.euVatCountryCodes.has(warehouseCountry);

  const ossLearnMoreLink = `https://ec.europa.eu/taxation_customs/business/vat/oss_en`;

  const certificateFileAttachments: ReadonlyArray<Partial<
    AttachmentInfo
  >> = taxCertificateUrl
    ? [
        {
          url: taxCertificateUrl,
          fileName: i`German tax certificate`,
        },
      ]
    : [];

  const isDisabled: boolean = useMemo(() => {
    let result = false;
    if (ossSelection === "YES") {
      if (
        (warehouseCountry === "DE" || ossCountryCode == "DE") &&
        editState.entityType === "COMPANY"
      ) {
        result =
          !isValid ||
          ossCountryCode == null ||
          !ustIsValid ||
          taxCertificateUrl == null;
      } else {
        result = !isValid || ossCountryCode == null;
      }
    } else {
      if (warehouseCountry === "DE" && editState.entityType === "COMPANY") {
        result = !ustIsValid || taxCertificateUrl == null || !isValid;
      } else {
        result = !isValid;
      }
    }
    return result;
  }, [
    isValid,
    ustIsValid,
    taxCertificateUrl,
    editState.entityType,
    ossCountryCode,
    ossSelection,
    warehouseCountry,
  ]);

  const setTaxID = async () => {
    setCancelDisabled(true);

    if (ossSelection === "YES") {
      editState.isOss = true;
      editState.ossCountryCode = ossCountryCode;
      editState.ossNumber = userInput;
      if (!editState.validateOssNumber) {
        toastStore.error(i`Please provide a valid OSS number.`, {
          timeoutMs: 5000,
        });
        return;
      }
      editState.enrollableCountries
        .filter(({ code }) => editState.euVatCountryCodes.has(code))
        .forEach(({ code }) => {
          editState.setCountrySelected(code, false);
          const euCountrySetting = new CommerceMerchantTaxInfo({
            tax_number: userInput,
            country_code: code,
            display_name: code,
            authority_level: "COUNTRY",
            oss_registration_country_code: ossCountryCode,
            certificate_file_url: taxCertificateUrl,
            numberIsInvalid: !isValid,
            euDetails: { ustSt1T1Number: ustNumber },
            eu_vat_country_codes: editState.euVatCountryCodes,
          });
          editState.addCountry(euCountrySetting);
        });
    } else {
      editState.setCountrySelected(warehouseCountry, false);
      const newSetting = new CommerceMerchantTaxInfo({
        tax_number: userInput,
        country_code: warehouseCountry,
        display_name: warehouseCountry,
        authority_level: "COUNTRY",
        oss_registration_country_code: ossCountryCode,
        certificate_file_url: taxCertificateUrl,
        numberIsInvalid: !isValid,
        euDetails: { ustSt1T1Number: ustNumber },
        eu_vat_country_codes: editState.euVatCountryCodes,
      });
      editState.addCountry(newSetting);
    }

    await editState.submit(true);

    setTaxNumber(userInput);
    setIsEditing(false);
    refetchTaxData();

    const countryName = getCountryName(warehouseCountry);
    const displayName =
      warehouseCountry === "NL" ? `the ${countryName}` : countryName;
    toastStore.positive(
      i`Your tax ID for ${displayName} is saved. To make edits, please visit`,
      {
        timeoutMs: 5000,
        link: {
          title: i`Tax Settings.`,
          url: `/tax/settings`,
        },
      }
    );

    if (onSaveTaxID) {
      onSaveTaxID(true);
    }
  };

  // Currently only unbonded warehouses require tax setup
  if (warehouseType !== "unbonded") {
    return null;
  }

  if (
    editState.currentCountries.filter((country) =>
      taxStore.availableEUCountries.includes(country)
    ).length === 0
  ) {
    const learnMoreLink = `[${i`Learn more`}](${zendeskURL(
      "360020542793-How-to-Activate-and-Edit-Tax-Settings-in-Merchant-Dashboard-"
    )})`;
    return (
      <div className={css(styles.root)}>
        <div className={css(styles.taxFormLine)}>
          <div className={css(styles.taxForm)}>
            <Markdown
              className={css(styles.text)}
              text={
                i`**${warehouseName}** is a non-bonded warehouse, which means custom duty needs ` +
                i`to be paid upon dutiable product inventory's arrival at the ${warehouseName} ` +
                i`warehouse.`
              }
            />
            <Markdown
              className={css(styles.text)}
              text={
                i`As such, before selecting ${warehouseName} as an intake warehouse for your ` +
                i`inventory, please set up your Tax Settings first and provide necessary ` +
                i`tax-related information. ${learnMoreLink}`
              }
            />
            <PrimaryButton
              className={css(styles.setupButton)}
              href={"/tax/v2-enroll"}
              openInNewTab
            >
              Set up now
            </PrimaryButton>
          </div>
          <img
            src={icons.taxSetupIllustration}
            className={css(styles.taxSetupIllustration)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={css(styles.root)} key={warehouseName}>
      <Markdown
        className={css(styles.text)}
        text={
          i`As **${warehouseName}** is a non-bonded warehouse, to use it, ` +
          i`we need your help providing a few more details to update your Tax Settings.`
        }
      />
      <div className={css(styles.form)}>
        <HorizontalField
          className={css(styles.horizontalField)}
          centerContentVertically
          titleWidth={400}
          title={i`Country for tax collection`}
          popoverContent={
            i`The jurisdiction that you have indirect tax liabilities (sales ` +
            i`tax and VAT obligations).`
          }
        >
          <div className={css(styles.country)}>
            <Flag className={css(styles.flag)} countryCode={warehouseCountry} />
            {getCountryName(warehouseCountry)}
          </div>
        </HorizontalField>

        <HorizontalField
          className={css(styles.horizontalField)}
          centerContentVertically
          titleWidth={400}
          title={i`Non-bonded FBW orders will be shipped from`}
          popoverContent={
            i`When you use a non-bonded FBW warehouse to fulfill FBW orders, ` +
            i`your order originating country will be the one where the non-bonded ` +
            i`FBW warehouse is located.`
          }
          popoverPosition={"right"}
        >
          {getCountryName(warehouseCountry)}
        </HorizontalField>

        <HorizontalField
          centerContentVertically
          className={css(styles.horizontalField)}
          titleWidth={400}
          title={i`Your tax ID (VAT/GST/OSS)`}
          popoverContent={
            i`Provide a valid tax ID in your registered tax jurisdiction - for ` +
            i`example, Value Added Tax (VAT), Goods and Services Tax (GST), ` +
            i`or One-Stop Shop (OSS).`
          }
          popoverPosition={"right"}
        >
          <Layout.FlexRow>
            {isEditing && (
              <TextInput
                className={css(styles.input)}
                debugValue={TaxEnrollmentV2State.debugValue(warehouseCountry)}
                value={userInput}
                onValidityChanged={(isValid) => setIsValid(isValid)}
                onChange={({ text }: OnTextChangeEvent) => {
                  setUserInput(text);
                }}
                placeholder={taxNumber || i`Enter tax ID`}
                validators={[
                  ossSelection !== "YES"
                    ? validator(warehouseCountry)
                    : validator("OSS"),
                ]}
                focusOnMount
              />
            )}
            {!isEditing && taxNumber}
            {!isEditing && (
              <img
                className={css(styles.editIcon)}
                src={icons.blueEdit}
                alt="edit"
                draggable="false"
                onClick={() => {
                  setUserInput(taxNumber);
                  setIsEditing(true);
                  setCancelDisabled(false);
                }}
              />
            )}
          </Layout.FlexRow>
        </HorizontalField>

        {isEuVatCountry && (
          <HorizontalField
            centerContentVertically
            className={css(styles.horizontalField)}
            titleWidth={400}
            title={i`Is your tax ID a One-Stop Shop (OSS) number?*`}
            popoverContent={
              i`The One-Stop Shop (OSS) registration enables VAT collection from all EU ` +
              i`countries at once. ` +
              i`[Learn more](${ossLearnMoreLink})`
            }
            popoverPosition={"right"}
          >
            <Layout.FlexRow>
              <RadioGroup
                onSelected={(selection) => setOssSelection(selection)}
                selectedValue={ossSelection}
                layout={"horizontal"}
              >
                <RadioGroup.Item value={"YES"} text={i`Yes`} />
                <RadioGroup.Item value={"NO"} text={i`No`} />
              </RadioGroup>
            </Layout.FlexRow>
          </HorizontalField>
        )}

        {ossSelection === "YES" && (
          <HorizontalField
            centerContentVertically
            className={css(styles.horizontalField)}
            titleWidth={400}
            title={i`Country of OSS registration*`}
            popoverContent={i`Country where OSS was registered.`}
            popoverPosition={"right"}
          >
            <Layout.FlexRow>
              <FormSelect
                options={_.sortBy(
                  (
                    editState.enrollableCountries.filter(({ code }) =>
                      editState.euVatCountryCodes.has(code)
                    ) || []
                  ).map((country) => ({
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
            </Layout.FlexRow>
          </HorizontalField>
        )}

        {(warehouseCountry === "DE" || ossCountryCode === "DE") &&
          editState.entityType === "COMPANY" && (
            <>
              <HorizontalField
                centerContentVertically
                className={css(styles.horizontalField)}
                titleWidth={400}
                title={i`USt 1 TI Number`}
                popoverContent={
                  i`This number appears on the tax certificate issued by German ` +
                  i`Tax Authorities (Bundeszentralamt für Steuern) to merchants ` +
                  i`with tax obligations and registration in Germany.`
                }
                popoverPosition={"right"}
              >
                <Layout.FlexRow>
                  <TextInput
                    className={css(styles.input)}
                    value={ustNumber}
                    onChange={({ text }: OnTextChangeEvent) => {
                      setUstNumber(text);
                    }}
                    onValidityChanged={(isValid) => setUstIsValid(isValid)}
                    placeholder={i`Enter ${`USt 1 TI Number`}`}
                    validators={[new UstSt1T1Validator({})]}
                    debugValue="123"
                  />
                </Layout.FlexRow>
              </HorizontalField>

              <HorizontalField
                centerContentVertically
                className={css(styles.horizontalField)}
                titleWidth={400}
                title={i`Upload your tax certificate`}
                popoverContent={
                  i`Please upload the tax certificate that ` +
                  i`has been issued to you by the German tax authorities.`
                }
                popoverPosition={"bottom"}
              >
                <SecureFileInput
                  className={css(styles.input)}
                  bucket="TAX_SETTING_FILE_UPLOADS"
                  accepts=".jpeg,.jpg,.png,.pdf"
                  attachments={certificateFileAttachments}
                  onAttachmentsChanged={(
                    attachments: ReadonlyArray<AttachmentInfo>
                  ) => {
                    if (attachments.length > 0) {
                      setTaxCertificateUrl(attachments[0].url);
                    } else {
                      setTaxCertificateUrl(undefined);
                    }
                  }}
                  maxSizeMB={5}
                />
              </HorizontalField>
            </>
          )}

        <Layout.FlexRow justifyContent="flex-end">
          <PrimaryButton
            isDisabled={isDisabled}
            onClick={setTaxID}
            className={css(styles.saveButton)}
          >
            Save
          </PrimaryButton>
          <div
            className={css(styles.cancelButton)}
            onClick={() => {
              setIsEditing(false);
              setCancelDisabled(true);
            }}
          >
            Cancel
          </div>
        </Layout.FlexRow>
      </div>
    </div>
  );
};

export default observer(FBWWarehouseTaxForm);

const useStylesheet = (isEditing: boolean, isCancelDisabled: boolean) => {
  const { primary, textBlack, pageBackground } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          background: pageBackground,
          padding: "24px",
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          paddingBottom: "16px",
        },
        country: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        flag: {
          borderRadius: 2,
          height: 16,
          paddingRight: "8px",
        },
        input: {
          "@media (min-width: 900px)": {
            maxWidth: 310,
          },
        },
        saveButton: {
          display: isEditing ? "flex" : "none",
          maxWidth: "80px",
          minHeight: "30px",
        },
        setupButton: {
          maxWidth: "240px",
          minHeight: "30px",
        },
        taxFormLine: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        taxForm: {
          display: "flex",
          flexDirection: "column",
        },
        row: {
          display: "flex",
          flexDirection: "row",
        },
        cancelButton: {
          display: isCancelDisabled ? "none" : "flex",
          padding: "8px 24px",
          color: primary,
          fontSize: 16,
        },
        taxSetupIllustration: {
          paddingTop: "40px",
          maxWidth: "202px",
        },
        form: {
          paddingTop: "24px",
        },
        horizontalField: {
          margin: "24px 0px",
        },
        editIcon: {
          paddingLeft: "9px",
        },
      }),
    [isEditing, isCancelDisabled, primary, pageBackground, textBlack]
  );
};
