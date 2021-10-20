/*
 *
 * CountryFlagsGroup.tsx
 *
 * Created by Joyce Ji on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { css } from "@toolkit/styling";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import { Flag, Popover } from "@merchant/component/core";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import ProductShippingEditState, {
  PickedCountry,
} from "@merchant/model/products/ProductShippingEditState";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

const GET_COUNTRY_INFO = gql`
  query CountryFlagsGroup_GetUnityCountries {
    platformConstants {
      unityCountries {
        code
        name
      }
    }
    policy {
      productCompliance {
        productDestinationCountries {
          code
          name
        }
      }
    }
  }
`;

type Props = BaseProps & {
  readonly editState?: ProductShippingEditState;
};

type ResponseType = {
  readonly platformConstants: {
    readonly unityCountries: ReadonlyArray<PickedCountry>;
  };
  readonly policy: {
    readonly productCompliance: {
      readonly productDestinationCountries: ReadonlyArray<PickedCountry>;
    };
  };
};

const CountryFlagsGroup: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();
  const { data: responseData } = useQuery<ResponseType, void>(GET_COUNTRY_INFO);
  const unityCountries =
    editState?.unityCountries || responseData?.platformConstants.unityCountries;

  if (unityCountries == null) return null;

  const euCompliantCountries =
    editState?.euCompliantCountries ||
    responseData?.policy.productCompliance.productDestinationCountries ||
    [];
  const euCompliantCountryCodes = euCompliantCountries.map(
    (country) => country.code,
  );

  return (
    <div className={css(styles.root)}>
      {unityCountries.map((country) =>
        editState?.showUnityEUComplianceBanners &&
        editState?.isAfterEUComplianceDate &&
        euCompliantCountryCodes.includes(country.code) ? (
          <Popover
            key={country.name}
            className={css(styles.toolTip)}
            popoverContent={
              i`Impressions and sales in all EU countries (including this EU country ` +
              i`supported by Wish's unification initiative) have been blocked for ` +
              i`this product until a Responsible Person has been linked.`
            }
            position={"top center"}
            contentWidth={370}
          >
            <div className={css(styles.blurredCountry)} key={country.code}>
              <Flag countryCode={country.code} className={css(styles.flag)} />
              <div className={css(styles.blurredCountryName)}>
                {country.name}
              </div>
            </div>
          </Popover>
        ) : (
          <div className={css(styles.country)} key={country.code}>
            <Flag countryCode={country.code} className={css(styles.flag)} />
            <div className={css(styles.countryName)}>{country.name}</div>
          </div>
        ),
      )}
    </div>
  );
};

export default observer(CountryFlagsGroup);

const useStylesheet = () => {
  const { surfaceLightest, pageBackground, surface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
          flexWrap: "wrap",
          paddingLeft: 10,
          paddingTop: 10,
        },
        country: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: pageBackground,
          padding: 8,
          marginRight: 10,
          marginBottom: 10,
        },
        blurredCountry: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: surface,
          padding: 8,
          marginRight: 10,
          marginBottom: 10,
        },
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
        },
        blurredCountryName: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          color: palettes.greyScaleColors.DarkGrey,
        },
        toolTip: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
        },
      }),
    [surfaceLightest, pageBackground, surface],
  );
};
