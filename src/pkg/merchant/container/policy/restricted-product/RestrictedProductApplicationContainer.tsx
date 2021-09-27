import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Card,
  StepsIndicator,
  Button,
  PrimaryButton,
} from "@ContextLogic/lego";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Merchant Components */
import Header from "@merchant/component/policy/restricted-product/application/Header";
import SelectCategories from "@merchant/component/policy/restricted-product/application/SelectCategories";
import LegalInformation from "@merchant/component/policy/restricted-product/application/LegalInformation";
import TermsOfService from "@merchant/component/policy/restricted-product/application/TermsOfService";
import {
  RegionToCategoriesMap,
  RestrictedProductRequestType,
  CountryAndRegionType,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import {
  RestrictedProductCategory,
  RestrictedProductRegionCode,
  SellerVerificationSchema,
  RestrictedProductCountryCode,
  RestrictedProductMutationsUpsertRestrictedProductRequestArgs,
  UpsertRestrictedProductRequest,
} from "@schema/types";
import RPApplicationState, {
  INDICATOR_STEPS,
} from "@merchant/model/policy/restricted-product/RPApplicationState";

/* External Libraries */
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

type RegionCategoryType = {
  readonly regionCode: RestrictedProductRegionCode;
  readonly categories: ReadonlyArray<RestrictedProductCategory>;
};

type InitialData = {
  readonly currentMerchant: {
    readonly sellerVerification: Pick<
      SellerVerificationSchema,
      "hasCompleted" | "isKycVerification"
    >;
    readonly restrictedProductDefaultCountry: {
      readonly code: RestrictedProductCountryCode;
      readonly restrictedProductRegion: CountryAndRegionType;
    };
    readonly restrictedProductRegions: ReadonlyArray<CountryAndRegionType>;
  };
  readonly policy: {
    readonly restrictedProduct: {
      readonly restrictedProductRequests: ReadonlyArray<
        RestrictedProductRequestType
      >;
      readonly allRegionRestrictedProductCategories: ReadonlyArray<
        RegionCategoryType
      >;
    };
  };
};

type RestrictedProductApplicationContainerProps = {
  readonly initialData: InitialData;
};

const APPLY_RESTRICTED_PRODUCT = gql`
  mutation ApplyRestricted_Product_Mutation(
    $input: RestrictedProductRequestUpsertInput!
  ) {
    policy {
      restrictedProduct {
        upsertRestrictedProductRequest(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type CreateRestrictedProductType = Pick<
  UpsertRestrictedProductRequest,
  "ok" | "message"
>;

type CreateRestrictedProductResponseType = {
  readonly policy: {
    readonly restrictedProduct: {
      readonly upsertRestrictedProductRequest: CreateRestrictedProductType;
    };
  };
};

const RestrictedProductApplicationContainer = ({
  initialData,
}: RestrictedProductApplicationContainerProps) => {
  const {
    currentMerchant: {
      sellerVerification: {
        hasCompleted: hasCompletedSellerVerification,
        isKycVerification,
      },
      restrictedProductRegions,
      restrictedProductDefaultCountry: {
        code: suspectedCountry,
        restrictedProductRegion,
      },
    },
    policy: {
      restrictedProduct: {
        restrictedProductRequests,
        allRegionRestrictedProductCategories,
      },
    },
  } = initialData;

  const merchantVerified = hasCompletedSellerVerification || isKycVerification;

  const regionToCategoryMap: RegionToCategoriesMap = useMemo(() => {
    return new Map(
      allRegionRestrictedProductCategories.map(
        (regionToCategories: RegionCategoryType) => [
          regionToCategories.regionCode,
          regionToCategories.categories,
        ]
      )
    );
  }, [allRegionRestrictedProductCategories]);

  const navigationStore = useNavigationStore();
  useEffect(() => {
    if (!merchantVerified) {
      navigationStore.navigate("/product-authorization");
    }
  }, [navigationStore, merchantVerified]);

  const [currentApplication] = useState<RPApplicationState>(
    new RPApplicationState()
  );

  useEffect(() => {
    if (
      restrictedProductRequests == null ||
      restrictedProductRequests.length == 0
    ) {
      currentApplication.setRegionCode(restrictedProductRegion.regionCode);
    } else {
      currentApplication.setRegionCode(
        restrictedProductRequests[0].region.regionCode
      );
    }
  }, [restrictedProductRegion, restrictedProductRequests, currentApplication]);

  const toastStore = useToastStore();
  const [createRestrictProduct] = useMutation<
    CreateRestrictedProductResponseType,
    RestrictedProductMutationsUpsertRestrictedProductRequestArgs
  >(APPLY_RESTRICTED_PRODUCT);

  const warrantyFileUrl: string | null | undefined = useMemo(() => {
    if (currentApplication.document.length > 0) {
      return currentApplication.document[0].serverParams?.url;
    }
    return null;
  }, [currentApplication.document]);

  const warrantyFilename: string | null | undefined = useMemo(() => {
    if (currentApplication.document.length > 0) {
      return currentApplication.document[0].serverParams?.original_filename;
    }
    return null;
  }, [currentApplication.document]);

  const onSubmit = async () => {
    const { data } = await createRestrictProduct({
      variables: {
        input: {
          action: "CREATE",
          region: currentApplication.regionCode,
          categories: currentApplication.categories,
          legalRepName: currentApplication.legalRepName,
          legalRepTitle: currentApplication.legalRepTitle,
          businessEntityName: currentApplication.businessEntityName,
          warrantyFileUrl,
          warrantyFilename,
        },
      },
    });
    const ok = data?.policy.restrictedProduct.upsertRestrictedProductRequest.ok;
    const message =
      data?.policy.restrictedProduct.upsertRestrictedProductRequest.message;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }
    await currentApplication.exitApplication();
  };

  const styles = useStylesheet();
  const { primary } = useTheme();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.container)}>
        <Header style={css(styles.header)} />
        <StepsIndicator
          className={css(styles.steps)}
          steps={INDICATOR_STEPS}
          completedIndex={currentApplication.currentStepIndicator}
        />
        <Card className={css(styles.formContent)}>
          {currentApplication.currentStep === "SELECT_CATEGORIES_STEP" && (
            <SelectCategories
              currentApplication={currentApplication}
              restrictedProductRegions={restrictedProductRegions}
              restrictedProductRequests={restrictedProductRequests}
              regionToCategoryMap={regionToCategoryMap}
            />
          )}
          {currentApplication.currentStep === "LEGAL_INFORMATION_STEP" && (
            <LegalInformation
              currentApplication={currentApplication}
              suspectedCountry={suspectedCountry}
            />
          )}
          {currentApplication.currentStep === "TERMS_OF_SERVICE_STEP" && (
            <TermsOfService
              currentApplication={currentApplication}
              suspectedCountry={suspectedCountry}
            />
          )}
          <div className={css(styles.footer)}>
            <Button
              style={[styles.button, { color: primary }]}
              onClick={() => currentApplication.goPreviousStep()}
              borderColor={primary}
            >
              {currentApplication.prevStepText}
            </Button>

            <PrimaryButton
              popoverStyle={css(styles.button)}
              onClick={() => {
                if (
                  currentApplication.currentStep !== "TERMS_OF_SERVICE_STEP"
                ) {
                  currentApplication.goNextStep();
                } else if (currentApplication.isValid) {
                  onSubmit();
                }
              }}
              isDisabled={!currentApplication.isValid}
            >
              {currentApplication.nextStepText}
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default observer(RestrictedProductApplicationContainer);

const useStylesheet = () => {
  const { pageBackground, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
          paddingBottom: 45,
        },
        container: {
          marginTop: 24,
          alignSelf: "center",
          width: "70%",
        },
        header: {
          marginBottom: 12,
        },
        steps: {
          width: "100%",
          marginTop: 24,
        },
        formContent: {
          marginTop: 24,
        },
        footer: {
          borderTop: `solid 1px ${borderPrimary}`,
          display: "flex",
          justifyContent: "space-between",
          alignContent: "stretch",
          alignSelf: "stretch",
        },
        button: {
          maxWidth: 200,
          margin: "20px 24px",
          flex: 1,
        },
      }),
    [pageBackground, borderPrimary]
  );
};
