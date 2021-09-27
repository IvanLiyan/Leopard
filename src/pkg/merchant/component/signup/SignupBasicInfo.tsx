import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import gql from "graphql-tag";

/* External Libraries */
import faker from "faker/locale/en";
import { EventEmitter } from "fbemitter";

/* Lego Components */
import { Card, CheckboxField } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Field } from "@ContextLogic/lego";
import { Text, TextInput, TextInputProps } from "@ContextLogic/lego";
import { EmailInput } from "@ContextLogic/lego";

import { PasswordField } from "@merchant/component/core";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { PromotionCardBanner } from "@merchant/component/core";

/* Merchant Components */
import SignupTOSText from "./SignupTOSText";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import {
  StoreNameValidator,
  NoWishEmailsValidator,
  UrlValidator,
} from "@toolkit/validators";
import ApolloStore from "@merchant/stores/ApolloStore";
import ToastStore from "@merchant/stores/ToastStore";

/* Merchant Components */
import IeDeprecationBanner from "@merchant/component/login/IeDeprecationBanner";
import RouteStore from "@merchant/stores/RouteStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import PromotionStore from "@merchant/stores/PromotionStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import CaptchaInput, {
  OnCaptchaChangeEvent,
} from "@merchant/component/login/CaptchaInput";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { ReferralDetails } from "@merchant/model/RevShareState";
import {
  MerchantInviteInfoPick,
  SalesforceLeadInfoPick,
  BdSignupCodeInfoPick,
} from "@toolkit/signup/signup-types";
import {
  AuthenticationMutationsMerchantSignupArgs,
  MerchantSignupInput,
  MerchantSignupMutation,
  MerchantSignupSourceType,
} from "@schema/types";
import ExperimentStore from "@merchant/stores/ExperimentStore";

type FormContext = {
  email?: string;
  storeName?: string;
};

type SignupBasicInfoProps = BaseProps & {
  readonly showCaptcha?: boolean | null | undefined;
  readonly bdSignupCode?: string | null | undefined;
  readonly salesforceLeadId?: string | null | undefined;
  readonly referralId?: string | null | undefined;
  readonly partnerApp?: ReferralDetails | null | undefined;
  readonly isExpressFlow?: boolean;
  readonly isMerchantPlusFlow?: boolean;
  readonly formContext?: FormContext | null | undefined;
  readonly paypalMerchantId?: string | null | undefined;
  readonly showTOS: boolean | null | undefined;
  readonly inviteDetails?: MerchantInviteInfoPick;
  readonly salesforceLeadInfo?: SalesforceLeadInfoPick;
  readonly bdSignupCodeInfo?: BdSignupCodeInfoPick;
};

const FieldHeight = 40;

type MerchantSignupResponseType = {
  readonly authentication: {
    readonly merchantSignup: Pick<
      MerchantSignupMutation,
      "ok" | "message" | "shouldRedirectCnMerchant" | "userId" | "session"
    >;
  };
};

const MERCHANT_SIGNUP_MUTATION = gql`
  mutation MerchantSignupMutation($input: MerchantSignupInput!) {
    authentication {
      merchantSignup(input: $input) {
        ok
        message
        shouldRedirectCnMerchant
        userId
        session
      }
    }
  }
`;

@observer
class SignupBasicInfo extends Component<SignupBasicInfoProps> {
  @observable
  isLoading = false;

  @observable
  email: string | null | undefined;

  @observable
  emailIsValid = false;

  @observable
  password: string | null | undefined;

  @observable
  passwordIsValid = false;

  @observable
  storeName: string | null | undefined;

  @observable
  storeNameIsValid = false;

  @observable
  captcha: string | null | undefined;

  @observable
  captchaToken: string | null | undefined;

  @observable
  existingStoreUrl: string | null | undefined;

  @observable
  existingStoreUrlIsValid = false;

  @observable
  alreadySelling = false;

  refreshEmitter: EventEmitter = new EventEmitter();

  constructor(props: SignupBasicInfoProps) {
    super(props);
    const { formContext, inviteDetails, bdSignupCodeInfo, salesforceLeadInfo } =
      this.props;
    if (formContext) {
      const { email, storeName } = formContext;
      this.email = email;
      this.storeName = storeName;
    }
    if (inviteDetails?.valid) {
      this.email = inviteDetails.email;
    }
    if (bdSignupCodeInfo?.valid && salesforceLeadInfo?.valid) {
      this.email = salesforceLeadInfo.email;
      this.storeName = salesforceLeadInfo.company;
    }
  }

