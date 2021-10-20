import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Components */
import {
  Card,
  PrimaryButton,
  Markdown,
  RichTextBanner,
  Text,
  Layout,
  Button,
} from "@ContextLogic/lego";
import { ConfirmationModal } from "@merchant/component/core/modal";
import { PageGuide } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import ProductDetailHeader from "@merchant/component/products/product-details/ProductDetailHeader";
import DefaultShippingSection from "@merchant/component/products/product-shipping/DefaultShippingSection";
import CustomizeShippingSection from "@merchant/component/products/product-shipping/CustomizeShippingSection";
import { Illustration } from "@merchant/component/core";

/* Types Imports */
import ProductShippingEditState, {
  InitialShippingState,
  PickedCountry,
  PickedShippingSettingsSchema,
} from "@merchant/model/products/ProductShippingEditState";
import { MerchantSchema } from "@schema/types";

import AdvancedLogisticsSection from "@merchant/component/products/product-shipping/AdvancedLogisticsSection";
import { useTheme } from "@stores/ThemeStore";
import EditShippingConfirmModalContent from "@merchant/component/products/product-shipping/EditShippingConfirmModalContent";
import { useLogger } from "@toolkit/logger";
import { zendeskURL, zendeskSectionURL } from "@toolkit/url";

const SectionIdAPlus = "aplus";
const SectionIdDefaultShipping = "defaultShipping";
const SectionIdCustomizeShipping = "customizeShipping";

const eu2019RegulationLink =
  "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32019R1020";
const rpHowToLink = zendeskURL("4402059013915");
const euProductComplianceLink = zendeskSectionURL("1260802932389");

type InitialData = {
  readonly platformConstants: {
    readonly unityCountries: ReadonlyArray<PickedCountry>;
    readonly countriesAllowWeRegionalPrice: ReadonlyArray<PickedCountry>;
  };
  readonly policy: {
    readonly productCompliance: {
      readonly productDestinationCountries: ReadonlyArray<PickedCountry>;
    };
  };
  readonly currentUser: {
    readonly gating: {
      readonly allowProductShippingPage: boolean;
      readonly allowProductShippingPageWeOnly: boolean;
    };
  };
  readonly currentMerchant: Pick<
    MerchantSchema,
    | "standardWarehouseId"
    | "primaryCurrency"
    | "isCnMerchant"
    | "isUnityEnabled"
    | "inEuComplianceScope"
    | "maxDeliveryDays"
  > & {
    readonly shippingSettings: ReadonlyArray<PickedShippingSettingsSchema>;
  };
  readonly productCatalog: {
    readonly product: InitialShippingState | null | undefined;
  };
};

type Props = {
  readonly initialData: InitialData;
};

const ProductShippingContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();

  const { productId, warehouseId } = usePathParams(
    "/product-shipping/:productId/:warehouseId",
  );

  const pageViewLogger = useLogger("PRODUCT_SHIPPING_PAGE_VIEW");
  const clickSaveLogger = useLogger("PRODUCT_SHIPPING_CLICK_SAVE");
  useEffect(() => {
    pageViewLogger.info({
      product_id: productId,
      warehouse_id: warehouseId,
    });
  }, [pageViewLogger, productId, warehouseId]);

  const [aPlusSectionOpen, setAPlusSectionOpen] = useState(true);
  const [defaultShippingSectionOpen, setDefaultShippingSectionOpen] =
    useState(true);
  const [customizeShippingSectionOpen, setCustomizeShippingSectionOpen] =
    useState(true);

  const {
    platformConstants: { unityCountries, countriesAllowWeRegionalPrice },
    policy: {
      productCompliance: { productDestinationCountries },
    },
    productCatalog: { product },
    currentUser: {
      gating: { allowProductShippingPage, allowProductShippingPageWeOnly },
    },
    currentMerchant: {
      standardWarehouseId,
      primaryCurrency,
      isCnMerchant,
      isUnityEnabled,
      inEuComplianceScope,
      maxDeliveryDays,
      shippingSettings: storeCountries,
    },
  } = initialData;

  const [editState] = useState<ProductShippingEditState>(
    new ProductShippingEditState({
      standardWarehouseId,
      warehouseId,
      primaryCurrency,
      storeCountries,
      unityCountries,
      productDestinationCountries,
      isCnMerchant,
      isUnityEnabled,
      inEuComplianceScope,
      maxDeliveryDays,
      allowProductShippingPage,
      allowProductShippingPageWeOnly,
      countriesAllowWeRegionalPrice,
      initialState: { ...product },
    }),
  );

  if (product == null) {
    return null;
  }
  const {
    unityPendingPeriod,
    showAdvancedSection,
    showCustomizeShippingSection,
  } = editState;

  const sections = [
    showAdvancedSection
      ? {
          isOpen: aPlusSectionOpen,
          id: SectionIdAPlus,
          name: i`Shipping Unification Initiative`,
          setOpen: setAPlusSectionOpen,
          content: <AdvancedLogisticsSection editState={editState} />,
        }
      : null,
    {
      isOpen: defaultShippingSectionOpen,
      id: SectionIdDefaultShipping,
      name: i`Default Shipping Price`,
      setOpen: setDefaultShippingSectionOpen,
      content: <DefaultShippingSection editState={editState} />,
    },
    showCustomizeShippingSection
      ? {
          isOpen: customizeShippingSectionOpen,
          id: SectionIdCustomizeShipping,
          name: showAdvancedSection
            ? i`Destination Countries/Regions`
            : i`Customize Shipping Options`,
          setOpen: setCustomizeShippingSectionOpen,
          content: <CustomizeShippingSection editState={editState} />,
        }
      : null,
  ];

  const renderRightCard = () => {
    return (
      <Card title={i`What should I know?`} style={css(styles.rightCard)}>
        <div className={css(styles.rightCardContent)}>
          <Markdown
            text={
              i`* After you provide the per-country shipping prices for ` +
              i`this product, Wish will analyze the first group of orders ` +
              i`received, and present you with a unified, Wish-calculated ` +
              i`First-Mile Shipping Price. `
            }
          />
          <Markdown
            text={
              i`* The finalized First-Mile Shipping Price will become ` +
              i`effective ${unityPendingPeriod} calendar days after you ` +
              i`are presented with the Wish-calculated First-Mile Shipping ` +
              i`Price for the first time. During the ${unityPendingPeriod} ` +
              i`calendar days, you can edit the First-Mile Shipping Price, ` +
              i`enable or disable shipping to all destination countries ` +
              i`included in the unification initiative, or conduct other ` +
              i`necessary preparation as needed. `
            }
          />
          <Markdown
            text={
              i`* After order fulfillment, you will receive payment for ` +
              i`shipping based on the First-Mile Shipping Price (excluding ` +
              i`revenue share) and reimbursement for WishPost Shipping, ` +
              i`which is the amount you pay to WishPost for shipping the order.`
            }
          />
          <Markdown
            openLinksInNewTab
            text={
              i`* Note that even with the new payment structure described ` +
              i`above, the final amount you receive for shipping will be ` +
              i`approximately the same as the amount you would have received ` +
              i`given your initially-set shipping price. ` +
              i`[Learn more](${zendeskURL("360054912394")}).`
            }
          />
        </div>
      </Card>
    );
  };

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <Card className={css(styles.header)}>
        <Layout.FlexRow
          className={css(styles.row)}
          justifyContent="space-between"
        >
          <Text weight="bold" className={css(styles.title)}>
            Edit International Shipping Options
          </Text>
          <Text weight="regular">
            {editState.isStandardWarehouse
              ? i` (Primary Warehouse)`
              : i` (Secondary Warehouse)`}
          </Text>
          <PrimaryButton
            onClick={async () => {
              const { showConfirmation, defaultShippingPriceForWarehouse } =
                editState;
              const result = await editState.validate();
              if (!result) {
                return;
              }
              if (showConfirmation) {
                new ConfirmationModal(() => (
                  <EditShippingConfirmModalContent editState={editState} />
                ))
                  .setHeader({ title: i`Confirm changes` })
                  .setCancel(i`Cancel`)
                  .setAction(i`Confirm`, async () => {
                    clickSaveLogger.info({
                      product_id: productId,
                      warehouse_id: warehouseId,
                      default_shipping_price: defaultShippingPriceForWarehouse,
                    });
                    await editState.submit();
                  })
                  .render();
              } else {
                await editState.submit();
              }
            }}
          >
            Save Changes
          </PrimaryButton>
        </Layout.FlexRow>
        <ProductDetailHeader
          productId={productId}
          productName={product.name}
          isPromoted={product.isPromoted}
        />
      </Card>
      <PageGuide mode="page-with-table">
        <Layout.FlexColumn>
          {editState.showEUComplianceBanners &&
            (editState.isAfterEUComplianceDate ? (
              <RichTextBanner
                sentiment="warning"
                title={i`EU Product Impressions Blocked`}
                description={() => {
                  return editState.showUnityEUComplianceBanners ? (
                    <Markdown
                      text={
                        i`As a Responsible Person has not been linked to this product, ` +
                        i`impressions and sales in all EU countries (including the EU countries ` +
                        i`listed below that are supported by Wish's unification initiative) ` +
                        i`have been blocked. To resume selling into the EU, ` +
                        i`link a Responsible Person to this product now. ` +
                        i`[Learn More](${rpHowToLink})`
                      }
                      openLinksInNewTab
                    />
                  ) : (
                    <>
                      <Markdown
                        text={
                          i`Your product impressions, and in effect, sales in the EU for CE-marked or ` +
                          i`relevant products will be blocked until a Responsible Person is added. ` +
                          i`[Learn More](${euProductComplianceLink})`
                        }
                        openLinksInNewTab
                      />
                      <Markdown
                        text={
                          i`If you do not ship products into the European Union (EU) and/or ` +
                          i`Northern Ireland, you can dismiss this tooltip.`
                        }
                        className={css(styles.secondTextContainer)}
                      />
                    </>
                  );
                }}
                contentAlignment="left"
                className={css(styles.euComplianceBanner)}
                buttonText={i`Add Responsible Persons`}
                onClick={() => {
                  window.open("/product/responsible-person");
                }}
              />
            ) : (
              <RichTextBanner
                sentiment="info"
                title={i`EU Product Compliance`}
                description={() => {
                  return (
                    <>
                      <Markdown
                        text={
                          i`Starting July 16, 2021, a new regulation called ` +
                          i`[Market Surveillance Regulation (EU) 2019/1020](${eu2019RegulationLink}) ` +
                          i`will take effect. This new regulation requires the presence ` +
                          i`of a Responsible Person located in the European Union (EU) as ` +
                          i`the point of contact for each CE-marked or relevant product ` +
                          i`with one or multiple EU destinations enabled. ` +
                          i`[Learn More](${euProductComplianceLink}) `
                        }
                        openLinksInNewTab
                      />
                      {editState.showUnityEUComplianceBanners && (
                        <Markdown
                          text={
                            i`Wish has identified this product to be likely subject to the upcoming ` +
                            i`EU regulations. Since Wish's unification initiative supports shipping ` +
                            i`to several EU countries, it is vital that you timely provide ` +
                            i`a Responsible Person for this product to comply with the new regulation. ` +
                            i`Click "Continue" to start.`
                          }
                          className={css(styles.secondTextContainer)}
                        />
                      )}
                    </>
                  );
                }}
                contentAlignment="left"
                className={css(styles.euComplianceBanner)}
                buttonText={i`Continue`}
                onClick={() => {
                  window.open("/product/responsible-person");
                }}
              />
            ))}
          {sections.map((section, index) => {
            if (!section) {
              return null;
            }
            return (
              <ScrollableAnchor id={section.id} key={section.id}>
                <div className={css(styles.section)}>
                  <Card showOverflow style={css(styles.card)}>
                    <Text weight="medium" className={css(styles.sectionHeader)}>
                      {section.name}
                    </Text>
                    <div className={css(styles.sectionContent)}>
                      {section.content}
                    </div>
                  </Card>

                  {section.id === SectionIdAPlus && renderRightCard()}
                </div>
              </ScrollableAnchor>
            );
          })}
          <Card className={css(styles.bottomCard)}>
            <Layout.FlexRow justifyContent="space-between">
              <Layout.FlexRow>
                <Illustration
                  name="palaceBlueBulb"
                  alt="palaceBlueBulb"
                  className={css(styles.illustration)}
                />
                <Text>
                  Looking to ship to more countries/regions from this warehouse?
                  Please enable these countries/regions in your account level
                  Shipping Settings first.
                </Text>
              </Layout.FlexRow>
              <Button href="/shipping-settings" openInNewTab>
                Edit Shipping Settings
              </Button>
            </Layout.FlexRow>
          </Card>
        </Layout.FlexColumn>
      </PageGuide>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { surfaceLightest, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          position: "sticky",
          top: 0,
          padding: "40px 30px",
          zIndex: 100,
        },
        section: {
          display: "flex",
          flexDirection: "row",
          marginTop: 30,
          alignItems: "baseline",
        },
        sectionHeader: {
          fontSize: 20,
          color: palettes.textColors.Ink,
          padding: "20px 24px 0",
        },
        sectionContent: {
          padding: 24,
          backgroundColor: surfaceLightest,
        },
        card: {
          border: "none",
          width: "100%",
        },
        rightCard: {
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          marginLeft: 30,
        },
        rightCardContent: {
          padding: 10,
        },
        row: {
          paddingTop: 20,
          paddingBottom: 20,
        },
        title: {
          fontSize: 24,
          lineHeight: 1.33,
          color: textBlack,
        },
        euComplianceBanner: {
          marginTop: 40,
          padding: "6px 0px",
          fontSize: 16,
        },
        secondTextContainer: {
          marginTop: 10,
        },
        bottomCard: {
          padding: 34,
          marginTop: 30,
        },
        illustration: {
          width: 24,
          height: 24,
          marginRight: 16,
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
      }),
    [surfaceLightest, textBlack],
  );
};

export default observer(ProductShippingContainer);
