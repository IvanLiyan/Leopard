import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import ObjectID from "bson-objectid";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { SearchBox } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes, white } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { erpPartnerNoLogo } from "@assets/illustrations";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";
import { MerchantAppListing } from "@merchant/api/merchant-apps";

/* Merchant Model */
import { PartnerState } from "@merchant/model/PartnerState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { usePromotionStore } from "@merchant/stores/PromotionStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type StoreIdErpModalContentProps = BaseProps & {
  readonly partnerState: PartnerState;
};

const StoreIdErpModalContent = observer(
  (props: StoreIdErpModalContentProps) => {
    const styles = useStyleSheet();
    const toastStore = useToastStore();
    const navigationStore = useNavigationStore();
    const { loggedInMerchantUser } = useUserStore();
    const {
      launchTimestamp,
      discountedRevShare,
      durationDays,
    } = usePromotionStore();
    const { partnerState } = props;

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

    const hasPartnerAppLogo = () => {
      const { partnerState } = props;
      if (!partnerState.referralAppListing) {
        return false;
      }
      const logoSource = partnerState.referralAppListing.logo_source;
      return Boolean(logoSource && logoSource.trim().length > 0);
    };

    const showPromotionInfo = () => {
      if (launchTimestamp == null) {
        return null;
      }
      const id = new ObjectID(loggedInMerchantUser.id);
      const promoLaunchDate = new Date(launchTimestamp * 1000);
      return id.getTimestamp() >= promoLaunchDate.getTime() / 1000;
    };

    const renderPartnerTop = () => {
      const { partnerState } = props;

      const onClickContinue = () => {
        partnerState.selectedMerchantApp = partnerState.referralAppListing;
      };

      return (
        partnerState.referralAppListing && (
          <>
            <section
              className={css(styles.prompt)}
              style={{ marginBottom: 24 }}
            >
              Continue with our {partnerState.referralAppListing.name} partner
              and you will receive {discountedRevShare}% revenue share for the
              first
              {durationDays} days.
            </section>
            <div className={css(styles.referralPartnerCard)}>
              <div className={css(styles.partnerInfoWrapper)}>
                <div className={css(styles.partnerImageContainer)}>
                  {hasPartnerAppLogo() ? (
                    <img
                      className={css(styles.partnerImage)}
                      src={
                        partnerState.referralAppListing &&
                        partnerState.referralAppListing.logo_source
                      }
                      alt={i`Logo image of trusted partner`}
                    />
                  ) : (
                    <Illustration
                      name="erpPartnerNoLogo"
                      className={css(styles.partnerImage)}
                      alt={i`Logo image of trusted partner`}
                    />
                  )}
                </div>
                <div className={css(styles.partnerName)}>
                  {partnerState.referralAppListing &&
                    partnerState.referralAppListing.name}
                </div>
              </div>
              <PrimaryButton
                className={css(styles.partnerContinueButton)}
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
              className={css(styles.prompt)}
              style={{ marginBottom: 10 }}
            >
              Or, choose another one below.
            </Text>
          </>
        )
      );
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
      <div className={css(styles.standoutOption)}>
        {selectedMerchantApp ? (
          <>
            <Text
              weight="medium"
              className={css(styles.prompt)}
              style={{ marginBottom: 10, minWidth: 300 }}
            >
              Once you have set up your account with {selectedMerchantApp.name}
              and authorized them with Wish, click confirm to finish identifying
              your store.
            </Text>
            <Link
              className={css(styles.partnerLink)}
              href={selectedMerchantApp.website}
              openInNewTab
            >
              Click here to sign up with our partner
            </Link>
            <div className={css(styles.buttonContainer)}>
              <PrimaryButton
                className={css(styles.partnerSecondaryButton)}
                onClick={async () =>
                  await onConfirmPartner(
                    selectedMerchantApp.name,
                    selectedMerchantApp.client_id
                  )
                }
              >
                Confirm
              </PrimaryButton>
              <SecondaryButton onClick={onChangePartner}>
                Change partner
              </SecondaryButton>
            </div>
          </>
        ) : (
          <>
            {showPromotionInfo() && renderPartnerTop()}
            {partnerState.isLoading && <LoadingIndicator />}
            <SearchBox
              className={css(styles.searchBox)}
              onChange={({ text }: OnTextChangeEvent) => {
                partnerState.searchFilter = text;
              }}
              disabled={partnerState.isLoading}
              placeholder={i`Search`}
            />
            <div className={css(styles.fixedHeightList)}>
              <div className={css(styles.listWrapper)}>
                {filteredPartnerMerchantApps.map(
                  ({ name, logo_source: logoSource, website }, index) => (
                    <div key={name} className={css(styles.partnerCard)}>
                      <div className={css(styles.partnerInfoWrapper)}>
                        <div className={css(styles.partnerImageContainer)}>
                          <img
                            className={css(styles.partnerImage)}
                            src={logoSource || erpPartnerNoLogo}
                            alt={i`Logo image of trusted partner`}
                          />
                        </div>
                        <div className={css(styles.partnerName)}>{name}</div>
                      </div>
                      <SecondaryButton
                        className={css(styles.partnerSelectButton)}
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
);

export default class StoreIdErpModal extends Modal {
  partnerState: PartnerState;

  constructor(partnerState: PartnerState) {
    super(() => null);
    this.setHeader({ title: i`Select an API Partner` });
    this.setWidthPercentage(0.55);
    this.partnerState = partnerState;
  }

  renderContent() {
    return <StoreIdErpModalContent partnerState={this.partnerState} />;
  }
}

const useStyleSheet = () => {
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 20,
    },
    standoutOption: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      minWidth: 300,
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
      flexGrow: 1,
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
    partnerLink: {
      marginBottom: 15,
    },
    searchBox: {
      width: "100%",
      marginBottom: 10,
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
    },
  });
};
