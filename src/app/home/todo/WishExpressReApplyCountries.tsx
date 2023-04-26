import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import sortBy from "lodash/sortBy";

import { LoadingIndicator, PrimaryButton } from "@ContextLogic/lego";
import { CheckboxGrid } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OptionType } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { CountryCode } from "@schema";
import {
  GetWishExpressStatusResponse,
  SubmitReApplyParams,
  WISH_EXPRESS_GET_STATUS_ENDPOINT,
  WISH_EXPRESS_SUBMIT_APPLICATION_ENDPOINT,
} from "@home/toolkit/wish-express";
import { useMutation, useRequest } from "@core/toolkit/restApi";
import { Flags4x3, getCountryName } from "@core/toolkit/countries";
import { css } from "@core/toolkit/styling";
import Illustration from "@core/components/Illustration";
import { Heading, Text } from "@ContextLogic/atlas-ui";

export type WishApplicationProps = BaseProps & {
  readonly onComplete: (str: ApplicationStep) => unknown;
};

type ApplicationStep = "WishExpressReApplyCompleted";

const WishExpressReApplyCountries: React.FC<WishApplicationProps> = ({
  onComplete,
}) => {
  const [countries, setCountries] = useState<ReadonlySet<CountryCode>>(
    new Set(),
  );

  const styles = useStylesheet();

  const { data: wishExpressStatus, isLoading: isLoadingWishExpressStatus } =
    useRequest<GetWishExpressStatusResponse, Record<never, never>>({
      url: WISH_EXPRESS_GET_STATUS_ENDPOINT,
    });

  const { trigger: submitReApply } = useMutation<SubmitReApplyParams>({
    url: WISH_EXPRESS_SUBMIT_APPLICATION_ENDPOINT,
  });

  const eligibleApplicationCountries = useMemo(
    () => wishExpressStatus?.we_eligible_application_countries ?? [],
    [wishExpressStatus],
  );

  const options: ReadonlyArray<OptionType> = useMemo(() => {
    const countryOptions: ReadonlyArray<OptionType> = (
      eligibleApplicationCountries ?? []
    )
      .filter((countryCode) => getCountryName(countryCode).trim().length > 0)
      .map((countryCode) => ({
        title: getCountryName(countryCode),
        value: countryCode,
        icon: Flags4x3[countryCode.toLowerCase()].src,
      }));

    return sortBy(countryOptions, (option) => option.title);
  }, [eligibleApplicationCountries]);

  const isDisabled = countries.size === 0;

  const onCheckChanged = (countryCode: CountryCode, checked: boolean) => {
    const newCountries = new Set(countries);
    if (checked) {
      newCountries.add(countryCode);
    } else {
      newCountries.delete(countryCode);
    }
    setCountries(newCountries);
  };

  const onCheckAll = () => {
    if (options != null) {
      if (countries.size != options.length) {
        setCountries(new Set(options.map(({ value }) => value as CountryCode)));
      } else {
        setCountries(new Set());
      }
    }
  };

  return (
    <div className={css(styles.contentContainer)}>
      {isLoadingWishExpressStatus ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className={css(styles.root)}>
            <Illustration
              name="todoWishExpressWithText"
              alt="wish-express-logo"
              animate={false}
              className={css(styles.wishLogo)}
            />
            <Heading className={css(styles.modalHeader)} variant="h2">
              Which countries would you like to apply for?
            </Heading>
            <div className={css(styles.subHeaderContainer)}>
              <Heading className={css(styles.subHeader)} variant="h4">
                Please select the countries you can deliver to in 5 days or
                less.
              </Heading>
              <Text
                className={css(styles.subHeaderBlueText)}
                onClick={() => {
                  onCheckAll();
                }}
                variant="bodyMStrong"
              >
                Select All
              </Text>
            </div>
            <CheckboxGrid
              className={css(styles.optionsGrid)}
              options={options}
              onCheckedChanged={onCheckChanged}
              selected={Array.from(countries.values())}
            />
          </div>
          <div className={css(styles.footer)}>
            <PrimaryButton
              isDisabled={isDisabled}
              className={css(styles.actionButton)}
              onClick={async () => {
                await submitReApply({
                  countries: Array.from(countries.values()).join(),
                });
                onComplete("WishExpressReApplyCompleted");
              }}
            >
              Apply Now
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
};

export default WishExpressReApplyCountries;

const useStylesheet = () => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingLeft: 52,
          paddingRight: 52,
          paddingBottom: 64,
        },
        modalHeader: {
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: 20,
          paddingTop: 20,
        },
        subHeader: {
          textAlign: "left",
        },
        wishLogo: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 192,
          objectFit: "contain",
          paddingTop: 50,
        },
        exitButton: {
          position: "absolute",
          right: 0,
          top: 0,
          paddingTop: 16,
          paddingRight: 24,
          width: 24,
          backgroundColor: "ffffff",
          cursor: "pointer",
        },
        subHeaderContainer: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        subHeaderBlueText: {
          color: primary,
          textAlign: "right",
          cursor: "pointer",
        },
        actionButton: {
          marginBottom: 24,
          paddingTop: 24,
        },
        footer: {
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          placeContent: "center",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 0 0 #c4cdd5",
          backgroundBlendMode: "darken",
          backgroundImage: "linear-gradient(to bottom, #ffffff, #ffffff)",
        },
        contentContainer: {
          borderRadius: "4px",
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          backgroundColor: "#ffffff",
        },
        optionsGrid: {
          alignSelf: "stretch",
        },
      }),
    [primary],
  );
};
