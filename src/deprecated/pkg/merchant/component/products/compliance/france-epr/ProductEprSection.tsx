import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, H5, Pager, H7 } from "@ContextLogic/lego";

/* Merchant Components */
import ProductEprTable from "@merchant/component/products/compliance/france-epr/ProductEprTable";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { usePathParams } from "@toolkit/url";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import {
  ProductCategoryLabelShortName,
  PickedFranceUinSchema,
  useUinDataByCategory,
  ORDERED_CATEGORIES,
  FranceEprContainerInitialData,
} from "@toolkit/products/france-epr";
import FranceEprState from "@merchant/model/products/FranceEprState";
import { FranceProductUniqueIdentificationNumberCategory } from "@schema/types";
import { useNavigationStore } from "@stores/NavigationStore";

type Props = BaseProps & {
  readonly uinData: ReadonlyArray<PickedFranceUinSchema>;
  readonly state: FranceEprState;
  readonly initialData: FranceEprContainerInitialData;
};

const ProductEprSection = (props: Props) => {
  const { className, style, uinData, state, initialData } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { currentTab } = usePathParams("/product/france-epr/:currentTab");

  const categoriesData = useUinDataByCategory(uinData);

  if (initialData.policy?.productCompliance == null) {
    return null;
  }

  const {
    policy: {
      productCompliance: {
        primaryPackingUnlinkedCount,
        secondaryPackingUnlinkedCount,
        eeeUnlinkedCount,
        batteriesUnlinkedCount,
        furnitureUnlinkedCount,
        tiresUnlinkedCount,
        paperUnlinkedCount,
        textileUnlinkedCount,
      },
    },
  } = initialData;

  const unlinkedCountData: {
    [type in FranceProductUniqueIdentificationNumberCategory]: number;
  } = {
    SECONDARY_PACKAGING: secondaryPackingUnlinkedCount || 0,
    ELECTRIC_AND_ELECTRONIC_EQUIPMENTS: eeeUnlinkedCount || 0,
    PRIMARY_PACKAGING: primaryPackingUnlinkedCount || 0,
    TEXTILE: textileUnlinkedCount || 0,
    BATTERIES: batteriesUnlinkedCount || 0,
    PAPER: paperUnlinkedCount || 0,
    TIRES: tiresUnlinkedCount || 0,
    FURNITURE: furnitureUnlinkedCount || 0,
  };

  if (categoriesData == null) {
    return null;
  }

  const renderTab = (text: string, alert: boolean) => (
    <Layout.FlexRow alignItems="stretch" justifyContent="center">
      <Layout.FlexRow alignItems="stretch" style={styles.dotContainer}>
        <H7>{text}</H7>
        {alert && <Layout.FlexRow style={styles.dot} />}
      </Layout.FlexRow>
    </Layout.FlexRow>
  );

  const renderTabs = () =>
    ORDERED_CATEGORIES.map((category) => (
      <Pager.Content
        tabKey={category}
        titleValue={() =>
          renderTab(
            ProductCategoryLabelShortName[category],
            unlinkedCountData[category] > 0
          )
        }
      >
        <ProductEprTable
          category={category}
          categoryData={categoriesData[category]}
          state={state}
          initialData={initialData}
        />
      </Pager.Content>
    ));

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H5>Affected Products</H5>
      <Card style={styles.card}>
        <Pager
          hideHeaderBorder={false}
          selectedTabKey={currentTab}
          onTabChange={async (tab: string) => {
            navigationStore.pushPath(`/product/france-epr/${tab}`);
          }}
          condenseMode
          equalSizeTabs
        >
          {renderTabs()}
        </Pager>
      </Card>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { negativeDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        rowButton: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        card: {
          marginTop: 16,
        },
        dotContainer: {
          position: "relative",
          padding: 10,
        },
        dot: {
          height: 6,
          width: 6,
          borderRadius: "50%",
          backgroundColor: negativeDark,
          position: "absolute",
          right: 3,
          top: 8,
        },
      }),
    [negativeDark]
  );
};

export default observer(ProductEprSection);
