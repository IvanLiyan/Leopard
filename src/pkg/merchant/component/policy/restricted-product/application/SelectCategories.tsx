/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H5, Markdown, SimpleSelect } from "@ContextLogic/lego";

/* Merchant Components */
import {
  regionCodeToName,
  getCategoryDetails,
  RegionToCategoriesMap,
  RestrictedProductRequestType,
  CountryAndRegionType,
  RestrictedProductCategoryProps,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";
import ProductCategoryCard from "@merchant/component/policy/restricted-product/application/ProductCategoryCard";
import RPApplicationState from "@merchant/model/policy/restricted-product/RPApplicationState";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import {
  RestrictedProductRegionCode,
  RestrictedProductCategory,
} from "@schema/types";
/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type SelectCategoriesProps = BaseProps & {
  readonly currentApplication: RPApplicationState;
  readonly restrictedProductRegions: ReadonlyArray<CountryAndRegionType>;
  readonly restrictedProductRequests: ReadonlyArray<
    RestrictedProductRequestType
  >;
  readonly regionToCategoryMap: RegionToCategoriesMap;
};

const SelectCategories = ({
  style,
  currentApplication,
  restrictedProductRegions,
  restrictedProductRequests,
  regionToCategoryMap,
}: SelectCategoriesProps) => {
  const selectOptions: ReadonlyArray<{
    readonly value: RestrictedProductRegionCode;
    readonly text: string;
  }> = useMemo(() => {
    return restrictedProductRegions.map((region: CountryAndRegionType) => {
      return {
        value: region.regionCode,
        text: regionCodeToName[region.regionCode],
      };
    });
  }, [restrictedProductRegions]);

  const restrictedProductCategories: RestrictedProductCategoryProps[] = useMemo(() => {
    const categories: ReadonlyArray<RestrictedProductCategory> | undefined =
      currentApplication.regionCode != null
        ? regionToCategoryMap.get(currentApplication.regionCode)
        : undefined;

    if (categories && categories.indexOf("OTC_MEDICATION") !== -1) {
      currentApplication.hasOTCMedication = true;
    } else {
      currentApplication.hasOTCMedication = false;
    }
    return getCategoryDetails({
      requests: restrictedProductRequests,
      categories,
    });
  }, [
    restrictedProductRequests,
    regionToCategoryMap,
    currentApplication.regionCode,
    currentApplication.hasOTCMedication,
  ]);

  const styles = useStylesheet();
  const { negativeDark } = useTheme();
  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>Select Country/Region & Categories</H5>
      <Markdown
        className={css(styles.subtitle)}
        text={
          i`Products from these categories need approval to be sold on Wish. ` +
          i`Select the country/region and all the categories you intend to sell ` +
          i`in and on Wish.`
        }
      />

      <div className={css(styles.section)}>
        {i`Country/Region`}
        <span style={{ color: negativeDark, marginLeft: 5 }}>*</span>

        <SimpleSelect
          options={selectOptions}
          onSelected={(val: RestrictedProductRegionCode) => {
            currentApplication.setRegionCode(val);
          }}
          selectedValue={currentApplication.regionCode}
          disabled={
            restrictedProductRequests != null &&
            restrictedProductRequests.length != 0
          }
        />
      </div>

      <div className={css(styles.section)}>
        {i`Categories`}
        <span style={{ color: negativeDark, marginLeft: 5 }}>*</span>
        <div className={css(style, styles.table)}>
          {restrictedProductCategories.map(
            (restrictedProductCategory: RestrictedProductCategoryProps) => (
              <ProductCategoryCard
                key={restrictedProductCategory.category}
                productCategory={restrictedProductCategory}
                currentApplication={currentApplication}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(SelectCategories);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
        },
        title: {
          marginTop: 8,
        },
        subtitle: {
          marginTop: 8,
        },
        section: {
          marginTop: 20,
        },
        table: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, 240px)",
          gap: 12,
          placeItems: "stretch",
          justifyContent: "center",
        },
      }),
    []
  );
