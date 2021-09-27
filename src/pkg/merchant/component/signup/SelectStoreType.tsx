import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import ObjectID from "bson-objectid";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { SearchBox } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes, white } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { erpPartnerNoLogo } from "@assets/illustrations";

/* Merchant API */
import {
  getReferralApp,
  getSignUpApps,
  MerchantAppListing,
} from "@merchant/api/merchant-apps";
import { getSignUpPSPs } from "@merchant/api/signup-psps";
import { signupPayoneer } from "@merchant/api/signup-psps";
import * as onboardingApi from "@merchant/api/onboarding";

/* Merchant Model */
import { PartnerState } from "@merchant/model/PartnerState";
import { PspDetails } from "@merchant/model/PspDetails";

/* Relative Imports */
import StoreIdErpBox from "./StoreIdErpBox";

import UserStore from "@merchant/stores/UserStore";
import ToastStore from "@merchant/stores/ToastStore";
import PromotionStore from "@merchant/stores/PromotionStore";
import NavigationStore from "@merchant/stores/NavigationStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

type SelectStoreTypeProps = BaseProps & {
  readonly partnerState: PartnerState;
  readonly pspDetails: PspDetails;
};

@observer
class SelectStoreType extends Component<SelectStoreTypeProps> {
  async componentDidMount() {
    const { partnerState, pspDetails } = this.props;
    const toastStore = ToastStore.instance();
    const { loggedInMerchantUser } = UserStore.instance();

    try {
      const response = await getSignUpApps({}).call();
      if (response && response.data) {
        partnerState.merchantApps = [...response.data];
        partnerState.isLoading = false;
      } else {
        toastStore.error(
          i`Could not load trusted partner list. Please try again later.`
        );
      }
    } catch (e) {
      toastStore.error(
        i`Could not load trusted partner list. Please try again later.`
      );
    }

    try {
      const allowedPSPDetails = await getSignUpPSPs({}).call();
      if (allowedPSPDetails && allowedPSPDetails.data) {
        pspDetails.signUpPSPs = [...allowedPSPDetails.data.allowed_psp_list];
        pspDetails.isMerchantAllowedPspSignUp =
          allowedPSPDetails.data.is_merchant_allowed;
        pspDetails.isLoading = false;
      } else {
        toastStore.error(
          i`Could not load trusted provider list. Please try again later.`
        );
      }
    } catch (e) {
      toastStore.error(
        i`Could not load trusted provider list. Please try again later.`
      );
    }

    if (loggedInMerchantUser.erp_promo_info_referral_id) {
      try {
        const response = await getReferralApp({
          referral_id: loggedInMerchantUser.erp_promo_info_referral_id,
        }).call();
        if (response && response.data) {
          partnerState.referralAppListing = response.data.partner_app;
        } else {
          toastStore.error(
            i`Could not load referral app listing. Please try again later.`
          );
        }
      } catch (e) {
        toastStore.error(
          i`Could not load referral app listing. Please try again later.`
        );
      }
    }
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        // eslint-disable-next-line local-rules/validate-root
        maxWidth: 1000,
      },
      title: {
        fontSize: 24,
        color: palettes.textColors.Ink,
        marginBottom: 30,
      },
      subTitle: {
        fontSize: 20,
        color: palettes.textColors.Ink,
        marginTop: 16,
        textAlign: "center",
      },
      picker: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        marginTop: 56,
      },
      pickerRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "center",
        "@media (max-width: 768px)": {
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
        },
      },
      pickerBox: {
        maxWidth: 384,
      },
      standoutOption: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        minWidth: 300,
        border: `solid 1px ${palettes.coreColors.DarkerWishBlue}`,
        padding: 24,
        borderRadius: 4,
        boxShadow: "0 4px 6px 0 rgba(175, 199, 209, 0.2)",
        backgroundColor: palettes.textColors.White,
        ":not(:last-child)": {
          "@media (max-width 900px)": {
            marginBottom: 10,
          },
          "@media (min-width 900px)": {
            marginBottom: 0,
          },
        },
        marginRight: 10,
        marginTop: 10,
        flexGrow: 1,
      },
      optionTitle: {
        fontSize: 24,
        color: palettes.textColors.Ink,
        marginBottom: 10,
        textAlign: "center",
        lineHeight: 1.33,
      },
      partnerContinueButton: {
        minWidth: 160,
      },
      partnerSelectButton: {
        alignSelf: "stretch",
      },
      prompt: {
        fontSize: 16,
        color: palettes.textColors.Ink,
        textAlign: "center",
      },
      standoutPrompt: {
        fontSize: 12,
        fontWeight: fonts.weightSemibold,
        color: palettes.coreColors.WishBlue,
        textAlign: "center",
      },
      partnerCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ":first-child": {
          margin: "8px",
        },
        margin: "0 8px 8px 8px",
        borderRadius: 4,
        minWidth: 200,
        padding: 12,
        backgroundColor: white,
      },
      referralPartnerCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "10px 0",
        borderRadius: 4,
        minWidth: 200,
        padding: 12,
        backgroundColor: palettes.greyScaleColors.LightGrey,
        alignSelf: "stretch",
        marginBottom: 24,
      },
      partnerInfoWrapper: {
        display: "flex",
        alignItems: "center",
      },
      partnerName: {
        fontSize: 16,
        color: palettes.textColors.Ink,
        minWidth: 50,
      },
      partnerImageContainer: {
        height: 48,
        padding: 8,
        flex: "0 0 48px",
        marginRight: 10,
        display: "flex",
        justifyContent: "center",
        backgroundColor: white,
        boxShadow:
          "0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 0 0 1px rgba(63, 63, 68, 0.05)",
        borderRadius: 4,
      },
      partnerImage: {
        alignSelf: "center",
        maxHeight: 48,
        padding: 1,
        backgroundColor: white,
      },
      fixedHeightList: {
        display: "flex",
        flexDirection: "column",
        maxHeight: 250,
        minWidth: 300,
        overflowY: "auto",
        backgroundColor: palettes.greyScaleColors.LightGrey,
        border: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        borderRadius: 4,

        alignSelf: "stretch",
      },
      listWrapper: {
        display: "flex",
        flexDirection: "column",
      },
      partnerSecondaryButton: {
        marginBottom: 10,
      },
      partnerCancelButton: {},
      partnerLink: {
        marginBottom: 15,
      },
      searchBox: {
        width: "100%",
        marginBottom: 10,
      },
      skipButton: {
        marginTop: 25,
      },
      finePrint: {
        fontSize: 14,
      },
    });
  }

  @computed
  get hasPartnerAppLogo(): boolean {
    const { partnerState } = this.props;
    if (!partnerState.referralAppListing) {
      return false;
    }
    const logoSource = partnerState.referralAppListing.logo_source;
    return Boolean(logoSource && logoSource.trim().length > 0);
  }

  @computed
  get showPromotionInfo(): boolean {
    const { loggedInMerchantUser } = UserStore.instance();
    const { launchTimestamp } = PromotionStore.instance();

    if (launchTimestamp == null) {
      return false;
    }
    const id = new ObjectID(loggedInMerchantUser.id);
    const promoLaunchDate = new Date(launchTimestamp * 1000);
    return id.getTimestamp() >= promoLaunchDate.getTime();
  }

  renderPartnerTop() {
    const { partnerState } = this.props;
    const { discountedRevShare, durationDays } = PromotionStore.instance();

    const onClickContinue = () => {
      partnerState.selectedMerchantApp = partnerState.referralAppListing;
    };

    return partnerState.referralAppListing ? (
      <>
        <section
          className={css(this.styles.prompt)}
          style={{ marginBottom: 24, marginLeft: 100, marginRight: 100 }}
        >
          <Markdown
            text={
              i`Continue with our ${partnerState.referralAppListing.name} partner and ` +
              i`you will receive ${discountedRevShare}% revenue share for the first ` +
              i`${durationDays} days.`
            }
          />
          <div className={css(this.styles.finePrint)}>
            <Markdown
              text={
                i`This regional promotion applies to merchants that are ` +
                i`located in specific countries.`
              }
            />
          </div>
        </section>
        <div className={css(this.styles.referralPartnerCard)}>
          <div className={css(this.styles.partnerInfoWrapper)}>
            <div className={css(this.styles.partnerImageContainer)}>
              {this.hasPartnerAppLogo ? (
                <img
                  className={css(this.styles.partnerImage)}
                  src={
                    partnerState.referralAppListing &&
                    partnerState.referralAppListing.logo_source
                  }
                  alt={i`Logo image of trusted partner`}
                />
              ) : (
                <Illustration
                  name="erpPartnerNoLogo"
                  className={css(this.styles.partnerImage)}
                  alt={i`Logo image of trusted partner`}
                />
              )}
            </div>
            <div className={css(this.styles.partnerName)}>
              {partnerState.referralAppListing &&
                partnerState.referralAppListing.name}
            </div>
          </div>
          <PrimaryButton
            className={css(this.styles.partnerContinueButton)}
            style={{
              padding: 10,
            }}
            onClick={onClickContinue}
          >
            Continue
          </PrimaryButton>
        </div>
        <Text
          weight="medium"
          className={css(this.styles.prompt)}
          style={{ marginBottom: 10 }}
        >
          Or, choose another one below.
        </Text>
      </>
    ) : (
      <>
        <section
          className={css(this.styles.prompt)}
          style={{ marginBottom: 10 }}
        >
          Identify your store with one of our trusted partners.
        </section>
        <section
          className={css(this.styles.standoutPrompt)}
          style={{ marginBottom: 10 }}
        >
          <Markdown
            text={
              i`Limited Time: Sign up with a trusted partner and you will receive ` +
              i`${discountedRevShare}% revenue share for the first ${durationDays} ` +
              i`days.` +
              "\n\n" +
              i`This regional promotion applies to merchants ` +
              i`that are located in specific countries.`
            }
          />
        </section>
      </>
    );
  }

  renderPartner() {
    const { partnerState } = this.props;
    const { loggedInMerchantUser } = UserStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    if (loggedInMerchantUser.is_cn_merchant) {
      return null;
    }

    const onClickPartner = (selectedMerchantApp: MerchantAppListing) => {
      partnerState.selectedMerchantApp = selectedMerchantApp;
    };

    const onChangePartner = () => {
      partnerState.selectedMerchantApp = undefined;
      partnerState.searchFilter = "";
    };

    const onConfirmPartner = async (name: string, clientId: string) => {
      try {
        const params: onboardingApi.StoreIdentificationParams = {
          id_source: 2,
          client_id: clientId,
        };
        partnerState.isLoading = true;
        await onboardingApi.setStoreIdentification(params).call();
        partnerState.isLoading = false;
        toastStore.positive(i`Congratulations! Your store is verified`, {
          deferred: true,
        });
        navigationStore.navigate("/");
      } catch (e) {
        partnerState.isLoading = false;
        toastStore.error(
          i`Sorry, we couldn't detect that you signed up with ${name}`
        );
      }
    };

    const { selectedMerchantApp } = partnerState;

    const filteredPartnerMerchantApps = partnerState.merchantApps.filter(
      ({ name }) =>
        name
          .toLowerCase()
          .includes(
            partnerState.searchFilter
              ? partnerState.searchFilter.toLowerCase()
              : ""
          )
    );

    return (
      <div className={css(this.styles.standoutOption)}>
        <Text weight="bold" className={css(this.styles.optionTitle)}>
          Partner
        </Text>
        {selectedMerchantApp ? (
          <>
            <Text
              weight="medium"
              className={css(this.styles.prompt)}
              style={{ marginBottom: 10, minWidth: 300 }}
            >
              Once you have set up your account with {selectedMerchantApp.name}
              and authorized them with Wish, click confirm to finish identifying
              your store.
            </Text>
            <Link
              className={css(this.styles.partnerLink)}
              href={selectedMerchantApp.website}
              openInNewTab
            >
              Click here to sign up with our partner
            </Link>
            <PrimaryButton
              className={css(this.styles.partnerSecondaryButton)}
              onClick={async () =>
                await onConfirmPartner(
                  selectedMerchantApp.name,
                  selectedMerchantApp.client_id
                )
              }
            >
              Confirm
            </PrimaryButton>
            <PrimaryButton
              style={{
                border: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
                color: palettes.textColors.Ink,
                backgroundColor: white,
              }}
              onClick={onChangePartner}
            >
              Change partner
            </PrimaryButton>
          </>
        ) : (
          <>
            {this.showPromotionInfo && this.renderPartnerTop()}
            {partnerState.isLoading && <LoadingIndicator />}
            <SearchBox
              className={css(this.styles.searchBox)}
              onChange={({ text }: OnTextChangeEvent) => {
                partnerState.searchFilter = text;
              }}
              disabled={partnerState.isLoading}
              placeholder={i`Search`}
            />
            <div className={css(this.styles.fixedHeightList)}>
              <div className={css(this.styles.listWrapper)}>
                {filteredPartnerMerchantApps.map(
                  ({ name, logo_source: logoSource, website }, index) => (
                    <div key={name} className={css(this.styles.partnerCard)}>
                      <div className={css(this.styles.partnerInfoWrapper)}>
                        <div className={css(this.styles.partnerImageContainer)}>
                          <img
                            className={css(this.styles.partnerImage)}
                            src={logoSource || erpPartnerNoLogo}
                            alt={i`Logo image of trusted partner`}
                          />
                        </div>
                        <div className={css(this.styles.partnerName)}>
                          {name}
                        </div>
                      </div>
                      <SecondaryButton
                        className={css(this.styles.partnerSelectButton)}
                        onClick={() =>
                          onClickPartner(filteredPartnerMerchantApps[index])
                        }
                      >
                        Select
                      </SecondaryButton>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  renderPSP() {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { loggedInMerchantUser } = UserStore.instance();
    const { discountedRevShare, durationDays } = PromotionStore.instance();
    const { pspDetails } = this.props;

    if (loggedInMerchantUser.is_cn_merchant) {
      return null;
    }

    const onClickPSP = (index: number) => {
      pspDetails.selectedsignUpPSP = pspDetails.signUpPSPs[index];
    };

    const onConfirmPSP = async (name: string, pspId: Uint8Array) => {
      try {
        pspDetails.isLoading = true;
        const signupResult = await signupPayoneer().call();
        pspDetails.isLoading = false;
        if (signupResult.data && signupResult.data.is_already_registered) {
          toastStore.positive(
            i`You have already registered with ${name}. We will redirect you to the home page shortly`
          );
          navigationStore.navigate("/");
        } else if (signupResult.data && signupResult.data.sign_up_url) {
          toastStore.positive(
            i`You will be redirected to ${name} signup website shortly`
          );
          navigationStore.navigate(signupResult.data?.sign_up_url || "/");
        }
      } catch (e) {
        pspDetails.isLoading = false;
        toastStore.error(i`Sorry, Error happened when redirecting to ${name}`);
      }
    };

    const { selectedsignUpPSP } = pspDetails;

    if (!pspDetails.isMerchantAllowedPspSignUp) {
      return null;
    }

    return (
      <div className={css(this.styles.standoutOption)}>
        <Text weight="bold" className={css(this.styles.optionTitle)}>
          Payment Provider
        </Text>
        {selectedsignUpPSP ? (
          <>
            <Text
              weight="medium"
              className={css(this.styles.prompt)}
              style={{ marginBottom: 10, minWidth: 300 }}
            >
              Click confirm to redirect you to sign up page of
              {selectedsignUpPSP.name}.
            </Text>
            <PrimaryButton
              className={css(this.styles.partnerSecondaryButton)}
              onClick={async () =>
                await onConfirmPSP(
                  selectedsignUpPSP.name,
                  selectedsignUpPSP.psp_id
                )
              }
            >
              Confirm
            </PrimaryButton>
            <PrimaryButton
              style={{
                border: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
                color: palettes.textColors.Ink,
                backgroundColor: white,
              }}
              onClick={() => (pspDetails.selectedsignUpPSP = undefined)}
            >
              Change Provider
            </PrimaryButton>
          </>
        ) : (
          <>
            <Text
              weight="medium"
              className={css(this.styles.prompt)}
              style={{ marginBottom: 10 }}
            >
              Identify your store with one of the trusted payment service
              providers.
            </Text>
            <Text
              weight="medium"
              className={css(this.styles.standoutPrompt)}
              style={{ marginBottom: 10 }}
            >
              Limited Time: Sign up with a trusted payment provider and you will
              receive {discountedRevShare}% revenue share for the first
              {durationDays} days.
            </Text>
            {pspDetails.isLoading && <LoadingIndicator />}
            <div className={css(this.styles.fixedHeightList)}>
              <div className={css(this.styles.listWrapper)}>
                {pspDetails.signUpPSPs
                  .filter(({ name }) =>
                    name
                      .toLowerCase()
                      .includes(
                        pspDetails.searchFilter
                          ? pspDetails.searchFilter.toLowerCase()
                          : ""
                      )
                  )
                  .map(({ name, logo_source: logoSource }, index) => (
                    <div key={name} className={css(this.styles.partnerCard)}>
                      <div className={css(this.styles.partnerInfoWrapper)}>
                        <div className={css(this.styles.partnerImageContainer)}>
                          <img
                            className={css(this.styles.partnerImage)}
                            src={logoSource}
                            alt={i`Logo image of trusted partner`}
                          />
                        </div>
                        <div className={css(this.styles.partnerName)}>
                          {name}
                        </div>
                      </div>
                      <SecondaryButton
                        className={css(this.styles.partnerSelectButton)}
                        onClick={() => onClickPSP(index)}
                      >
                        Select
                      </SecondaryButton>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  render() {
    const navigationStore = NavigationStore.instance();

    const onSkip = async () => {
      await onboardingApi.skipStoreIdentification({}).call();
      navigationStore.navigate("/");
    };

    const skipStep = `[${i`skip this step`}](#)`;
    const subTitle =
      i`If you are not interested, you can ${skipStep}.` +
      i` You can also connect your Wish store to a trusted API later.`;
    const { className, partnerState } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <Text weight="bold" className={css(this.styles.title)}>
          Connect a trusted API
        </Text>
        <section className={css(this.styles.subTitle)}>
          <Markdown onLinkClicked={onSkip} text={subTitle} />
        </section>
        <div className={css(this.styles.picker)}>
          <div className={css(this.styles.pickerRow)}>
            <StoreIdErpBox
              className={css(this.styles.pickerBox)}
              partnerState={partnerState}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SelectStoreType;
