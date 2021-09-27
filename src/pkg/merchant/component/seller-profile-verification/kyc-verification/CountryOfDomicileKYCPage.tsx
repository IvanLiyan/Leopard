import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField, Markdown } from "@ContextLogic/lego";
import { CountrySelect } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import {
  setData,
  switchVerificationFlow,
} from "@merchant/api/kyc-verification";

/* Relative Imports */
import FooterButton from "./FooterButton";

/* SellerProfileVerification Imports */
import CountryOfDomicileFaqCard from "@merchant/component/seller-profile-verification/CountryOfDomicileFaqCard";
import CountryOfDomicileModalHowToDetermine from "@merchant/component/seller-profile-verification/CountryOfDomicileModalHowToDetermine";
import CountryOfDomicileModalDifference from "@merchant/component/seller-profile-verification/CountryOfDomicileModalDifference";
import CountryOfDomicileModalWhyImportant from "@merchant/component/seller-profile-verification/CountryOfDomicileModalWhyImportant";
import CardHeader from "@merchant/component/seller-profile-verification/CardHeader";
import TextSection, {
  TextSectionProps,
} from "@merchant/component/seller-profile-verification/TextSection";
import { useCountryOptions } from "@merchant/component/seller-profile-verification/CountryOfDomicilePage";
import { ConfirmationModal } from "@merchant/component/core/modal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type CountryOfDomicileKYCProps = BaseProps & {
  readonly initialCountry: CountryCode | null | undefined;
  readonly canChangeCountry: boolean;
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
  readonly onBack: () => void;
};

const CountryOfDomicileKYCPage = (props: CountryOfDomicileKYCProps) => {
  const navigationStore = useNavigationStore();

  const {
    className,
    style,
    onNext,
    isRefetchingData,
    initialCountry,
    canChangeCountry,
    onBack,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCodeDomicile, setCountryCodeDomicile] = useState(
    initialCountry
  );

  const confirmationContent =
    i`You have selected a country located outside of the European Economic Area` +
    i` and the United Kingdom,` +
    i` hence your store will be validated through ContextLogic. (dba Wish)`;

  const handleRedirect = () => {
    new ConfirmationModal(() => (
      <Markdown
        className={css(styles.confirmationContent)}
        text={confirmationContent}
      />
    ))
      .setHeader({ title: i`You are about to be redirected` })
      .setCancel(i`Stay`)
      .setAction(i`Proceed`, async () => {
        let hasError = false;
        if (!countryCodeDomicile) {
          return;
        }
        try {
          await switchVerificationFlow({
            country_code_domicile: countryCodeDomicile,
          }).call();
        } catch (e) {
          hasError = true;
        }
        if (!hasError) {
          await navigationStore.navigate("/seller-profile-verification");
        }
      })
      .render();
  };

  const handleSubmit = async () => {
    let hasError = false;
    setIsSubmitting(true);
    if (!countryCodeDomicile) {
      return;
    }
    try {
      const response = await setData({
        page_name: "CountryOfDomicileKYC",
        country_code_domicile: countryCodeDomicile,
      }).call();
      hasError = false;
      const selectedNonEEACountry = response?.data?.selected_non_eea_country;
      if (selectedNonEEACountry) {
        handleRedirect();
        setIsSubmitting(false);
        return;
      }
    } catch (e) {
      hasError = true;
    } finally {
      setIsSubmitting(false);
    }

    if (!hasError) {
      onNext();
    }
  };

  const handleBack = () => {
    if (!isSubmitting) {
      onBack();
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

  const faqText1 = i`How do I determine my country/region of domicile`;
  const faqText2 =
    i`How is country/region of domicile different` +
    i` from country of residence or country of citizenship?`;
  const faqText3 =
    i`Why is it important to choose the` +
    i` correct country/region of domicile?`;
  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={handleBack}
        displayType={"back"}
      />
      <div className={css(styles.upper)}>
        <TextSection {...pageText} />
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
              disabled={!canChangeCountry}
            />
          </div>
        </HorizontalField>
      </div>
      <FooterButton
        className={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        isDisabled={countryCodeDomicile == null}
        text={i`Continue`}
      />
    </div>
  );
};

export default CountryOfDomicileKYCPage;

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
        header: {
          marginTop: 24,
          padding: "0 24px",
        },
        upper: {
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
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
        confirmationContent: {
          padding: "40px 0",
        },
        countrySelectContainer: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        button: {
          marginTop: 40,
        },
      }),
    []
  );
};
