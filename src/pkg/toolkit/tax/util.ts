import _ from "lodash";
import { useMemo } from "react";

/* Merchant Stores */
import { useRouteStore } from "@merchant/stores/RouteStore";

/* Schema */
import {
  Country,
  CountryCode,
  UserSchema,
  UsTaxMarketplaceMunicipalities,
  CommerceMerchantEuEntityStatus,
} from "@schema/types";
import {
  TaxRow,
  UsMpfDropdown,
  UsNonTaxDropdown,
  V2PickedTaxSetting,
  UsStateTaxInfo,
  TaxDropdown,
  ProvinceNumberMap,
  CaMpfDropdown,
  PickedShippingOriginSettings,
  PickedDatetime,
  GbDropdown,
  EuMpfDropdown,
  EuDropdown,
  PickedTaxMarketplaceUnion,
} from "./types-v2";

/* Toolkit */
import { CountryType } from "@merchant/component/core/CountrySelect";
import CountryNames, {
  CountryCode as LegoCountryCode,
  getCountryName,
} from "@toolkit/countries";
import { TaxEUCountries } from "./enrollment";

type GetTaxRowProps = {
  readonly usNomadStates: ReadonlyArray<string>;
  readonly usMarketplaceStates: ReadonlyArray<string>;
  readonly usMarketplaceMunicipalities: ReadonlyArray<
    Pick<
      UsTaxMarketplaceMunicipalities,
      "stateCode" | "cities" | "counties" | "districts"
    >
  >;
  readonly caPstQstProvinces: ReadonlyArray<string>;
  readonly caMarketplaceProvinces: ReadonlyArray<string>;
  readonly marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;
  readonly marketplaceCountries: ReadonlyArray<{
    readonly country: Pick<Country, "code">;
    readonly launchDate: PickedDatetime | null;
  }>;
  readonly settings: ReadonlyArray<V2PickedTaxSetting> | null;
  readonly accountType: Pick<UserSchema, "entityType">["entityType"];
  readonly hasCompletedSellerVerification: boolean;
  readonly euVatSelfRemittanceEligible: boolean | null | undefined;
  readonly euVatEntityStatus: CommerceMerchantEuEntityStatus | null | undefined;
  readonly shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
  readonly countryOfDomicileCode?: CountryCode | null | undefined;
  readonly euVatCountryCodes?: ReadonlySet<CountryCode> | null | undefined;
};

