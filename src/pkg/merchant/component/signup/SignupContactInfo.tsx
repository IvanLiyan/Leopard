/* eslint no-empty: 0 */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import { PhoneNumberUtil } from "google-libphonenumber";
import faker from "faker/locale/en";

/* Lego Components */
import {
  Card,
  CheckboxField,
  Layout,
  Link,
  RadioGroup,
  Text,
} from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Field } from "@ContextLogic/lego";
import { TextInput, TextInputProps } from "@ContextLogic/lego";
import { PhoneNumberField } from "@merchant/component/core";
import { PromotionCardBanner } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";

import { StateField, CountrySelect } from "@merchant/component/core";

/* Merchant Components */
import SignupTOSText from "./SignupTOSText";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import CountryNames from "@toolkit/countries";
import { CountryCode } from "@toolkit/countries";

import {
  RequiredValidator,
  USZipcodeOnlyValidator,
  CNZipcodeOnlyValidator,
  ChineseOnlyValidator,
  NumbersOnlyValidator,
} from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

import { CountryType } from "@merchant/component/core/CountrySelect";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import UserStore from "@merchant/stores/UserStore";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { ThemeContext } from "@merchant/stores/ThemeStore";
import ExperimentStore from "@merchant/stores/ExperimentStore";
import { zendeskURL } from "@toolkit/url";
import { UserEntityType } from "@schema/types";

type SignupContactInfoProps = BaseProps & {
  readonly preApprovedPhoneNumber?: string;
  readonly hideTOS?: boolean;
  readonly showCNOptions?: boolean;
  readonly skipPhoneNumberVerification?: boolean;
  readonly lockCountry?: CountryCode | null;
  readonly interselectablePhoneCountryCodes?:
    | ReadonlyArray<CountryCode>
    | null
    | undefined;
};

const FieldHeight = 40;

const SellerTypes = ["BUSINESS", "INDIVIDUAL"] as const;
type SellerType = typeof SellerTypes[number];
const SellerTypeData: {
  readonly [sellerType in SellerType]: {
    readonly name: string;
    readonly description?: string;
    readonly userEntityType: UserEntityType;
  };
} = {
  BUSINESS: {
    name: i`I have a registered business`,
    description: i`My store is owned and operated by a registered company`,
    userEntityType: "COMPANY",
  },
  INDIVIDUAL: {
    name: i`I am an individual seller`,
    description: i`My store is owned and operated by an unincorporated individual`,
    userEntityType: "INDIVIDUAL",
  },
};

