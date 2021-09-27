/* eslint-disable filenames/match-regex */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useStringQueryParam } from "@toolkit/url";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Merchant Imports */
import StepsSideMenu from "@merchant/component/brand/branded-products/abs/absb-application/StepsSideMenu";
import Header from "@merchant/component/brand/branded-products/abs/absb-application/Header";
import BrandNameScreen from "@merchant/component/brand/branded-products/abs/absb-application/BrandNameScreen";
import AuthorizationTypeScreen from "@merchant/component/brand/branded-products/abs/absb-application/AuthorizationTypeScreen";
import TrademarkRegistrationsScreen from "@merchant/component/brand/branded-products/abs/absb-application/TrademarkRegistrationsScreen";
import BrandedProductDeclarationScreen from "@merchant/component/brand/branded-products/abs/absb-application/BrandedProductDeclarationScreen";

/* Type Imports */
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";
import {
  BrandServiceSchema,
  BrandServiceSchemaTrueBrandsArgs,
  SellerVerificationSchema,
} from "@schema/types";
import { TrueBrandObject } from "@merchant/component/brand/branded-products/BrandSearch";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

type InitialData = {
  readonly currentMerchant: {
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
  };
  readonly brand: Pick<BrandServiceSchema, "acceptedTrademarkCountries">;
};

type AuthenticBrandSellerProps = {
  readonly initialData: InitialData;
};

const GET_TRUE_BRANDS_QUERY = gql`
  query ABSBApplicationContainer_GetTrueBrands(
    $count: Int!
    $offset: Int!
    $queryString: String!
    $sort: BrandSort!
  ) {
    brand {
      trueBrands(
        count: $count
        offset: $offset
        queryString: $queryString
        sort: $sort
      ) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

type GetTrueBrandsRequestType = Pick<
  BrandServiceSchemaTrueBrandsArgs,
  "count" | "offset" | "queryString" | "sort"
>;

type GetTrueBrandsResponseType = {
  readonly brand: {
    readonly trueBrands: ReadonlyArray<TrueBrandObject>;
  };
};

const ABSBApplicationContainer = ({
  initialData,
}: AuthenticBrandSellerProps) => {
  const styles = useStylesheet();
  const {
    currentMerchant: {
      sellerVerification: { hasCompleted: merchantVerified },
    },
  } = initialData;
  const navigationStore = useNavigationStore();

  if (!merchantVerified) {
    navigationStore.navigate("/branded-products/authentic-brand-seller");
  }

  const [currentApplication] = useState<ABSBApplicationState>(
    new ABSBApplicationState(),
  );
  const [brandIdQuery] = useStringQueryParam("brand_id");

  const { data, loading } = useQuery<
    GetTrueBrandsResponseType,
    GetTrueBrandsRequestType
  >(GET_TRUE_BRANDS_QUERY, {
    variables: {
      count: 1,
      offset: 0,
      queryString: brandIdQuery,
      sort: {
        field: "NAME",
        order: "ASC",
      },
    },
  });

  const brand = data?.brand.trueBrands[0] || null;
  const isLoading = !merchantVerified || (brandIdQuery && loading);

  if (
    brandIdQuery &&
    currentApplication.currentStep === "BRAND_NAME" &&
    brand
  ) {
    currentApplication.setBrand(brand);
    currentApplication.setCurrentStep("AUTHORIZATION_TYPE");
  }

  useEffect(() => {
    if (currentApplication.isEditing) {
      navigationStore.placeNavigationLock(
        i`You have unsaved changes. Are you sure want to leave?`,
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [navigationStore, currentApplication.isEditing]);

  return (
    <div className={css(styles.root)}>
      <LoadingIndicator
        loadingComplete={!isLoading}
        className={css(styles.loadingIndicator)}
      >
        <div className={css(styles.sideColumn)}>
          <StepsSideMenu
            style={css(styles.sideMenu)}
            items={[
              {
                title: i`Brand Name`,
                selected: currentApplication.currentStep === "BRAND_NAME",
                complete: currentApplication.brandNameStepComplete,
                show: currentApplication.brandNameStepVisible,
              },
              {
                title: i`Authorization Type`,
                selected:
                  currentApplication.currentStep === "AUTHORIZATION_TYPE",
                complete: currentApplication.authorizationTypeStepComplete,
                show: currentApplication.authorizationTypeStepVisible,
              },
              {
                title:
                  currentApplication.authorizationType === "BRAND_OWNER"
                    ? i`Trademark Registration(s)`
                    : i`Brand’s Trademark Registration(s) & Reseller Authentication`,
                selected:
                  currentApplication.currentStep === "TRADEMARK_REGISTRATIONS",
                complete: currentApplication.trademarkRegistrationsStepComplete,
                show: currentApplication.trademarkRegistrationsStepVisible,
              },
              {
                title: i`Branded Product Declaration`,
                selected:
                  currentApplication.currentStep ===
                  "BRANDED_PRODUCT_DECLARATION",
                complete:
                  currentApplication.brandedProductDeclarationStepComplete,
                show: currentApplication.brandedProductDeclarationStepVisible,
              },
            ]}
          />
        </div>
        <div className={css(styles.centerColumn)}>
          <Header
            style={css(styles.header)}
            currentApplication={currentApplication}
          />
          <Card className={css(styles.appContainer)}>
            {currentApplication.currentStep === "BRAND_NAME" && (
              <BrandNameScreen currentApplication={currentApplication} />
            )}
            {currentApplication.currentStep === "AUTHORIZATION_TYPE" && (
              <AuthorizationTypeScreen
                currentApplication={currentApplication}
              />
            )}
            {currentApplication.currentStep === "TRADEMARK_REGISTRATIONS" && (
              <TrademarkRegistrationsScreen
                currentApplication={currentApplication}
                acceptedTrademarkCountries={
                  initialData.brand.acceptedTrademarkCountries
                }
              />
            )}
            {currentApplication.currentStep ===
              "BRANDED_PRODUCT_DECLARATION" && (
              <BrandedProductDeclarationScreen
                currentApplication={currentApplication}
              />
            )}
          </Card>
        </div>
        <div className={css(styles.sideColumn)} />
      </LoadingIndicator>
    </div>
  );
};
export default observer(ABSBApplicationContainer);

const useStylesheet = () =>
  // TODO: use queries for smaller screens
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          paddingTop: 36,
          paddingBottom: 45, // accounts for footer
        },
        sideColumn: {
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
        },
        sideMenu: {
          flex: 1,
          margin: "41px 24px 0px 0px",
          alignSelf: "flex-start",
        },
        header: {
          marginBottom: 16,
        },
        centerColumn: {},
        appContainer: {
          maxWidth: 996,
        },
        badge: {
          height: 80,
          width: 80,
        },
        verifiedText: {
          margin: "24px 0px",
          maxWidth: 700,
        },
        unVerifiedText: {
          margin: "24px 0px",
          maxWidth: 530,
        },
        text: {
          fontWeight: fonts.weightMedium,
          lineHeight: 1.5,
          textAlign: "center",
        },
        button: {
          minWidth: 200,
        },
        downloadLink: {
          display: "flex",
          alignItems: "center",
          marginTop: 24,
        },
        downloadIcon: {
          height: 14,
          width: 14,
          marginRight: 9,
        },
        loadingIndicator: {
          alignSelf: "center",
          marginTop: "10%",
        },
      }),
    [],
  );
