import React, { useEffect, useMemo, useState, useCallback } from "react";
import gql from "graphql-tag";
import { StyleSheet } from "aphrodite";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import { WelcomeHeader } from "@merchant/component/core";
import FBWCreateShippingPlanForm from "@merchant/component/logistics/shipping-plan/FBWCreateShippingPlanForm";
import FBSCreateShippingPlanForm from "@merchant/component/logistics/shipping-plan/FBSCreateShippingPlanForm";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

/* Merchant Store */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import ToastStore from "@merchant/stores/ToastStore";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { zendeskURL } from "@toolkit/url";
import { WarehouseType } from "@toolkit/fbw";
import {
  Product,
  Region,
  ShippingPlanCreationResponse,
} from "@merchant/api/fbw";

/* Type imports */
import {
  PickedEnrollableCountry,
  V2PickedTaxSetting,
  PickedUSMarketplaceMunicipalities,
  PickedDatetime,
  PickedTaxMarketplaceUnion,
  PickedEuVatCountry,
} from "@toolkit/tax/types-v2";
import {
  UserSchema,
  MerchantSchema,
  UsTaxConstants,
  Country,
  CaTaxConstants,
  EuvatTaxSchema,
  CountryCode,
} from "@schema/types";

const GET_TAX_DATA = gql`
  query FBWShippingCreationContainer_GetTaxInfos {
    currentUser {
      id
      entityType
    }
    currentMerchant {
      id
      euVatTax {
        euVatSelfRemittanceEligible
        euVatEntityStatus
      }
      countryOfDomicile {
        code
      }
      shippingOrigins {
        destinationRegion
        shippingType
        originCountryCode
        originCountryName
      }
      sellerVerification {
        hasCompleted
      }
      tax {
        settings {
          id
          authority {
            stateCode
            displayName
            country {
              name
              code
            }
            level
          }
          status
          reviewStatus
          taxNumber
          taxNumberType
          lastUpdated {
            unix
          }
          certificateFileUrl
          euDetails {
            ustSt1T1Number
          }
          germanyDetails {
            noNumberReason
          }
          mexicoDetails {
            defaultShipFromIsMx
          }
        }
        enrollableCountries {
          code
          name
          isInEurope
        }
      }
    }
    platformConstants {
      euVatCountries {
        code
        name
      }
      tax {
        marketplaceUnions {
          union {
            code
            name
            countries {
              code
            }
          }
          launchDate {
            unix
            hasPassed
            formatted(fmt: "MMMM d, yyyy")
          }
        }
        us {
          nomadStates
          marketplaceMunicipalities {
            stateCode
            cities
            counties
            districts
          }
          marketplaceStates
        }
        ca {
          pstQstProvinces
          marketplaceProvinces
        }
        marketplaceCountries {
          country {
            code
          }
          launchDate {
            unix
          }
        }
      }
    }
  }
`;

type GetTaxInfosResponse = {
  readonly currentUser: Pick<UserSchema, "id" | "entityType">;
  readonly currentMerchant: Pick<
    MerchantSchema,
    "id" | "countryOfDomicile" | "shippingOrigins" | "sellerVerification"
  > & {
    readonly tax: {
      readonly settings: ReadonlyArray<V2PickedTaxSetting> | null;
      readonly enrollableCountries: ReadonlyArray<PickedEnrollableCountry>;
    };
  };
  readonly platformConstants: {
    readonly euVatCountries: ReadonlyArray<PickedEuVatCountry>;
    readonly euVatTax: Pick<
      EuvatTaxSchema,
      "euVatSelfRemittanceEligible" | "euVatEntityStatus"
    >;
    readonly tax: {
      readonly us: Pick<
        UsTaxConstants,
        "marketplaceStates" | "nomadStates" | "homeRuleStates"
      > & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
      readonly ca: Pick<
        CaTaxConstants,
        "pstQstProvinces" | "marketplaceProvinces"
      > & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
      readonly marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;
      readonly marketplaceCountries: ReadonlyArray<{
        readonly country: Pick<Country, "code">;
        readonly launchDate: PickedDatetime | null;
      }>;
    };
  };
};