@observer
class SignupContactInfo extends Component<SignupContactInfoProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable
  isLoading = false;

  @observable
  sellerType: SellerType = "BUSINESS";

  @observable
  stateName: string | null | undefined;

  @observable
  firstName: string | null | undefined;

  @observable
  isValidFirstName = false;

  @observable
  lastName: string | null | undefined;

  @observable
  isValidLastName = false;

  @observable
  streetAddress1: string | null | undefined;

  @observable
  isValidStreetAddress1 = false;

  @observable
  streetAddress2: string | null | undefined;

  @observable
  isValidStreetAddress2 = false;

  @observable
  city: string | null | undefined;

  @observable
  isValidCity = false;

  @observable
  postalCode: string | null | undefined;

  @observable
  isValidPostalCode = false;

  @observable
  countryCode: CountryCode | null | undefined;

  @observable
  hasDifferentDomicileCountry = false;

  @observable
  domicileCountry: CountryCode | null | undefined;

  @observable
  isInterselectablePhoneCountry = false;

  @observable
  isValidPhoneNumber = false;

  @observable
  phoneNumberCC: CountryCode | null | undefined;

  @observable
  phoneNumberAreaCode: string | null | undefined;

  @observable
  phoneNumber: string | null | undefined;

  @observable
  verificationCode: string | null | undefined;

  @observable
  isValidVerificationCode = false;

  @observable
  sendCodeCountdown = 0;

  @observable
  isFirstTimeSendCode = true;

  @observable
  forceValidation = false;

  interselectablePhoneCountryCodes:
    | ReadonlyArray<CountryCode>
    | null
    | undefined;

  interselectablePhoneCountryCodeSet: Set<CountryCode> | null | undefined;

  countdownInterval: ReturnType<typeof setTimeout> | null | undefined = null;

  constructor(props: SignupContactInfoProps) {
    super(props);

    const { interselectablePhoneCountryCodes } = props;
    this.interselectablePhoneCountryCodes = interselectablePhoneCountryCodes;
    this.interselectablePhoneCountryCodeSet =
      this.interselectablePhoneCountryCodes != null
        ? new Set(this.interselectablePhoneCountryCodes)
        : undefined;

    const { loggedInMerchantUser: merchant } = UserStore.instance();

    if (merchant.business_address) {
      this.streetAddress1 = merchant.business_address.street_address1;
      this.streetAddress2 = merchant.business_address.street_address2;
      this.city = merchant.business_address.city;
      this.postalCode = merchant.business_address.zipcode;
      this.stateName = merchant.business_address.state;
      this.countryCode = merchant.business_address.country_code;
    }

    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parseAndKeepRawInput(merchant.phone_number);
      this.phoneNumber = number.getNationalNumber()?.toString();
      this.phoneNumberAreaCode = number.getCountryCode()?.toString();
      this.phoneNumberCC = phoneUtil.getRegionCodeForNumber(number) as
        | CountryCode
        | undefined;
    } catch (e) {
      // Default to US calling code if error
      this.phoneNumberAreaCode = "1";
      this.phoneNumber = merchant.phone_number;
      this.phoneNumberCC = this.countryCode;
    }
    this.firstName = merchant.first_name;
    this.lastName = merchant.last_name;
  }

  componentWillUnmount() {
    this.stopCountdown();
  }

  @computed
  get showAdditionalBusinessQuestions(): boolean {
    const experimentStore = ExperimentStore.instance();
    return (
      experimentStore.bucketForUser("signup_ask_business_questions") == "show"
    );
  }

  @action
  onCountry = (countryCode: CountryCode | undefined) => {
    if (this.countryCode != null && this.countryCode != countryCode) {
      this.city = null;
      this.stateName = null;
      this.postalCode = null;
    }

    this.countryCode = countryCode;
    this.phoneNumberCC = countryCode;
    this.isInterselectablePhoneCountry =
      this.interselectablePhoneCountryCodeSet != null
        ? this.interselectablePhoneCountryCodeSet.has(
            countryCode as CountryCode
          )
        : false;

    if (this.domicileCountry == countryCode) {
      this.domicileCountry = undefined;
    }

    this.resetNamesIfNotChinese();
  };

  @action
  onPhoneNumber = (params: {
    country: CountryCode;
    areaCode: string;
    phoneNumber: string;
  }) => {
    const { country, areaCode, phoneNumber } = params;
    this.phoneNumberCC = country;
    this.phoneNumber = phoneNumber;
    this.phoneNumberAreaCode = areaCode;

    this.resetNamesIfNotChinese();
  };

  @action
  resetNamesIfNotChinese = () => {
    if (this.phoneNumberCC != "CN") {
      return;
    }

    const cnPattern = /^[\u4E00-\u9FA5]+$/;

    if (this.firstName && !cnPattern.test(this.firstName.trim())) {
      this.firstName = null;
    }
    if (this.lastName && !cnPattern.test(this.lastName.trim())) {
      this.lastName = null;
    }
  };

  @action
  startCountdown = () => {
    this.isFirstTimeSendCode = false;
    this.sendCodeCountdown = 60;

    this.countdownInterval = setInterval(() => {
      if (this.sendCodeCountdown == 1) {
        this.stopCountdown();
      } else {
        this.sendCodeCountdown--;
      }
    }, 1000);
  };

  @action
  stopCountdown = () => {
    this.sendCodeCountdown = 0;
    if (this.countdownInterval != null) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = null;
  };

  @action
  handleSendVerificationCode = async () => {
    const toastStore = ToastStore.instance();
    const { phoneNumberAreaCode, phoneNumber, isValidPhoneNumber } = this;

    if (
      !isValidPhoneNumber ||
      phoneNumberAreaCode == null ||
      phoneNumber == null
    ) {
      return;
    }

    this.startCountdown();

    try {
      const params = {
        phoneNumber,
        phoneNumberAreaCode,
      };
      await onboardingApi.sendVerificationCode(params).call();
      toastStore.positive(i`Verification code sent successfully`);
    } catch (e) {
      if (this.countdownInterval != null) {
        this.stopCountdown();
      }
    }
  };

  @computed
  get isValidCountry() {
    return this.forceValidation && this.countryCode == null;
  }

  @computed
  get isValidDomicileCountry() {
    return (
      !this.hasDifferentDomicileCountry ||
      (this.forceValidation && this.domicileCountry == null)
    );
  }

  @computed
  get isValidState() {
    return (
      this.forceValidation &&
      (this.stateName == null || this.stateName.trim().length == 0)
    );
  }

  onSubmitClicked = async () => {
    const navigationStore = NavigationStore.instance();
    const {
      phoneNumberAreaCode,
      phoneNumber,
      firstName,
      lastName,
      streetAddress1,
      streetAddress2,
      city,
      postalCode,
      stateName,
      countryCode,
      verificationCode,
      sellerType,
      hasDifferentDomicileCountry,
      domicileCountry,
    } = this;

    if (!this.readyToSubmit) {
      this.forceValidation = true;
      return;
    }

    if (
      phoneNumberAreaCode == null ||
      phoneNumber?.trim() == null ||
      firstName?.trim() == null ||
      lastName?.trim() == null ||
      streetAddress1?.trim() == null ||
      city?.trim() == null ||
      postalCode?.trim() == null ||
      stateName?.trim() == null ||
      countryCode == null ||
      (verificationCode == null && this.shouldShowVerificationCode) ||
      (this.showAdditionalBusinessQuestions &&
        hasDifferentDomicileCountry &&
        domicileCountry == null)
    ) {
      this.forceValidation = true;
      return;
    }

    this.isLoading = true;

    let entityType: UserEntityType | null | undefined = null;
    if (this.showAdditionalBusinessQuestions) {
      entityType = SellerTypeData[sellerType].userEntityType;
    }

    const params: onboardingApi.OnboardingContactInfoParams = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: `+${phoneNumberAreaCode} ${phoneNumber.trim()}`,
      street_address1: streetAddress1.trim(),
      street_address2: streetAddress2?.trim(),
      city: city.trim(),
      zipcode: postalCode.trim(),
      state: stateName.trim(),
      country_code: countryCode,
      verification_code: verificationCode?.trim(),
      domicile_country: hasDifferentDomicileCountry ? domicileCountry : null,
      entity_type: entityType,
    };

    try {
      await onboardingApi.setContactInfo(params).call();
      navigationStore.navigate("/", { fullReload: true });
    } catch (e) {
      this.isLoading = false;
      this.verificationCode = null;
      return;
    }

    if ((window as any).fbq) {
      (window as any).fbq("trackCustom", "SubmitApplication");
    }
  };

  @computed
  get shouldShowVerificationCode(): boolean {
    const { preApprovedPhoneNumber } = this.props;

    let preApprovedPhoneNumberCC = this.countryCode;
    try {
      if (preApprovedPhoneNumber != null) {
        const phoneUtil = PhoneNumberUtil.getInstance();
        const number = phoneUtil.parseAndKeepRawInput(preApprovedPhoneNumber);
        preApprovedPhoneNumberCC = phoneUtil.getRegionCodeForNumber(
          number
        ) as CountryCode;
      }
    } catch (e) {}

    return (
      preApprovedPhoneNumber === undefined ||
      preApprovedPhoneNumber === null ||
      this.phoneNumber !== preApprovedPhoneNumber ||
      this.phoneNumberCC !== preApprovedPhoneNumberCC
    );
  }

  @computed
  get readyToSubmit(): boolean {
    const isAdditionalBusinessQuestionsValid =
      !this.hasDifferentDomicileCountry || this.domicileCountry != null;

    return (
      _.isEmpty(this.stateName) === false &&
      this.isValidFirstName &&
      this.isValidLastName &&
      this.isValidStreetAddress1 &&
      this.isValidCity &&
      this.isValidPostalCode &&
      this.countryCode != null &&
      this.isValidPhoneNumber &&
      (this.isValidVerificationCode || !this.shouldShowVerificationCode) &&
      (!this.showAdditionalBusinessQuestions ||
        isAdditionalBusinessQuestionsValid)
    );
  }

  @computed
  get requiredValidator(): RequiredValidator {
    return new RequiredValidator();
  }

  @computed
  get zipcodeValidators(): TextInputProps["validators"] {
    if (this.countryCode === "US") {
      return [this.requiredValidator, new USZipcodeOnlyValidator()];
    } else if (this.countryCode === "CN") {
      return [this.requiredValidator, new CNZipcodeOnlyValidator()];
    }

    return [this.requiredValidator];
  }

  @computed
  get nameValidators(): TextInputProps["validators"] {
    if (this.phoneNumberCC === "CN") {
      return [this.requiredValidator, new ChineseOnlyValidator()];
    }
    return [this.requiredValidator];
  }

  @computed
  get verificationCodeValidators(): TextInputProps["validators"] {
    return [this.requiredValidator, new NumbersOnlyValidator()];
  }

  @computed
  get countryOptions(): ReadonlyArray<CountryType> {
    let countryCodes: CountryCode[] = [];

    const { lockCountry, showCNOptions } = this.props;

    const countryNamesPartial = _.cloneDeep(CountryNames) as Partial<
      typeof CountryNames
    > & {
      EU?: string;
      D?: string;
    };

    delete countryNamesPartial.EU;
    delete countryNamesPartial.D;

    if (lockCountry) {
      countryCodes = [lockCountry];
    } else {
      let topCountries: CountryCode[] = [
        "US",
        "DE",
        "FR",
        "BR",
        "CA",
        "GB",
        "ES",
      ];

      if (!showCNOptions) {
        delete countryNamesPartial.CN;
        delete countryNamesPartial.HK;
        delete countryNamesPartial.TW;
      } else {
        topCountries = ["CN", ...topCountries];
      }

      const remainingCountryCodes: CountryCode[] = (Object.keys(
        countryNamesPartial
      ) as CountryCode[]).filter((cc) => !topCountries.includes(cc));

      const { countryCodeByIp } = AppStore.instance();
      const { locale } = LocalizationStore.instance();

      // sort the country in current locale
      const compareFn = new Intl.Collator(locale, { sensitivity: "base" })
        .compare;
      const countryCompareFn = (code1: CountryCode, code2: CountryCode) => {
        const name1 = CountryNames[code1];
        const name2 = CountryNames[code2];
        return compareFn(name1, name2);
      };
      remainingCountryCodes.sort(countryCompareFn);

      countryCodes = [...topCountries, ...remainingCountryCodes];

      // put current country on top
      if (countryCodeByIp && countryCodes.includes(countryCodeByIp)) {
        countryCodes = countryCodes.filter((cc) => cc != countryCodeByIp);
        countryCodes = [countryCodeByIp, ...countryCodes];
      }
    }

    return countryCodes.map(
      (countryCode: CountryCode): CountryType => {
        const countryName = CountryNames[countryCode];
        return {
          name: countryName,
          cc: countryCode,
        };
      }
    );
  }

  @computed
  get sendCodeButtonText() {
    if (this.isFirstTimeSendCode) {
      return i`Send verification code`;
    }

    if (this.sendCodeCountdown != 0) {
      return i`Resend verification code` + ` (${this.sendCodeCountdown}s)`;
    }

    return i`Resend verification code`;
  }

  @computed
  get styles() {
    const { negative } = this.context;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 25px 25px 25px",
        backgroundColor: palettes.textColors.White,
      },
      title: {
        fontSize: 24,
        lineHeight: 1.33,
        color: palettes.textColors.Ink,
        alignSelf: "center",
        textAlign: "center",
        padding: "40px 0px",
        cursor: "default",
      },
      content: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        alignItems: "stretch",
      },
      businessName: {
        marginBottom: 8,
      },
      field: {
        marginBottom: 25,
      },
      input: {
        height: FieldHeight,
      },
      streetAddress1: {
        marginBottom: 15,
      },
      sideBySide: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
          minWidth: 200,
          ":not(:last-child)": {
            "@media (max-width: 640px)": {
              marginRight: 0,
              marginBottom: 10,
            },
            "@media (min-width: 640px)": {
              marginRight: 10,
              marginBottom: 0,
            },
          },
        },
      },
      sellerButtons: {
        marginTop: 16,
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      },
      buttonHeightFixer: {
        height: FieldHeight,
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
        },
      },
      domicileCheckbox: {
        marginTop: 8,
      },
      domicileFaqCheckboxText: {
        cursor: "pointer",
        userSelect: "none",
      },
      domicileFaqLink: {
        marginLeft: 4,
      },
      domicileCountryField: {
        maxWidth: "50%",
      },
      footerRoot: {
        backgroundColor: palettes.greyScaleColors.LighterGrey,
        borderTop: `2px ${palettes.greyScaleColors.LightGrey} dotted`,
        padding: "18px 24px 22px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      footerText: {
        maxWidth: 320,
        fontSize: 14,
        lineHeight: 1.5,
        color: palettes.coreColors.DarkestWishBlue,
        marginRight: 40,
      },
      primaryButtonsPopStyle: {
        display: "grid",
      },
      errorText: {
        fontSize: 12,
        lineHeight: 1.33,
        color: negative,
        marginTop: 7,
        cursor: "default",
      },
    });
  }

  @computed
  get isPreorderMerchant() {
    const {
      loggedInMerchantUser: { utm_source: source },
    } = UserStore.instance();
    return source === "preorder_email";
  }

  render() {
    const { negative, borderPrimary } = this.context;
    const { className, hideTOS } = this.props;
    const {
      loggedInMerchantUser: { preorder_gmv: preorderGMV },
    } = UserStore.instance();

    return (
      <Card className={css(className)}>
        {this.isPreorderMerchant && (
          <PromotionCardBanner
            defaultIllustration="preorderOnboardingContactLogo"
            title={i`Enter your store and unlock ${formatCurrency(
              preorderGMV || 0,
              "USD"
            )} of sales`}
            subtitle={
              i`When your business expands,${" "}` +
              i`we may ask you for a few more details to further validate your store.`
            }
          />
        )}

        <div className={css(this.styles.root)}>
          <Text weight="bold" className={css(this.styles.title)}>
            Add your contact information
          </Text>
          <div className={css(this.styles.content)}>
            <div className={css(this.styles.sideBySide)}>
              <Field
                className={css(
                  !this.showAdditionalBusinessQuestions && this.styles.field
                )}
                title={i`First Name`}
              >
                <TextInput
                  placeholder={i`Enter your first name`}
                  focusOnMount={!this.showAdditionalBusinessQuestions}
                  onChange={({ text }) => (this.firstName = text)}
                  disabled={this.isLoading}
                  height={FieldHeight}
                  value={this.firstName}
                  validators={this.nameValidators}
                  onValidityChanged={(isValid) =>
                    (this.isValidFirstName = isValid)
                  }
                  debugValue={faker.name.firstName()}
                  forceValidation={this.forceValidation}
                />
              </Field>
              <Field
                className={css(
                  !this.showAdditionalBusinessQuestions && this.styles.field
                )}
                title={i`Last Name`}
              >
                <TextInput
                  placeholder={i`Enter your last name`}
                  onChange={({ text }) => (this.lastName = text)}
                  disabled={this.isLoading}
                  value={this.lastName}
                  height={FieldHeight}
                  validators={this.nameValidators}
                  onValidityChanged={(isValid) =>
                    (this.isValidLastName = isValid)
                  }
                  debugValue={faker.name.lastName()}
                  forceValidation={this.forceValidation}
                />
              </Field>
            </div>
            {this.showAdditionalBusinessQuestions && (
              <div
                className={css(this.styles.field, this.styles.sellerButtons)}
              >
                <RadioGroup
                  onSelected={(value: SellerType) => (this.sellerType = value)}
                  disabled={this.isLoading}
                  selectedValue={this.sellerType}
                >
                  {SellerTypes.map((sellerType) => (
                    <RadioGroup.Item
                      key={sellerType}
                      value={sellerType}
                      text={() => (
                        <Text weight="regular">
                          {SellerTypeData[sellerType].name}
                        </Text>
                      )}
                      description={SellerTypeData[sellerType].description}
                    />
                  ))}
                </RadioGroup>
              </div>
            )}
            <Field
              className={css(this.styles.field)}
              title={i`Business Street Address`}
            >
              <TextInput
                placeholder={i`Street address 1`}
                onChange={({ text }) => (this.streetAddress1 = text)}
                disabled={this.isLoading}
                className={css(this.styles.streetAddress1)}
                validators={[this.requiredValidator]}
                height={FieldHeight}
                value={this.streetAddress1}
                onValidityChanged={(isValid) =>
                  (this.isValidStreetAddress1 = isValid)
                }
                debugValue={faker.address.streetAddress()}
                forceValidation={this.forceValidation}
              />

              <TextInput
                placeholder={i`Street address 2`}
                onChange={({ text }) => (this.streetAddress2 = text)}
                disabled={this.isLoading}
                height={FieldHeight}
                value={this.streetAddress2}
                onValidityChanged={(isValid) =>
                  (this.isValidStreetAddress2 = isValid)
                }
                debugValue={faker.address.secondaryAddress()}
              />
            </Field>
            <div
              className={css(
                this.styles.sideBySide,
                !this.showAdditionalBusinessQuestions && this.styles.field
              )}
            >
              <Field title={i`Country / Region`}>
                <CountrySelect
                  onCountry={this.onCountry}
                  disabled={this.isLoading}
                  currentCountryCode={this.countryCode}
                  countries={this.countryOptions}
                  borderColor={this.isValidCountry ? negative : borderPrimary}
                />
                {this.isValidCountry && (
                  <Text
                    className={css(this.styles.errorText)}
                    weight="semibold"
                  >
                    This field is required
                  </Text>
                )}
              </Field>
              <StateField
                currentState={this.stateName}
                disabled={this.isLoading}
                height={FieldHeight}
                countryCode={this.countryCode}
                excludeStates={
                  this.countryCode == "CN" ? ["TW", "HK", "MO"] : []
                }
                onState={(stateName) => (this.stateName = stateName)}
                borderColor={this.isValidState ? negative : borderPrimary}
              >
                {this.isValidState && (
                  <Text
                    className={css(this.styles.errorText)}
                    weight="semibold"
                  >
                    This field is required
                  </Text>
                )}
              </StateField>
            </div>
            {this.showAdditionalBusinessQuestions && (
              <Layout.FlexRow
                className={css(this.styles.field, this.styles.domicileCheckbox)}
                alignItems="stretch"
              >
                <CheckboxField
                  onChange={(checked) =>
                    (this.hasDifferentDomicileCountry = checked)
                  }
                  checked={this.hasDifferentDomicileCountry}
                  disabled={this.isLoading}
                />
                <div
                  onClick={() => {
                    this.hasDifferentDomicileCountry = !this
                      .hasDifferentDomicileCountry;
                  }}
                >
                  <Text className={css(this.styles.domicileFaqCheckboxText)}>
                    I have a different legal country / region of domicile.
                  </Text>
                </div>
                <Link
                  className={css(this.styles.domicileFaqLink)}
                  href={zendeskURL("360050893133")}
                  openInNewTab
                >
                  More info
                </Link>
              </Layout.FlexRow>
            )}
            {this.hasDifferentDomicileCountry && (
              <Field
                className={css(
                  this.styles.field,
                  this.styles.domicileCountryField
                )}
                title={i`Country / Region of Domicile`}
              >
                <CountrySelect
                  onCountry={(country: CountryCode | undefined) =>
                    (this.domicileCountry = country)
                  }
                  disabled={this.isLoading}
                  currentCountryCode={this.domicileCountry}
                  countries={this.countryOptions.filter(
                    ({ cc }) => cc != this.countryCode
                  )}
                  borderColor={
                    this.isValidDomicileCountry ? negative : borderPrimary
                  }
                />
                {this.isValidDomicileCountry && (
                  <Text
                    className={css(this.styles.errorText)}
                    weight="semibold"
                  >
                    This field is required
                  </Text>
                )}
              </Field>
            )}
            <div className={css(this.styles.sideBySide)}>
              <Field className={css(this.styles.field)} title={i`City`}>
                <TextInput
                  placeholder={i`Select a city`}
                  onChange={({ text }) => (this.city = text)}
                  disabled={this.isLoading}
                  value={this.city}
                  height={FieldHeight}
                  validators={[this.requiredValidator]}
                  onValidityChanged={(isValid) => (this.isValidCity = isValid)}
                  debugValue={faker.address.city()}
                  forceValidation={this.forceValidation}
                />
              </Field>
              <Field
                className={css(this.styles.field)}
                title={this.countryCode === "US" ? i`ZIP Code` : i`Postal Code`}
              >
                <TextInput
                  placeholder={
                    this.countryCode === "US"
                      ? i`Enter your ZIP code`
                      : i`Enter your postal code`
                  }
                  onChange={({ text }) => (this.postalCode = text)}
                  disabled={this.isLoading}
                  value={this.postalCode}
                  height={FieldHeight}
                  validators={this.zipcodeValidators}
                  onValidityChanged={(isValid) =>
                    (this.isValidPostalCode = isValid)
                  }
                  debugValue={faker.address.zipCode().slice(0, 5)}
                  forceValidation={this.forceValidation}
                />
              </Field>
            </div>
            <PhoneNumberField
              className={css(this.styles.field)}
              disabled={this.isLoading || this.sendCodeCountdown != 0}
              country={this.phoneNumberCC || "US"}
              countryFixed={!this.isInterselectablePhoneCountry}
              countryOptions={
                this.isInterselectablePhoneCountry
                  ? this.interselectablePhoneCountryCodes
                  : undefined
              }
              phoneNumber={this.phoneNumber}
              height={FieldHeight}
              onPhoneNumber={this.onPhoneNumber}
              onValidityChanged={(isValid) =>
                (this.isValidPhoneNumber = isValid)
              }
              debugValue={faker.phone
                .phoneNumber()
                .replace(/\D/g, "")
                .slice(0, 10)}
              forceValidation={this.forceValidation}
            />
            {this.shouldShowVerificationCode && (
              <Field
                className={css(this.styles.field)}
                title={i`Verify Your Phone Number`}
              >
                <div className={css(this.styles.sideBySide)}>
                  <TextInput
                    placeholder={i`Enter verification code`}
                    onChange={({ text }) => (this.verificationCode = text)}
                    disabled={this.isLoading || !this.isValidPhoneNumber}
                    value={this.verificationCode}
                    height={FieldHeight}
                    validators={this.verificationCodeValidators}
                    onValidityChanged={(isValid) =>
                      (this.isValidVerificationCode = isValid)
                    }
                    debugValue="000000"
                    forceValidation={this.forceValidation}
                  />
                  <div className={css(this.styles.buttonContainer)}>
                    <div className={css(this.styles.buttonHeightFixer)}>
                      <PrimaryButton
                        onClick={this.handleSendVerificationCode}
                        isDisabled={
                          this.isLoading ||
                          this.sendCodeCountdown != 0 ||
                          !this.isValidPhoneNumber
                        }
                        popoverStyle={css(this.styles.primaryButtonsPopStyle)}
                      >
                        {this.sendCodeButtonText}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </Field>
            )}
            {!hideTOS && <SignupTOSText buttonText={i`Enter my store`} />}

            <div className={css(this.styles.buttonContainer)}>
              <div className={css(this.styles.buttonHeightFixer)}>
                <PrimaryButton
                  onClick={this.onSubmitClicked}
                  isLoading={this.isLoading}
                  popoverStyle={css(this.styles.primaryButtonsPopStyle)}
                >
                  {this.isLoading
                    ? i`Setting up your store`
                    : i`Enter my store`}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
        {!this.isPreorderMerchant && (
          <div className={css(this.styles.footerRoot)}>
            <Text weight="medium" className={css(this.styles.footerText)}>
              When your business expands, we may ask you for a few more details
              to verify your store.
            </Text>
            <Illustration
              name="ladyHoldingPackage"
              alt={i`Default footer image`}
            />
          </div>
        )}
      </Card>
    );
  }
}
export default SignupContactInfo;
