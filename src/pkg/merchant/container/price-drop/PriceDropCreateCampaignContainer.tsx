import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { Accordion, Text } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import PriceDropCreateCampaignBasicsSection from "@merchant/component/products/price-drop/PriceDropCreateCampaignBasicsSection";
import PriceDropCreateCampaignDropPriceSection from "@merchant/component/products/price-drop/PriceDropCreateCampaignDropPriceSection";
import PriceDropCreateCampaignProductsSection from "@merchant/component/products/price-drop/PriceDropCreateCampaignProductsSection";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Merchant Store */
import { useUserStore } from "@merchant/stores/UserStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { useLogger } from "@toolkit/logger";
import { PriceDropConstants } from "@toolkit/price-drop/constants";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";
import { EligibleProduct } from "@merchant/api/price-drop";

type Section = "basics" | "products" | "priceDropPercentage";

const SectionNames: { readonly [T in Section]: string } = {
  basics: i`Campaign Basics`,
  products: i`Select a Product`,
  priceDropPercentage: i`Price Drop Percentage`,
};

const Sections: ReadonlyArray<Section> = [
  "basics",
  "products",
  "priceDropPercentage",
];

const PriceDropCreateCampaignContainer = () => {
  const styles = useStylesheet();
  const userStore = useUserStore();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { pageGuideX: pageX } = useDimenStore();

  const priceDropLogger = useLogger("PRICE_DROP_UI");
  useEffect(() => {
    priceDropLogger.info({
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action:
        PriceDropLoggingActions.CREATE_PRICE_DROP_CAMPAIGN_PAGE_IMPRESSION,
    });
  }, [userStore, priceDropLogger]);

  // parameters used to save price drop campaign
  const defaultStartDate = moment()
    .tz("America/Los_Angeles")
    .add(PriceDropConstants.CREATE_CAMPAIGN_DELAY_DAYS, "days");
  const defaultEndDate = defaultStartDate
    .clone()
    .add(
      PriceDropConstants.CREATE_BY_MERCHANT_IMPRESSION_BOOSTER_DURATION,
      "days"
    );
  const [startDate, setStartDate] = useState<Date>(defaultStartDate.toDate());
  const [endDate, setEndDate] = useState<Date>(defaultEndDate.toDate());
  const [autoRenew, setAutoRenew] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<
    EligibleProduct | null | undefined
  >(null);
  const defaultDropPercentage = PriceDropConstants.DEFAULT_DROP_PERCENTAGE;
  const [dropPercentage, setDropPercentage] = useState(defaultDropPercentage);
  const [hiddenSections, setHiddenSections] = useState<Set<Section>>(new Set());

  const onProductSelect = (product: EligibleProduct | null | undefined) => {
    setSelectedProduct(product);
  };

  const cancelCampaign = () => {
    return new ConfirmationModal(i`Are you sure you want to cancel?`)
      .setHeader({ title: i`Confirmation` })
      .setCancel(i`No`)
      .setAction(i`Yes, I want to cancel this campaign`, () => {
        navigationStore.navigate("/marketplace/price-drop/ongoing");
      })
      .render();
  };

  const sectionContent: {
    readonly [T in Section]: () => JSX.Element;
  } = useMemo(
    () => ({
      basics: () => (
        <PriceDropCreateCampaignBasicsSection
          autoRenew={autoRenew}
          checkAutoRenew={(checked: boolean) => {
            priceDropLogger.info({
              merchant_id: userStore.loggedInMerchantUser.merchant_id,
              action: checked
                ? PriceDropLoggingActions.TOGGLE_ON_AUTO_RENEW_FROM_CREATION_PAGE
                : PriceDropLoggingActions.TOGGLE_OFF_AUTO_RENEW_FROM_CREATION_PAGE,
            });
            setAutoRenew(checked);
          }}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(date: Date) => {
            setStartDate(date);
            const newEndDate = moment(date)
              .add(
                PriceDropConstants.CREATE_BY_MERCHANT_IMPRESSION_BOOSTER_DURATION,
                "days"
              )
              .toDate();
            setEndDate(newEndDate);
          }}
        />
      ),
      products: () => (
        <PriceDropCreateCampaignProductsSection
          selectedProduct={selectedProduct}
          onProductSelect={onProductSelect}
          dropPercentage={dropPercentage}
        />
      ),
      priceDropPercentage: () => (
        <PriceDropCreateCampaignDropPriceSection
          onDropPrice={(dropPercentage) => {
            setDropPercentage(dropPercentage);
          }}
          selectedProduct={selectedProduct}
          dropPercentage={dropPercentage}
        />
      ),
    }),
    [
      autoRenew,
      dropPercentage,
      endDate,
      priceDropLogger,
      selectedProduct,
      startDate,
      userStore.loggedInMerchantUser.merchant_id,
    ]
  );

  return (
    <div>
      <WelcomeHeader
        title={i`Create a Price Drop campaign`}
        body={() => (
          <div className={css(styles.welcomeHeaderText)}>
            <span>Gain impressions and boost your GMV with Price Drop.</span>
            <Link
              href={zendeskURL("360041691693")}
              openInNewTab
              className={css(styles.link)}
            >
              Learn more
            </Link>
          </div>
        )}
        illustration="priceDropCampaign"
        paddingX={pageX}
      />
      <div
        style={{
          paddingRight: pageX,
          paddingLeft: pageX,
          paddingBottom: 100,
          paddingTop: 25,
        }}
      >
        {Sections.map((section) => {
          return (
            <Card showOverflow style={{ border: "none" }} key={section}>
              <Accordion
                header={() => (
                  <Text weight="semibold" className={css(styles.sectionHeader)}>
                    {SectionNames[section]}
                  </Text>
                )}
                isOpen={!hiddenSections.has(section)}
                onOpenToggled={(isOpen) => {
                  const newHiddenSections = new Set(hiddenSections);
                  if (isOpen) {
                    newHiddenSections.delete(section);
                  } else {
                    newHiddenSections.add(section);
                  }
                  setHiddenSections(newHiddenSections);
                }}
                backgroundColor={palettes.greyScaleColors.LighterGrey}
              >
                <div className={css(styles.sectionContent)}>
                  {sectionContent[section]()}
                </div>
              </Accordion>
            </Card>
          );
        })}
        <Card style={{ border: "none " }}>
          <div className={css(styles.buttons)}>
            <SecondaryButton
              type="default"
              text={i`Cancel`}
              onClick={cancelCampaign}
            />
            <PrimaryButton
              onClick={async () => {
                if (!selectedProduct) {
                  toastStore.error(i`Please select a product to drop price.`);
                  return;
                }
                priceDropLogger.info({
                  merchant_id: userStore.loggedInMerchantUser.merchant_id,
                  action:
                    PriceDropLoggingActions.CLICK_CREATE_PRICE_DROP_CAMPAIGN,
                });
                try {
                  await priceDropApi
                    .createPriceDropRecord({
                      product_id: selectedProduct.id,
                      drop_percentage: dropPercentage,
                      auto_renew: autoRenew,
                      start_date: startDate.toISOString().slice(0, 10),
                    })
                    .call();
                } catch (e) {
                  // TODO: switch to a better way later
                  let toastOption = {};
                  if (e.msg && e.msg.indexOf("ProductBoost") > -1) {
                    toastOption = {
                      link: {
                        title: i`Try ProductBoost`,
                        url: `/product-boost/v2/create`,
                      },
                    };
                  }
                  toastStore.error(e.msg, toastOption);
                  return;
                }

                toastStore.positive(
                  i`Your campaign has been submitted for review.`,
                  {
                    deferred: true,
                  }
                );
                navigationStore.navigate("/marketplace/price-drop/pending");
              }}
            >
              Create Price Drop campaign
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        welcomeHeaderText: {
          fontSize: 20,
          lineHeight: 1.4,
          color: colors.palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        link: {
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          marginLeft: 8,
        },
        sectionHeader: {
          fontSize: 16,
          color: palettes.textColors.Ink,
        },
        sectionContent: {
          padding: 24,
        },
        buttons: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
        },
      }),
    []
  );
};

export default observer(PriceDropCreateCampaignContainer);
