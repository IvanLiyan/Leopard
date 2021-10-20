import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* External Libraries */
import _ from "lodash";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Components */
import { Flag } from "@merchant/component/core";

/* Type Imports */
import { Country } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const GET_COUNTRIES_QEURY = gql`
  query GetRestrictedProdutcs {
    policy {
      restrictedProduct {
        restrictedProductEuropeCountries {
          code
          name
        }
      }
    }
  }
`;

type RequestType = {};

type CountryType = Pick<Country, "name" | "code">;
type ResponseType = {
  readonly policy: {
    readonly restrictedProduct: {
      readonly restrictedProductEuropeCountries: ReadonlyArray<CountryType> | null;
    };
  };
};

type ModalContentlProps = BaseProps;

const ModalContent = ({}: ModalContentlProps) => {
  const { data } = useQuery<ResponseType, RequestType>(GET_COUNTRIES_QEURY, {
    variables: {},
  });

  const countryToName = (country: CountryType) => country.name;
  const countries = _.sortBy(
    data?.policy?.restrictedProduct?.restrictedProductEuropeCountries,
    countryToName,
  );

  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.container)}>
        <div className={css(styles.section)}>
          {!!countries &&
            countries.map((country) => (
              <div className={css(styles.country)} key={country.code}>
                <Flag countryCode={country.code} className={css(styles.flag)} />
                <div className={css(styles.countryName)}>{country.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ModalContent;

const useStylesheet = () => {
  const { surfaceLightest, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        container: {
          paddingTop: 24,
          paddingBottom: 24,
          alignSelf: "center",
          width: "60%",
        },
        section: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "center",
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
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
        },
      }),
    [surfaceLightest, pageBackground],
  );
};