const getEuRows = ({
  settings,
  accountType,
  hasCompletedSellerVerification,
  marketplaceUnions,
  euVatSelfRemittanceEligible,
  euVatCountryCodes,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const euUnion = marketplaceUnions.filter(
    ({ union: { code } }) => code === "EU"
  )[0];

  const euMpfCountries = euUnion?.union?.countries;

  const euMpfCountryCodes = (euMpfCountries || []).map(({ code }) => code);

  const euMpfDropdown: EuMpfDropdown = {
    type: "EU_MPF",
    countryCodes: euMpfCountryCodes,
  };

  const euMpfTaxRow: TaxRow = {
    countryCode: "EU",
    standardTaxRate: true,
    taxLiability: i`Wish remits`,
    status: "ACTIVE",
    dropdown: euMpfCountryCodes.length ? euMpfDropdown : undefined,
    postfix: i`MPF`,
    isMpf: true,
  };

  if (!euVatSelfRemittanceEligible) return [euMpfTaxRow];

  const euCountriesSettings = (settings || []).filter(
    ({
      authority: {
        country: { code },
        level,
      },
    }) =>
      level == "COUNTRY" &&
      euVatCountryCodes != null &&
      euVatCountryCodes.has(code)
  );

  const searchedOssCountry: V2PickedTaxSetting | undefined = (
    settings || []
  ).find(({ taxNumberType }) => taxNumberType === "OSS");

  const isOss: boolean = searchedOssCountry != null;

  const countryCodeOssRegistration = isOss
    ? searchedOssCountry?.ossRegistrationCountry?.code
    : null;

  const nonOssStatus =
    euCountriesSettings.length &&
    euCountriesSettings.every((setting) => setting.status === "ACTIVE")
      ? "ACTIVE"
      : null;

  const euTaxStatus = isOss ? searchedOssCountry?.status || null : nonOssStatus;

  const euDropdown: EuDropdown = {
    type: "EU",
    accountType,
    accountValidation: hasCompletedSellerVerification
      ? "VALIDATED"
      : "NOT_VALIDATED",
    taxId: isOss ? searchedOssCountry?.taxNumber : null,
    taxNumberType: isOss ? "OSS" : null,
    countryOfOssRegistration: isOss ? countryCodeOssRegistration : null,
    euCountriesSettings,
  };

  const euTaxRows: TaxRow = {
    countryCode: "EU",
    taxLiability: i`Merchant remits`,
    status: euTaxStatus,
    canUserEdit: euVatSelfRemittanceEligible,
    dropdown: euDropdown,
  };
  return euCountriesSettings?.length ? [euTaxRows, euMpfTaxRow] : [euMpfTaxRow];
};

const getUsRows = ({
  usMarketplaceStates,
  usMarketplaceMunicipalities,
  usNomadStates,
  settings,
  accountType,
  hasCompletedSellerVerification,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const usMpfDropdown: UsMpfDropdown = {
    type: "US_MPF",
    remitStates: usMarketplaceStates,
    homeRuleStates: usMarketplaceMunicipalities,
  };

  const usMpfTaxRow: TaxRow = {
    countryCode: "US",
    standardTaxRate: true,
    taxLiability: i`Wish remits`,
    status: "ACTIVE",
    dropdown: usMpfDropdown,
    postfix: i`MPF`,
    isMpf: true,
  };

  const usNonTaxDropdown: UsNonTaxDropdown = {
    type: "US_NON_TAX",
    stateCodes: usNomadStates,
  };

  const usNonTaxRow: TaxRow = {
    countryCode: "US",
    taxLiability: i`None`,
    status: "ACTIVE",
    dropdown: usNonTaxDropdown,
    postfix: i`Non-taxable`,
  };

  const states: { [state: string]: true } = (settings || []).reduce(
    (
      acc,
      {
        authority: {
          stateCode,
          country: { code },
        },
      }
    ) => {
      if (stateCode == null || code != "US") {
        return acc;
      }
      acc[stateCode] = true;
      return acc;
    },
    {} as { [state: string]: true }
  );

  const usStateSettings = (settings || []).filter(
    ({
      authority: {
        country: { code },
        level,
      },
    }) => level == "STATE" && code == "US"
  );

  const usOtherStatesInfo: ReadonlyArray<UsStateTaxInfo> = Object.keys(
    states
  ).map((code) => {
    const stateSetting = (settings || []).find(
      ({
        authority: {
          country: { code: countryCode },
          level,
          stateCode,
        },
      }) => level == "STATE" && countryCode == "US" && stateCode == code
    );

    const subRegionSettings = (settings || []).filter(
      ({
        authority: {
          country: { code: countryCode },
          level,
          stateCode,
        },
      }) =>
        level != "COUNTRY" &&
        level != "STATE" &&
        countryCode == "US" &&
        stateCode == code
    );

    const subRegionLastUpdated = subRegionSettings.reduce((acc, taxInfo) => {
      return Math.max(acc, taxInfo.lastUpdated.unix);
    }, 0);

    const taxIdString =
      stateSetting != null
        ? stateSetting.taxNumber
        : subRegionSettings
            .map(({ taxNumber }) => taxNumber)
            .filter((taxNumber) => taxNumber != null)
            .join(", ");

    return {
      code,
      taxId: taxIdString,
      subRegions: subRegionSettings.map(
        ({ authority: { displayName } }) => displayName
      ) as ReadonlyArray<string>,
      lastUpdated:
        stateSetting?.lastUpdated ||
        (subRegionLastUpdated != 0
          ? {
              unix: subRegionLastUpdated,
            }
          : undefined),
    };
  });

  const usOtherRow: ReadonlyArray<TaxRow> =
    usStateSettings.length > 0
      ? [
          {
            countryCode: "US",
            taxLiability: i`Merchant remits`,
            status: "ACTIVE",
            canUserEdit: true,
            dropdown: {
              type: "US_OTHER",
              statesInfo: usOtherStatesInfo,
              accountType,
              accountValidation: hasCompletedSellerVerification
                ? "VALIDATED"
                : "NOT_VALIDATED",
            },
          },
        ]
      : [];

  return [...usOtherRow, usMpfTaxRow, usNonTaxRow];
};

const getMpfNonUsGbRows = ({
  marketplaceCountries,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  return marketplaceCountries
    .filter(
      ({ country: { code } }) =>
        code != "US" && code != "CA" && code != "GB" && code != "MX"
    )
    .map(({ country: { code }, launchDate }) => ({
      countryCode: code,
      taxLiability: i`Wish remits`,
      mpfLaunchDate: launchDate,
      status: "ACTIVE",
      postfix: i`MPF`,
      standardTaxRate: true,
      isMpf: true,
    }));
};

const getCaRows = ({
  caMarketplaceProvinces,
  settings,
  accountType,
  hasCompletedSellerVerification,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const caMpfDropdown: CaMpfDropdown = {
    type: "CA_MPF",
    remitProvinces: caMarketplaceProvinces,
  };

  const caMpfTaxRow: TaxRow = {
    countryCode: "CA",
    standardTaxRate: true,
    taxLiability: i`Wish remits`,
    status: "ACTIVE",
    dropdown: caMarketplaceProvinces.length ? caMpfDropdown : undefined,
    postfix: i`MPF`,
    isMpf: true,
  };

  const caCountrySetting = (settings || []).find(
    ({
      authority: {
        country: { code },
        level,
      },
    }) => level == "COUNTRY" && code == "CA"
  );

  const caProvinceSettings = (settings || []).filter(
    ({
      authority: {
        country: { code },
        level,
      },
    }) => level != "COUNTRY" && code == "CA"
  );

  const standardTaxRate =
    (caCountrySetting?.taxLiability || [])
      .filter(
        ({ userEntityTypeForRemit }) => userEntityTypeForRemit == accountType
      )
      .reduce((acc, { remitPercentage }) => acc + (remitPercentage || 0), 0) *
      100 || undefined;

  return caCountrySetting != null && caProvinceSettings != null
    ? [
        {
          countryCode: "CA",
          taxLiability: i`Merchant remits`,
          status: caCountrySetting.status,
          canUserEdit: true,
          standardTaxRate,
          dropdown: {
            type: "CA",
            accountType,
            accountValidation: hasCompletedSellerVerification
              ? "VALIDATED"
              : "NOT_VALIDATED",
            gstAccountNumber: caCountrySetting.taxNumber,
            lastUpdated: caCountrySetting.lastUpdated,
            provinceNumbers: caProvinceSettings.reduce(
              (acc, { authority: { stateCode }, taxNumber }) => {
                if (stateCode == null || taxNumber == null) {
                  return acc;
                }
                acc[stateCode] = taxNumber;
                return acc;
              },
              {} as { [key: string]: string }
            ) as ProvinceNumberMap,
          },
        },
        caMpfTaxRow,
      ]
    : [caMpfTaxRow];
};

const getGbMpfRows = ({
  marketplaceCountries,
  countryOfDomicileCode,
  accountType,
  hasCompletedSellerVerification,
  shippingOrigins,
  settings,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const gbMpf = marketplaceCountries.find(
    ({ country: { code } }) => code == "GB"
  );

  if (gbMpf == null) {
    return [];
  }

  const gbSetting = (settings || []).find(
    ({
      authority: {
        country: { code },
      },
      taxNumberType,
    }) => code === "GB" && taxNumberType != null && taxNumberType != "OTHER"
  );

  const shipping = (shippingOrigins || []).find(
    ({ destinationRegion }) => destinationRegion === "GB"
  );
  const defaultShipFromLocation:
    | CountryCode
    | undefined = shipping?.originCountryCode as CountryCode;

  const dropdown: GbDropdown | undefined =
    countryOfDomicileCode === "GB"
      ? {
          type: "GB_GB_MERCHANT",
          accountType,
          accountValidation: hasCompletedSellerVerification
            ? "VALIDATED"
            : "NOT_VALIDATED",
          defaultShipFromLocation,
          lastUpdated: gbSetting?.lastUpdated,
          taxId: gbSetting?.taxNumber,
          taxNumberType: gbSetting?.taxNumberType || null,
        }
      : undefined;

  return [
    {
      countryCode: "GB",
      standardTaxRate: 20,
      taxLiability: i`Determined at fulfillment`,
      isMpf: true,
      mpfLaunchDate: null,
      status: gbSetting?.status || "ACTIVE",
      postfix: i`MPF`,
      canUserEdit: countryOfDomicileCode == "GB",
      dropdown,
    },
  ];
};

const getMxRows = ({
  settings,
  accountType,
  hasCompletedSellerVerification,
}: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const mxCountrySetting = (settings || []).find(
    ({
      authority: {
        country: { code },
        level,
      },
    }) => level == "COUNTRY" && code == "MX"
  );

  if (mxCountrySetting == null) {
    return [];
  }

  const taxLiability = (mxCountrySetting.taxLiability || []).filter(
    ({ userEntityTypeForRemit }) => userEntityTypeForRemit == accountType
  );

  const standardTaxRate =
    taxLiability.reduce(
      (acc, { remitPercentage }) => acc + (remitPercentage || 0),
      0
    ) * 100 || false;

  const defaultShipFromIsMx =
    mxCountrySetting.mexicoDetails?.defaultShipFromIsMx;

  return [
    {
      countryCode: "MX",
      standardTaxRate: defaultShipFromIsMx ? standardTaxRate : undefined,
      taxLiability: (defaultShipFromIsMx && taxLiability) || i`Merchant remits`,
      status: mxCountrySetting.status,
      canUserEdit: true,
      dropdown: {
        type: "MX",
        accountType,
        accountValidation: hasCompletedSellerVerification
          ? "VALIDATED"
          : "NOT_VALIDATED",
        rfcId: mxCountrySetting.taxNumber,
        defaultShipFromIsMx,
        lastUpdated: mxCountrySetting.lastUpdated,
      },
    },
  ];
};

const getOtherRows = (props: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  const { settings, accountType } = props;

  return (settings || [])
    .filter(
      ({
        authority: {
          country: { code },
          level,
        },
      }) =>
        level == "COUNTRY" &&
        !["US", "CA", "MX", "DE", "GB", "MC"].includes(code) &&
        props.euVatCountryCodes != null &&
        !props.euVatCountryCodes.has(code)
    )
    .map((setting) => {
      const {
        authority: {
          country: { code },
        },
        status,
        taxLiability,
      } = setting;
      const dropdown: TaxDropdown = getDropdownForOtherSetting(setting, props);
      const standardTaxRate =
        (taxLiability || [])
          .filter(
            ({ userEntityTypeForRemit }) =>
              userEntityTypeForRemit == accountType
          )
          .reduce(
            (acc, { remitPercentage }) => acc + (remitPercentage || 0),
            0
          ) * 100 || undefined;

      return {
        countryCode: code,
        status,
        taxLiability: i`Merchant remits`,
        standardTaxRate,
        dropdown,
        canUserEdit: true,
      };
    });
};

export const getTaxRows = (props: GetTaxRowProps): ReadonlyArray<TaxRow> => {
  return _.sortBy(
    [
      ...getEuRows(props),
      ...getGbMpfRows(props),
      ...getMpfNonUsGbRows(props),
      ...getUsRows(props),
      ...getCaRows(props),
      ...getMxRows(props),
      ...getOtherRows(props),
    ],
    ({ countryCode }) => getCountryName(countryCode)
  );
};

const getDropdownForOtherSetting = (
  setting: V2PickedTaxSetting,
  {
    accountType,
    hasCompletedSellerVerification,
    shippingOrigins,
  }: GetTaxRowProps
): TaxDropdown => {
  const {
    authority: {
      country: { code },
    },
    taxNumber,
    lastUpdated,
  } = setting;
  const shipping = (shippingOrigins || []).find(
    ({ destinationRegion }) =>
      destinationRegion === code ||
      (destinationRegion === "EU" &&
        TaxEUCountries.includes(code) &&
        code !== "GB")
  );
  const defaultShipFromLocation:
    | CountryCode
    | undefined = shipping?.originCountryCode as CountryCode;
  if (code == "GB") {
    return {
      type: "OTHER",
      accountType,
      accountValidation: hasCompletedSellerVerification
        ? "VALIDATED"
        : "NOT_VALIDATED",
      taxId: taxNumber,
      lastUpdated,
    };
  }

  return {
    type: "OTHER",
    accountType,
    accountValidation: hasCompletedSellerVerification
      ? "VALIDATED"
      : "NOT_VALIDATED",
    taxId: taxNumber,
    lastUpdated,
    defaultShipFromLocation,
  };
};

export const useCurrentCountry = (): CountryCode | null => {
  const routeStore = useRouteStore();
  const { countryCode } = routeStore.pathParams("/tax/v2-enroll/:countryCode");

  if (countryCode == null) {
    return null;
  }

  if (countryCode.length == 2) {
    return (countryCode.toUpperCase() as any) as CountryCode;
  }

  return null;
};

export const useCountryOptions = () =>
  useMemo((): ReadonlyArray<CountryType> => {
    const topCountries: LegoCountryCode[] = [
      "CN",
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
    ];

    let remainingCountryCodes: LegoCountryCode[] = (Object.keys(
      CountryNames
    ) as ReadonlyArray<LegoCountryCode>).filter(
      (cc) => !topCountries.includes(cc)
    );

    remainingCountryCodes = _.sortBy(
      remainingCountryCodes,
      (cc) => CountryNames[cc]
    );

    const countryCodes: LegoCountryCode[] = [
      ...topCountries,
      ...remainingCountryCodes,
    ];
    return countryCodes.map((countryCode) => {
      const countryName = CountryNames[countryCode];
      return {
        name: countryName,
        cc: countryCode,
      };
    });
  }, []);
