import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, HorizontalField } from "@ContextLogic/lego";
import { CountryType } from "@merchant/component/core/CountrySelect";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import countries from "@toolkit/countries";

/* Merchant API */
import { setData } from "@merchant/api/seller-profile-verification";

import { CountrySelect } from "@merchant/component/core";

/* Relative Imports */
import ContinueButton from "./ContinueButton";
import CountryOfDomicileFaqCard from "./CountryOfDomicileFaqCard";
import CountryOfDomicileModalHowToDetermine from "./CountryOfDomicileModalHowToDetermine";
import CountryOfDomicileModalDifference from "./CountryOfDomicileModalDifference";
import CountryOfDomicileModalWhyImportant from "./CountryOfDomicileModalWhyImportant";
import TextSection, { TextSectionProps } from "./TextSection";
import InfoTip from "./InfoTip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type CountryOfDomicileProps = BaseProps & {
  readonly suspectedCountryInCM: CountryCode | null | undefined;
  readonly merchantCountry: CountryCode | null | undefined;
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const CountryOfDomicilePage = (props: CountryOfDomicileProps) => {
  const {
    className,
    style,
    onNext,
    isRefetchingData,
    suspectedCountryInCM,
    merchantCountry,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCodeDomicile, setCountryCodeDomicile] = useState(
    suspectedCountryInCM || merchantCountry
  );

  const isCN = () => {
    if (suspectedCountryInCM) {
      return suspectedCountryInCM == "CN";
    }
    if (merchantCountry) {
      return merchantCountry == "CN";
    }
    return false;
  };

  const handleSubmit = async () => {
    let hasError = false;
    setIsSubmitting(true);
    try {
      await setData({
        page_name: "CountryOfDomicilePage",
        country_code_domicile: countryCodeDomicile || "",
      }).call();
      hasError = false;
    } catch (e) {
      hasError = true;
    } finally {
      setIsSubmitting(false);
    }

    if (!hasError) {
      onNext();
    }
  };

  const countryOptions = useCountryOptions();

  const styles = useStylesheet();

  const pageText: TextSectionProps = {
    title: i`Declare your country/region of domicile`,
    paragraphs: [
      i`Please select the country/region of domicile where you` +
        i` report taxes for your store.`,

      i`Assuming you have all the necessary know-how,` +
        i` there are still a few things you may need:`,
    ],
    textSectionStyles: {
      spaceBetweenParagraphs: 0,
      centerText: true,
    },
  };

  const infoForCN = [
    i`Based on the information we have for your Wish store,` +
      i` your country/region of domicile is **China**.`,

    i`We will ask you to validate your country/region of domicile` +
      i` in the next steps. Please click on **"Continue"** to further` +
      i` validate your store.`,
  ];

  const headsup =
    i`Please note: Your selection will be **permanent**` +
    i` after you click on "**Continue**" below.`;

  const faqText1 = i`How do I determine my country/region of domicile`;
  const faqText2 =
    i`How is country/region of domicile different` +
    i` from country of residence or country of citizenship?`;
  const faqText3 =
    i`Why is it important to choose the` +
    i` correct country/region of domicile?`;
  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.upper)}>
        <TextSection style={styles.pageText} {...pageText} />
        <div className={css(styles.faqCards)}>
          <CountryOfDomicileFaqCard
            text={faqText1}
            modalContent={() => <CountryOfDomicileModalHowToDetermine />}
          />
          <CountryOfDomicileFaqCard
            text={faqText2}
            modalContent={() => <CountryOfDomicileModalDifference />}
          />
          <CountryOfDomicileFaqCard
            text={faqText3}
            modalContent={() => <CountryOfDomicileModalWhyImportant />}
          />
        </div>
        <HorizontalField
          className={css(styles.field)}
          title={() => (
            <div className={css(styles.fieldTitle)}>
              Country/region of domicile
            </div>
          )}
          titleAlign="start"
          titleWidth={220}
        >
          <div className={css(styles.countrySelectContainer)}>
            <CountrySelect
              countries={countryOptions}
              currentCountryCode={countryCodeDomicile}
              onCountry={setCountryCodeDomicile}
              disabled={isCN()}
            />
            {isCN() ? (
              <InfoTip style={styles.info} paragraphs={infoForCN} />
            ) : (
              <Markdown className={css(styles.headsup)} text={headsup} />
            )}
          </div>
        </HorizontalField>
      </div>
      <ContinueButton
        className={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        text={i`Continue`}
        isDisabled={countryCodeDomicile == null}
      />
    </div>
  );
};

export default CountryOfDomicilePage;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        upper: {
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        pageText: {
          marginTop: 40,
        },
        faqCards: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: 16,
          marginTop: 28,
        },
        field: {
          marginTop: 40,
          maxWidth: 700,
          width: "100%",
        },
        fieldTitle: {
          lineHeight: "40px",
        },
        countrySelectContainer: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        info: {
          marginTop: 16,
        },
        headsup: {
          marginTop: 16,
        },
        button: {
          marginTop: 40,
        },
      }),
    []
  );
};

export const useCountryOptions = (): ReadonlyArray<CountryType> => {
  return useMemo(() => {
    const topCountries: CountryCode[] = [
      "CN",
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
    ];
    const ignoreCountries: (CountryCode | "D")[] = ["D"];

    const remainingCountryCodes = (Object.keys(
      countries
    ) as CountryCode[]).filter(
      (cc) => !topCountries.includes(cc) && !ignoreCountries.includes(cc)
    );

    const { countryCodeByIp } = AppStore.instance();
    const { locale } = LocalizationStore.instance();

    // sort the country in current locale
    const compareFn = new Intl.Collator(locale, { sensitivity: "base" })
      .compare;
    const countryCompareFn = (code1: string, code2: string) => {
      // if you find this please fix the any types (legacy)
      const name1 = (countries as any)[code1];
      const name2 = (countries as any)[code2];
      return compareFn(name1, name2);
    };
    remainingCountryCodes.sort(countryCompareFn);

    let countryCodes = [...topCountries, ...remainingCountryCodes];

    // put current country on top
    if (countryCodeByIp && countryCodes.includes(countryCodeByIp)) {
      countryCodes = countryCodes.filter((cc) => cc != countryCodeByIp);
      countryCodes = [countryCodeByIp, ...countryCodes];
    }

    return countryCodes.map<CountryType>((countryCode: CountryCode) => {
      const countryName = countries[countryCode];
      return {
        name: countryName,
        cc: countryCode,
      };
    });
  }, []);
};
