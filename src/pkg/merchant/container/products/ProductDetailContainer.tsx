import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { SideMenu } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { H4 } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { usePathParams } from "@toolkit/url";

/* Merchant API */
import * as productApi from "@merchant/api/product";

/* Merchant Components */
import ProductDetailHeader from "@merchant/component/products/product-details/ProductDetailHeader";
import ProductImagesSection from "@merchant/component/products/product-details/ProductImagesSection";
import ProductVariationsSection from "@merchant/component/products/product-details/ProductVariationsSection";
import ProductSizeChart from "@merchant/component/products/product-details/ProductSizeChart";
import ProductBasicInfoSection from "@merchant/component/products/product-details/ProductBasicInfoSection";
import ProductOptionalInfoSection from "@merchant/component/products/product-details/ProductOptionalInfoSection";

/* Merchant Model */
import ProductEditState from "@merchant/model/products/ProductEditState";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const SectionIdImages = "images";
const SectionIdSizeChart = "sizechart";
const SectionIdVariations = "variations";
const SectionIdBasicInfo = "basic_info";
const SectionIdOptionalInfo = "optional_info";

const SideBarWidth = "15%";

const ProductDetailContainer = () => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const { productId } = usePathParams("/product-detail/:productId");

  const [imageSectionOpen, setImageSectionOpen] = useState(true);

  const [sizeChartSectionOpen, setSizeChartSectionOpen] = useState(true);

  const [variationSectionOpen, setVariationSectionOpen] = useState(true);

  const [basicInfoSectionOpen, setBasicInfoSectionOpen] = useState(true);

  const [optionalInfoSectionOpen, setOptionalInfoSectionOpen] = useState(true);

  const [editState] = useState(new ProductEditState({ productId }));

  const [productDetailResponse] = useRequest(
    productApi.getProductDetail({
      product_id: productId,
    })
  );

  useEffect(() => {
    if (editState.hasNonSizeChartUpdates && !editState.submitSuccess) {
      navigationStore.placeNavigationLock(
        i`You have not saved some of your changes`
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [
    navigationStore,
    editState.hasNonSizeChartUpdates,
    editState.submitSuccess,
  ]);

  const productDetail = productDetailResponse?.data?.product_detail;
  if (productDetail == null) {
    return <LoadingIndicator />;
  }

  const {
    name,
    description,
    parent_sku: parentSKU,
    tags,
    main_image: mainImage,
    extra_images: extraImages,
    clean_image: cleanImage,
    variations,
    size_chart: sizeChart,
    size_chart_names: sizeChartNames,
    variation_sizes: variationSizes,
    brand_id: brandId,
    brand_name: brandName,
    brand_status: brandStatus,
    upc,
    landing_page_url: landingPageUrl,
    max_quantity: maxQuantity,
    is_ltl: isLtl,
    default_warehouse_id: warehouseId,
  } = productDetail;

  const sections = [
    {
      isOpen: basicInfoSectionOpen,
      id: SectionIdBasicInfo,
      name: i`Basic Information`,
      setOpen: setBasicInfoSectionOpen,
      content: (
        <ProductBasicInfoSection
          name={name}
          description={description}
          parentSku={parentSKU}
          tags={tags}
          editState={editState}
        />
      ),
    },
    {
      isOpen: imageSectionOpen,
      id: SectionIdImages,
      name: i`Images`,
      setOpen: setImageSectionOpen,
      content: (
        <ProductImagesSection
          mainImage={mainImage}
          extraImages={extraImages}
          cleanImage={cleanImage}
          editState={editState}
        />
      ),
    },
    {
      isOpen: variationSectionOpen,
      id: SectionIdVariations,
      name: i`Variations`,
      setOpen: setVariationSectionOpen,
      content: (
        <ProductVariationsSection
          variations={variations}
          parentSKU={parentSKU}
          cid={productId}
          productName={name}
          editState={editState}
          warehouseId={warehouseId}
        />
      ),
    },
    {
      isOpen: sizeChartSectionOpen,
      id: SectionIdSizeChart,
      name: i`Size Chart`,
      setOpen: setSizeChartSectionOpen,
      content: (
        <ProductSizeChart
          sizeChart={sizeChart}
          sizeChartNames={sizeChartNames}
          variationSizes={variationSizes}
          editState={editState}
        />
      ),
    },
    {
      isOpen: optionalInfoSectionOpen,
      id: SectionIdOptionalInfo,
      name: i`Optional Information`,
      setOpen: setOptionalInfoSectionOpen,
      content: (
        <ProductOptionalInfoSection
          brandId={brandId}
          brandStatus={brandStatus}
          brandName={brandName}
          upc={upc}
          isLtl={isLtl}
          landingPageUrl={landingPageUrl}
          maxQuantity={maxQuantity}
          editState={editState}
        />
      ),
    },
  ];

  return (
    <div className={css(styles.root)}>
      <Card className={css(styles.stickyTop)}>
        <div className={css(styles.row)}>
          <H4>Edit Product</H4>
          <PrimaryButton
            onClick={async () => {
              await editState.submit();
              if (editState.submitSuccess) {
                await navigationStore.navigate(`/product-detail/${productId}`);
              }
            }}
            isDisabled={!editState.hasUpdates()}
          >
            Save Changes
          </PrimaryButton>
        </div>
        <ProductDetailHeader productId={productId} productName={name} />
      </Card>

      <SideMenu className={css(styles.sideMenu)}>
        <SideMenu.Item title={i`Size Chart`} href={`#${SectionIdSizeChart}`} />
      </SideMenu>

      <PageGuide>
        <div className={css(styles.content)}>
          {sections.map((section, index) => {
            if (
              section.id === SectionIdBasicInfo ||
              section.id === SectionIdImages ||
              section.id === SectionIdVariations ||
              section.id === SectionIdOptionalInfo
            ) {
              return null;
            }
            return (
              <ScrollableAnchor id={section.id} key={section.id}>
                <Card showOverflow style={css(styles.card)}>
                  <Accordion
                    header={() => (
                      <div className={css(styles.sectionHeader)}>
                        {section.name}
                      </div>
                    )}
                    isOpen={section.isOpen}
                    onOpenToggled={(isOpen) => {
                      section.setOpen(isOpen);
                    }}
                    backgroundColor={palettes.greyScaleColors.LighterGrey}
                  >
                    <div className={css(styles.sectionContent)}>
                      {section.content}
                    </div>
                  </Accordion>
                </Card>
              </ScrollableAnchor>
            );
          })}
        </div>
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { pageGuideX: pageX } = useDimenStore();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        content: {
          marginLeft: SideBarWidth,
          paddingTop: 200,
        },
        sideMenu: {
          position: "fixed",
          height: "100%",
          width: SideBarWidth,
          borderRight: `solid 1px ${palettes.greyScaleColors.LightGrey}`,
          backgroundColor: palettes.textColors.White,
          zIndex: 110,
        },
        sectionHeader: {
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
        },
        sectionContent: {
          padding: 24,
        },
        card: {
          border: "none",
        },
        stickyTop: {
          border: "none",
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 100,
          paddingLeft: pageX,
          paddingRight: pageX,
          marginLeft: SideBarWidth,
        },
        row: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 20,
          paddingBottom: 20,
        },
      }),
    [pageX]
  );
};

export default observer(ProductDetailContainer);