const FBWShippingCreationContainer: React.FC = () => {
  const { nonBatchingClient } = useApolloStore();
  const toastStore = ToastStore.instance();

  const styles = useStylesheet();

  const { loading, error, data: taxData, refetch: refetchTaxData } = useQuery<
    GetTaxInfosResponse,
    void
  >(GET_TAX_DATA, {
    client: nonBatchingClient,
  });

  if (error) toastStore.negative(i`Something went wrong`);

  const settings = taxData?.currentMerchant?.tax?.settings;

  const gbShipping = (taxData?.currentMerchant?.shippingOrigins || []).find(
    ({ destinationRegion }) => destinationRegion === "GB"
  );
  const gbShipFromLocation = gbShipping
    ? (gbShipping.originCountryCode as CountryCode)
    : undefined;

  const euVatCountries = taxData?.platformConstants?.euVatCountries;
  const euVatCountryCodes = new Set(
    (euVatCountries || []).map(({ code }) => code)
  );

  const taxInfos: ReadonlyArray<CommerceMerchantTaxInfo> = (settings || []).map(
    (setting) => {
      return new CommerceMerchantTaxInfo({
        id: setting.id,
        state_code: setting.authority.stateCode || undefined,
        tax_number: setting.taxNumber,
        country_code: setting.authority.country.code,
        review_status: setting.reviewStatus || undefined,
        authority_level: setting.authority.level,
        last_updated: setting.lastUpdated.unix,
        status: setting.status,
        display_name: setting.authority.displayName,
        certificate_file_url: setting.certificateFileUrl,
        de_no_number_reason: setting.germanyDetails?.noNumberReason,
        mx_default_ship_from_is_mx: setting.mexicoDetails?.defaultShipFromIsMx,
        taxNumberType: setting.taxNumberType,
        gbShipFromLocation,
        euDetails: setting.euDetails,
        oss_registration_country_code: null,
        eu_vat_country_codes: euVatCountryCodes,
      });
    }
  );

  const pageX: () => string | number = () => {
    const { dimenStore } = AppStore.instance();
    FBSCreateShippingPlanForm;
    return dimenStore.pageGuideXForPageWithTable;
  };

  const queryParams = useCallback(() => {
    const { routeStore } = AppStore.instance();
    return routeStore.queryParams;
  }, []);

  const variationIds: () => ReadonlyArray<string> = useCallback(() => {
    const variationIdsStr = queryParams().variationIds;
    if (!variationIdsStr) {
      return [];
    }
    const variationIds = variationIdsStr.split(",");
    return variationIds || [];
  }, [queryParams]);

  const [
    shippingPlanCreationResponse,
    setShippingPlanCreationResponse,
  ] = useState<ShippingPlanCreationResponse>();

  const warehouses: () => ReadonlyArray<WarehouseType> = () => {
    return shippingPlanCreationResponse?.warehouses || [];
  };

  const regions: () => ReadonlyArray<Region> = () => {
    return shippingPlanCreationResponse?.regions || [];
  };

  const countryMapping: () => {
    [key: string]: CountryCode;
  } = () => {
    return shippingPlanCreationResponse?.country_mapping || {};
  };

  const warehouseClassification: () => {
    [key: string]: ReadonlyArray<string>;
  } = () => {
    return shippingPlanCreationResponse?.warehouse_classification || {};
  };

  const whitelistedWarehouses: () => ReadonlyArray<string> = () => {
    return shippingPlanCreationResponse?.whitelisted_warehouses || [];
  };

  const urlParamVariations: () => ReadonlyArray<Product> = () => {
    return shippingPlanCreationResponse?.url_param_variations || [];
  };

  const fbwRecommendedVariations: () => ReadonlyArray<Product> = () => {
    return shippingPlanCreationResponse?.fbw_recommended_variations || [];
  };

  const fbsRecommendedVariations: () => ReadonlyArray<Product> = () => {
    return shippingPlanCreationResponse?.fbs_recommended_variations || [];
  };

  const recommendedVariations: () => ReadonlyArray<Product> = () => {
    switch (shipmentType()) {
      case "FBS":
        return urlParamVariations().length !== 0
          ? urlParamVariations().map((item) => ({
              ...item,
              is_recommended: true,
            }))
          : fbsRecommendedVariations();
      case "FBW":
        // this.urlParamVariations comes from Recommendations page for FBW or FBS
        // this.fbwRecommendedVariations comes from clicking FBW & FBS -> Create Shipping Plan in the top nav menu
        return urlParamVariations().length !== 0
          ? urlParamVariations().map((item) => ({
              ...item,
              is_recommended: true,
            }))
          : fbwRecommendedVariations();
      default:
        return fbwRecommendedVariations();
    }
  };

  const showTermsOfService: () => boolean = () => {
    return shippingPlanCreationResponse?.show_fbw_tos || false;
  };

  const manualVariations: () => ReadonlyArray<Product> = () => {
    const recommendedVariationIds = recommendedVariations().map((variation) => {
      return variation.variation_id || "";
    });
    return urlParamVariations().filter((variation) => {
      return !recommendedVariationIds.includes(variation.variation_id);
    });
  };

  const recommendedSelectedVariations: () => ReadonlyArray<Product> = () => {
    const recommendedVariationIds = recommendedVariations().map((variation) => {
      return variation.variation_id || "";
    });
    const recommendedSelectedVariations = urlParamVariations().filter(
      (variation) => {
        return recommendedVariationIds.includes(variation.variation_id);
      }
    );
    if (recommendedSelectedVariations.length > 0) {
      return recommendedSelectedVariations.map((item) => ({
        ...item,
        is_recommended: true,
      }));
    }
    return recommendedVariations();
  };

  const shipmentType: () => string = useCallback(() => {
    return queryParams().shipmentType;
  }, [queryParams]);

  const pbIncentive: () => boolean = () => {
    return shippingPlanCreationResponse?.fbw_pb_incentive || false;
  };

  const isFbw: () => boolean = () => {
    const shipmentTypeString = shipmentType();
    return shipmentTypeString
      ? shipmentTypeString.toLocaleUpperCase() === "FBW"
      : false;
  };

  const logView = useCallback(() => {
    logger.log("FBW_SHIPPING_PLAN_CREATION", {
      action: "shipping_plan_creation_view",
      shipmentType: shipmentType(),
    });
  }, [shipmentType]);

  useEffect(() => {
    logView();
    const fetchData = async () => {
      const resp = await fbwApi
        .shippingPlanCreation({
          variation_ids: JSON.stringify(variationIds()),
          shipment_type: shipmentType(),
        })
        .call();
      const { data } = resp;
      if (!data) {
        return;
      }

      setShippingPlanCreationResponse(data);
    };
    fetchData();
  }, [variationIds, logView, shipmentType]);

  if (!warehouses() || warehouses().length === 0) {
    return null;
  }

  const title = isFbw()
    ? i`Create an FBW Shipping Plan`
    : i`Create an FBS Shipping Plan`;

  const bodyContent = isFbw()
    ? i`Create a shipping plan to stock your product inventory at FBW ` +
      i`warehouses. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`[Learn more](${zendeskURL(
        "360008008674-How-do-I-create-a-FBW-Shipping-Plan-"
      )})`
    : i`Create an FBS shipping plan to stock your product inventory in intake ` +
      i`warehouses before Wish ships your products to pickup stores ` +
      i`in close proximity to customers. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`[Learn more](${zendeskURL("360050836613")})`;

  if (loading || taxData == null) return <LoadingIndicator />;

  const {
    currentUser: { entityType },
    currentMerchant: {
      countryOfDomicile,
      shippingOrigins,
      tax: { enrollableCountries },
      sellerVerification: { hasCompleted },
    },
    platformConstants: {
      euVatTax,
      tax: {
        marketplaceUnions,
        us: {
          marketplaceStates: usMarketplaceStates,
          marketplaceMunicipalities: usMarketplaceMunicipalities,
          nomadStates: usNomadStates,
          homeRuleStates: usHomeRuleStates,
        },
        ca: {
          pstQstProvinces: caPstQstProvinces,
          marketplaceProvinces: caMarketplaceProvinces,
        },
      },
    },
  } = taxData;

  const euLaunchDateInfo = (marketplaceUnions || []).filter(
    ({ union: { code } }) => code === "EU"
  )[0]?.launchDate;
  const isEuVatLaunched = euLaunchDateInfo?.hasPassed === true;

  const searchedOssCountry = (settings || []).find(
    ({ taxNumberType }) => taxNumberType === "OSS"
  );
  const isOss = searchedOssCountry != null;

  const editState = new TaxEnrollmentV2State({
    entityType,
    savedTaxInfos: taxInfos,
    savedCountryOfDomicile: countryOfDomicile?.code,
    shippingOrigins,
    usMarketplaceStates,
    usMarketplaceMunicipalities,
    usNomadStates,
    usHomeRuleStates,
    usNoStateLevelTaxIDRequiredStates: [
      ...usNomadStates,
      ...usMarketplaceStates,
    ],
    caPstQstProvinces,
    caMarketplaceProvinces,
    hasCompletedSellerVerification: hasCompleted,
    enrollableCountries,
    marketplaceUnions,
    euVatSelfRemittanceEligible: euVatTax?.euVatSelfRemittanceEligible,
    euVatEntityStatus: euVatTax?.euVatEntityStatus,
    isEuVatLaunched,
    isOss,
    euVatCountryCodes,
  });

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={title}
        body={bodyContent}
        openLinksInNewTabForMarkdown
        illustration="createHeader"
        paddingX={pageX()}
      />
      {isFbw() ? (
        <FBWCreateShippingPlanForm
          regions={regions()}
          countryMapping={countryMapping()}
          warehouseClassification={warehouseClassification()}
          whitelistedWarehouses={whitelistedWarehouses()}
          warehouses={warehouses()}
          manualVariations={manualVariations()}
          recommendedVariations={recommendedVariations()}
          recommendedSelectedVariations={recommendedSelectedVariations()}
          showTermsOfService={showTermsOfService()}
          shipmentType={shipmentType()}
          pbIncentive={pbIncentive() && isFbw()}
          editState={editState}
          refetchTaxData={refetchTaxData}
        />
      ) : (
        <FBSCreateShippingPlanForm
          regions={regions()}
          countryMapping={countryMapping()}
          warehouseClassification={warehouseClassification()}
          whitelistedWarehouses={whitelistedWarehouses()}
          recommendedVariations={recommendedVariations()}
          warehouses={warehouses().filter(
            (item) =>
              item.warehouse_code === "LAX" || item.warehouse_code === "AMS"
          )}
          showTermsOfService={showTermsOfService()}
          shipmentType={shipmentType()}
          pbIncentive={pbIncentive() && isFbw()}
          editState={editState}
          refetchTaxData={refetchTaxData}
        />
      )}
    </div>
  );
};
export default FBWShippingCreationContainer;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
      }),
    []
  );
};
