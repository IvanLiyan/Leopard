import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import RestrictedProductVerifiedContent from "@merchant/component/policy/restricted-product/RestrictedProductVerifiedContent";
import RestrictedProductUnverifiedContent from "@merchant/component/policy/restricted-product/RestrictedProductUnverifiedContent";
import RestrictedProductTable from "@merchant/component/policy/restricted-product/RestrictedProductTable";
import {
  getCategoryDetails,
  GET_RESTRICTED_PRODUCT_CATEGORIES_QUERY,
  GetRestrictedProductCategoriesRequestType,
  GetRestrictedProductCategoriesResponseType,
  RestrictedProductRequestType,
  RestrictedProductCategoryProps,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import {
  RestrictedProductRegionCode,
  RestrictedProductCountryCode,
} from "@schema/types";

/* External Libraries */
import { useQuery } from "@apollo/react-hooks";

type RestrictedProductTabProps = {
  readonly suspectedCountry: RestrictedProductCountryCode;
  readonly merchantVerified: Boolean;
  readonly hasExistingRequests: Boolean;
  readonly regionCode: RestrictedProductRegionCode;
  readonly restrictedProductRequests: ReadonlyArray<RestrictedProductRequestType>;
};

const RestrictedProductTab = ({
  suspectedCountry,
  merchantVerified,
  hasExistingRequests,
  restrictedProductRequests,
  regionCode,
}: RestrictedProductTabProps) => {
  const styles = useStylesheet();

  const { data: categories, loading: isLoading } = useQuery<
    GetRestrictedProductCategoriesResponseType,
    GetRestrictedProductCategoriesRequestType
  >(GET_RESTRICTED_PRODUCT_CATEGORIES_QUERY, {
    variables: {
      region: regionCode,
    },
  });

  const restrictedProductCategories: RestrictedProductCategoryProps[] =
    useMemo(() => {
      return getCategoryDetails({
        requests: restrictedProductRequests,
        categories:
          categories?.policy.restrictedProduct.restrictedProductCategories,
      });
    }, [restrictedProductRequests, categories]);

  return (
    <div className={css(styles.root)}>
      <LoadingIndicator loadingComplete={!isLoading}>
        {!merchantVerified && (
          <RestrictedProductUnverifiedContent style={css(styles.content)} />
        )}
        {merchantVerified && !hasExistingRequests && (
          <RestrictedProductVerifiedContent
            style={css(styles.content)}
            restrictedProductCategories={restrictedProductCategories}
          />
        )}
        {merchantVerified && hasExistingRequests && (
          <RestrictedProductTable
            style={css(styles.content)}
            restrictedProductCategories={restrictedProductCategories}
            suspectedCountry={suspectedCountry}
          />
        )}
      </LoadingIndicator>
    </div>
  );
};
export default observer(RestrictedProductTab);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
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
        content: {
          marginTop: 24,
          alignSelf: "center",
          width: "70%",
        },
      }),
    [pageBackground],
  );
};