  @computed
  get showReferral(): boolean {
    const { partnerApp } = this.props;
    return !!partnerApp;
  }

  onEmail = ({ text }: OnTextChangeEvent) => {
    this.email = text;
  };

  onPassword = (text: string) => {
    this.password = text;
  };

  onStoreName = ({ text }: OnTextChangeEvent) => {
    this.storeName = text;
  };

  onAlreadySelling = (checked: boolean) => {
    this.alreadySelling = checked;
  };

  onexistingStoreUrl = ({ text }: OnTextChangeEvent) => {
    this.existingStoreUrl = text;
  };

  @action
  onCaptcha = ({ text, captchaToken }: OnCaptchaChangeEvent) => {
    this.captcha = text;
    this.captchaToken = captchaToken;
  };

  @action
  onCaptchaRefresh = () => {
    this.captcha = null;
    this.captchaToken = null;
  };

  @action
  onCreateClicked = async () => {
    const { email, storeName, password, existingStoreUrl } = this;
    const routeStore = RouteStore.instance();
    const navigationStore = NavigationStore.instance();

    if (!this.canCreate) {
      this.isLoading = true;
      return;
    }

    if (storeName == null || password == null || email == null) {
      return;
    }

    this.isLoading = true;

    const {
      paypalMerchantId,
      showCaptcha,
      bdSignupCode,
      salesforceLeadId,
      isExpressFlow,
      isMerchantPlusFlow,
      referralId,
    } = this.props;

    let source: MerchantSignupSourceType = "SIGNUP_V4";
    if (isMerchantPlusFlow) {
      source = "SIGNUP_MERCHANT_PLUS";
    } else if (isExpressFlow) {
      source = "SIGNUP_EXPRESS";
    }

    let input: MerchantSignupInput = {
      storeName,
      password,
      existingStoreUrl,
      emailAddress: email,
      ...(source && { source }),
      ...(bdSignupCode && { bdSignupCode }),
      ...(referralId && { referralId }),
      ...(paypalMerchantId && { paypalMerchantId }),
      ...(salesforceLeadId && { salesforceLeadId }),
      ...(routeStore.queryParams.invite && {
        invite: routeStore.queryParams.invite,
      }),
      ...(routeStore.queryParams.ivt && {
        merchantInvitationCode: routeStore.queryParams.ivt,
      }),
      ...(routeStore.queryParams.gclid && {
        googleClickId: routeStore.queryParams.gclid,
      }),
      ...(routeStore.queryParams.utm_source && {
        utmSource: routeStore.queryParams.utm_source,
      }),
      ...(routeStore.queryParams.utm_campaign && {
        utmCampaign: routeStore.queryParams.utm_campaign,
      }),
      ...(routeStore.queryParams.gads_group_id && {
        googleAdsGroupId: routeStore.queryParams.gads_group_id,
      }),
      ...(routeStore.queryParams.utm_content && {
        utmContent: routeStore.queryParams.utm_content,
      }),
      ...(routeStore.queryParams.utm_term && {
        utmTerm: routeStore.queryParams.utm_term,
      }),
      ...(routeStore.queryParams.landing_source && {
        landingSource: routeStore.queryParams.landing_source,
      }),
      ...(routeStore.queryParams.landing_source_subpage && {
        landingSourceSubpage: routeStore.queryParams.landing_source_subpage,
      }),
      ...(routeStore.queryParams.cm_cat && {
        salesforceCmCat: routeStore.queryParams.cm_cat,
      }),
    };

    const captcha = this.captcha;
    const captchaToken = this.captchaToken;
    if (showCaptcha && captcha != null && captchaToken != null) {
      input = {
        ...input,
        captchaToken,
        captchaCode: captcha.toUpperCase(),
      };
    }

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();

    try {
      const resp = await client.mutate<
        MerchantSignupResponseType,
        AuthenticationMutationsMerchantSignupArgs
      >({
        mutation: MERCHANT_SIGNUP_MUTATION,
        variables: { input },
      });

      const signupResponse = resp?.data?.authentication?.merchantSignup;

      const fallbackErrorMessage =
        i`Sorry, there was an error signing ` +
        i`up. Please try again or contact merchant support.`;

      if (!signupResponse) {
        toastStore.error(fallbackErrorMessage);
        throw resp;
      }

      if (signupResponse.shouldRedirectCnMerchant) {
        const modalText =
          i`Dear Chinese merchant, ` +
          i`please head to the Chinese signup flow to obtain a better experience.`;
        const confirmModal = new ConfirmationModal(modalText);
        confirmModal
          .setCancel(i`Cancel`)
          .setAction(i`Go to Chinese flow`, () => {
            navigationStore.navigate("/signup-v3");
          })
          .render();
        throw resp;
      } else if (!signupResponse.ok) {
        toastStore.error(signupResponse.message || fallbackErrorMessage);
        throw resp;
      } else {
        if ((window as any).fbq) {
          (window as any).fbq("trackCustom", "NextButtonClick");
        }
        navigationStore.navigate("/onboarding-v4/contact-info");
      }
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
        this.refreshEmitter.emit("refreshCaptcha");
      });
    }
  };

  @computed
  get canCreate(): boolean {
    const { showCaptcha } = this.props;

    return (
      this.emailIsValid &&
      this.passwordIsValid &&
      this.storeNameIsValid &&
      (!showCaptcha ||
        (showCaptcha && !!this.captcha && !!this.captchaToken)) &&
      (!this.alreadySelling || this.existingStoreUrlIsValid)
    );
  }

  @computed
  get storeNameValidators(): TextInputProps["validators"] {
    return [new StoreNameValidator()];
  }

  @computed
  get noWishEmails(): NoWishEmailsValidator {
    return new NoWishEmailsValidator();
  }

  @computed
  get urlValidator(): UrlValidator {
    return new UrlValidator();
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 25px",
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
      field: {
        marginBottom: 25,
        ":last-child": {
          marginBottom: 10,
        },
      },
      bottomPromptContainer: {
        padding: "25px 0px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      },
      loginHere: {
        marginLeft: 5,
      },
      prompt: {
        color: palettes.textColors.Ink,
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 10,
      },
      chinaFlag: {
        height: 12,
        marginRight: 5,
        borderRadius: 2,
      },
    });
  }

  @computed
  get showInvitationBanner(): boolean {
    const { inviteDetails, bdSignupCodeInfo } = this.props;
    return !!inviteDetails?.valid || !!bdSignupCodeInfo?.valid;
  }

  @computed
  get bannerLogoSource(): string | null | undefined {
    const { partnerApp } = this.props;
    return partnerApp?.logoSource;
  }

  @computed
  get bannerTitle(): string | null | undefined {
    const { partnerApp, inviteDetails, bdSignupCodeInfo } = this.props;
    if (inviteDetails?.valid || bdSignupCodeInfo?.valid) {
      return i`Limited-time offer!`;
    }
    return partnerApp && i`${partnerApp.name} Bonus`;
  }

  @computed
  get bannerText(): string | null | undefined {
    const { paypalMerchantId, partnerApp, inviteDetails, bdSignupCodeInfo } =
      this.props;
    const { discountedRevShare, durationDays } = PromotionStore.instance();

    if (paypalMerchantId) {
      return (
        i`Your revenue share will only be ${discountedRevShare}% for the ` +
        i`first ${durationDays} days if you sign up with this partner. `
      );
    }
    if (inviteDetails?.valid) {
      const {
        promotionRevShare,
        promotionPeriodInDays,
        useMarketingTransactionBonus,
      } = inviteDetails;
      if (
        promotionRevShare !== null &&
        promotionRevShare !== undefined &&
        promotionRevShare >= 0 &&
        promotionPeriodInDays
      ) {
        if (useMarketingTransactionBonus) {
          return i`Your store will get a ${10}% bonus on every order in the first ${90} days.`;
        }
        return i`Your store's revenue share will be only ${promotionRevShare}% for the first ${promotionPeriodInDays} days.`;
      }
    }
    if (bdSignupCodeInfo?.valid) {
      if (bdSignupCodeInfo.useMarketingTransactionBonus) {
        // we might want to add decider key here. since if not, we will fall back to use 5% rev share here.
        return i`Your store will get a ${10}% bonus on every order in the first ${90} days.`;
      }
      return i`Your store's revenue share will be only ${5}% for the first ${90} days.`;
    }
    return partnerApp?.promoProgram?.bannerText;
  }

  render() {
    const { showCaptcha, className, isExpressFlow, showTOS } = this.props;
    const { isIE } = AppStore.instance();
    // timestamp 1577836800000 is equal to January 1st, 2020 in ms
    const fullyDeprecated = Date.now() > 1577836800000;
    const { partnerApp } = this.props;

    const defaultButtonText = isExpressFlow ? i`Continue` : i`Create my store`;
    const loadingButtonText = isExpressFlow
      ? i`Continue`
      : i`Creating your account`;

    const experimentStore = ExperimentStore.instance();
    const showExistingSellerQuestions =
      experimentStore.bucketForUser("signup_ask_existing_seller_questions") ==
      "show";

    if (isIE && fullyDeprecated) {
      return (
        <Card style={{ maxWidth: 380, marginTop: 20 }}>
          <IeDeprecationBanner fullyDeprecated={fullyDeprecated} />
        </Card>
      );
    }
    return (
      <Card className={css(className)}>
        {(this.showReferral || this.showInvitationBanner) && (
          <PromotionCardBanner
            logoSource={this.bannerLogoSource}
            title={this.bannerTitle}
            subtitle={this.bannerText}
            defaultIllustration="preorderOnboardingLogo"
            logoBackground={this.showReferral ? colors.white : "inherit"}
          />
        )}
        <div className={css(this.styles.root)}>
          {this.showReferral ? (
            <Text weight="bold" className={css(this.styles.title)}>
              Sell on Wish today using {partnerApp && partnerApp.name}
            </Text>
          ) : (
            <Text weight="bold" className={css(this.styles.title)}>
              Create your free store today
            </Text>
          )}
          <div className={css(this.styles.content)}>
            <Field
              className={css(this.styles.field)}
              title={i`Your store name`}
            >
              <TextInput
                placeholder={i`Create a name for your store`}
                focusOnMount
                onChange={this.onStoreName}
                disabled={this.isLoading}
                height={FieldHeight}
                validators={this.storeNameValidators}
                onValidityChanged={(isValid) =>
                  (this.storeNameIsValid = isValid)
                }
                debugValue={faker.company.companyName()}
                value={this.storeName}
              />
            </Field>
            <Field className={css(this.styles.field)} title={i`Email address`}>
              <EmailInput
                placeholder={i`Enter your email address`}
                onChange={this.onEmail}
                disabled={this.isLoading}
                height={FieldHeight}
                onValidityChanged={(isValid) => (this.emailIsValid = isValid)}
                validators={[this.noWishEmails]}
                debugValue={faker.internet.email()}
                value={this.email}
              />
            </Field>
            <PasswordField
              type="NEW"
              className={css(this.styles.field)}
              placeholder={i`Create a password`}
              password={this.password}
              disabled={this.isLoading}
              onPasswordChange={this.onPassword}
              height={FieldHeight}
              onValidityChanged={(isValid) => {
                this.passwordIsValid = isValid;
              }}
              debugValue={faker.internet.password()}
            />
            {showExistingSellerQuestions && (
              <CheckboxField
                onChange={this.onAlreadySelling}
                checked={this.alreadySelling}
                className={css(this.styles.field)}
              >
                <Text>I am already selling online</Text>
              </CheckboxField>
            )}
            {this.alreadySelling && (
              <Field className={css(this.styles.field)} title={i`Store URL`}>
                <TextInput
                  placeholder={i`The URL of your existing online store`}
                  focusOnMount
                  onChange={this.onexistingStoreUrl}
                  disabled={this.isLoading}
                  height={FieldHeight}
                  validators={[this.urlValidator]}
                  onValidityChanged={(isValid) =>
                    (this.existingStoreUrlIsValid = isValid)
                  }
                  debugValue={faker.internet.url()}
                  value={this.existingStoreUrl}
                />
              </Field>
            )}

            {showCaptcha && (
              <CaptchaInput
                className={css(this.styles.field)}
                onCaptcha={this.onCaptcha}
                disabled={this.isLoading}
                onRefresh={this.onCaptchaRefresh}
                text={this.captcha}
                height={FieldHeight}
                refreshEmitter={this.refreshEmitter}
              />
            )}
            {showTOS && <SignupTOSText buttonText={defaultButtonText} />}
            <PrimaryButton
              onClick={this.onCreateClicked}
              isDisabled={!this.canCreate}
              isLoading={this.isLoading}
            >
              {this.isLoading ? loadingButtonText : defaultButtonText}
            </PrimaryButton>
          </div>
          <div className={css(this.styles.bottomPromptContainer)}>
            <div className={css(this.styles.prompt)}>
              <Text weight="medium">Already have an account?</Text>
              <Link className={css(this.styles.loginHere)} href="/login">
                <Text weight="medium">Login here</Text>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
export default SignupBasicInfo;
