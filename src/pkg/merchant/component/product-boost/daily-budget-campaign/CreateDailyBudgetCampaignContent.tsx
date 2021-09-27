import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { PageGuide } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { weightMedium } from "@toolkit/fonts";
import { ValidationResponse } from "@toolkit/validators";

/* Merchant Components */
import BudgetBreakDownTable from "@merchant/component/product-boost/BudgetBreakDownTable";
import EligibleProducts from "@merchant/component/product-boost/edit-campaign/EligibleProducts";
import Header from "@merchant/component/product-boost/ProductBoostHeader";
import PromotedProductsTable from "@merchant/component/product-boost/daily-budget-campaign/PromotedProductsTable";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import {
  useProductBoostMerchantInfo,
  useProductBoostProperty,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

/* Toolkit */
import { useDeviceStore } from "@merchant/stores/DeviceStore";
import { useLogger } from "@toolkit/logger";
import DailyBudgetCampaignValidator from "@toolkit/product-boost/validators/DailyBudgetCampaignValidator";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MaxSpendingBreakdown } from "@merchant/model/product-boost/Campaign";
import {
  MarketingServiceMutationsUpsertProductPromotionsArgs,
  UpsertProductPromotions,
} from "@schema/types";

const CREATE_PRODUCT_PROMOTION_MUTATION = gql`
  mutation CreateDailyBudgetCampaignContent_CreateProductPromotion(
    $input: ProductPromotionsInput!
  ) {
    marketing {
      upsertProductPromotions(input: $input) {
        ok
        message
      }
    }
  }
`;

type CreateProductPromotionsType = Pick<
  UpsertProductPromotions,
  "ok" | "message"
>;
type CreateProductPromotionsResponseType = {
  readonly marketing: {
    readonly upsertProductPromotions: CreateProductPromotionsType;
  };
};

type CreateDailyBudgetCampaignContentProps = BaseProps & {
  readonly maxAllowedSpending: number;
  readonly maxSpendingBreakdown: MaxSpendingBreakdown;
  readonly isPayable: boolean;
};

const CreateDailyBudgetCampaignContent = (
  props: CreateDailyBudgetCampaignContentProps
) => {
  const [createProductPromotions] = useMutation<
    CreateProductPromotionsResponseType,
    MarketingServiceMutationsUpsertProductPromotionsArgs
  >(CREATE_PRODUCT_PROMOTION_MUTATION);

  const styles = useStyleSheet();
  const {
    maxAllowedSpending,
    maxSpendingBreakdown,
    isPayable,
    className,
  } = props;
  const currencyCode = maxSpendingBreakdown.currency;
  const toastStore = useToastStore();
  const { isSmallScreen } = useDeviceStore();
  const navigationStore = useNavigationStore();
  const merchantInfo = useProductBoostMerchantInfo();
  const allowMaxboost =
    merchantInfo?.marketing.currentMerchant.allowMaxboost || false;
  const minBudget =
    merchantInfo?.marketing.currentMerchant.dailyMinBudget.amount || 1.5;

  const logger = useLogger("PRODUCT_BOOST_CREATE_DAILY_BUDGET_CAMPAIGN_CLICK");
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();

  const campaignProperty = useProductBoostProperty();
  const dailyBudgetCampaignLimit =
    campaignProperty?.campaignProperty.dailyBudgetCampaignLimit || 5;
  const campaignLockDays =
    campaignProperty?.campaignProperty.campaignLockDays || 1;

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [productsDailyBudgetMap, setProductsDailyBudgetMap] = useState<
    Map<string, string>
  >(new Map());
  const [products, setProducts] = useState<ReadonlyArray<Product>>([]);
  const [intenseBoostMap, setIntenseBoostMap] = useState<Map<string, boolean>>(
    new Map()
  );

  const headerBody =
    i`Promote products to boost their impressions in the Wish app, ` +
    i`and strategically attract prospective customers who may make purchases.`;
  const statsColumns = [
    {
      columnTitle: i`Your maximum budget available`,
      columnStats: formatCurrency(maxAllowedSpending, currencyCode),
    },
  ];

  const validateDailyBudgetCampaign = async (): Promise<ValidationResponse> => {
    const validator = new DailyBudgetCampaignValidator({
      minBudget,
      maxAllowedSpending,
      currencyCode,
      dailyBudgetCampaignLimit,
      products,
      budgets: productsDailyBudgetMap,
    });
    return await validator.validate();
  };

  const onPromoteProducts = async () => {
    setIsValidating(true);
    const error = await validateDailyBudgetCampaign();
    setIsValidating(false);
    if (error) {
      toastStore.error(error);
      return;
    }

    setIsLoading(true);
    const startDate = moment()
      .add(campaignLockDays + 1, "days")
      .toDate()
      .toISOString()
      .slice(0, 10);
    new ConfirmationModal(() => {
      return (
        <div className={css(styles.confirmationModalContent)}>
          <p>
            Almost there! Your promotion is scheduled to start on {startDate}.
            If you would like to make any changes during the promotion period,
            you can visit Promoted Products.
          </p>
          <p>
            Please confirm that you'd like to promote all selected products.
          </p>
        </div>
      );
    })
      .setHeader({ title: i`Confirm Promoting Your Products` })
      .setAction(i`Confirm`, async () => {
        const productIds = products.map((p) => p.id);
        logger.info({
          promoted_product_ids: productIds.join(","),
        });

        const productBudgetInfo = productIds.map((pid) => {
          const budgetStr = productsDailyBudgetMap.get(pid);
          // budgetStr shouldn't be undefined since we already validate
          const budget = budgetStr ? parseFloat(budgetStr) : 0;
          const intenseBoost = intenseBoostMap.get(pid);
          return {
            productId: pid,
            budget: {
              amount: budget,
              currencyCode,
            },
            intenseBoost,
          };
        });

        try {
          const result = await createProductPromotions({
            variables: { input: { productBudgetInfo } },
          });
          const ok = result.data?.marketing.upsertProductPromotions.ok;
          if (!ok) {
            const message =
              result.data?.marketing.upsertProductPromotions.message;
            toastStore.negative(message || i`Something went wrong`);
            return;
          }

          toastStore.positive(i`Success!`);
          await navigationStore.navigate(
            "/product-boost/manage-daily-budget-campaign"
          );
        } catch (e) {
          toastStore.error(e.msg || i`Something went wrong.`);
        }
      })
      .setFooterStyle({
        justifyContent: "center",
      })
      .render();
    setIsLoading(false);
  };

  return (
    <div className={css(className)}>
      <Header
        title={i`Promote Products`}
        body={headerBody}
        illustration="productBoostPhone"
        statsColumns={statsColumns}
        paddingX={pageX}
      />
      <PageGuide mode="page-with-table" className={css(className)}>
        <div className={css(styles.text, styles.topMargin)}>
          <span>Select products you'd like to promote.</span>
        </div>

        <EligibleProducts
          allowMaxboost={allowMaxboost}
          dailyBudgetEnabled
          selectedProducts={products}
          setSelectedProducts={setProducts}
        />

        <div className={css(styles.text, styles.topMargin)}>
          <span>The following products are selected to promote.</span>
        </div>

        <div className={css(styles.topMargin)}>
          <PromotedProductsTable
            currencyCode={currencyCode}
            products={products}
            setProducts={setProducts}
            productsDailyBudgetMap={productsDailyBudgetMap}
            setProductsDailyBudgetMap={setProductsDailyBudgetMap}
            intenseBoostMap={intenseBoostMap}
            setIntenseBoostMap={setIntenseBoostMap}
          />
        </div>

        <div className={css(styles.topMargin, styles.budgetBreakDownTable)}>
          <BudgetBreakDownTable
            dailyBudgetEnabled
            maxAllowedSpending={maxAllowedSpending}
            maxSpendingBreakdown={maxSpendingBreakdown}
            isPayable={isPayable}
            expended={isSmallScreen}
          />
        </div>

        <div className={css(styles.stickyBottom)} style={{ border: "none" }}>
          <div className={css(styles.buttons)}>
            <SecondaryButton
              onClick={() => {
                setProducts([]);
                setProductsDailyBudgetMap(new Map());
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              isLoading={isLoading || isValidating}
              isDisabled={products.length === 0}
              onClick={onPromoteProducts}
            >
              Promote Products
            </PrimaryButton>
          </div>
        </div>
      </PageGuide>
    </div>
  );
};

const useStyleSheet = () => {
  const { textBlack, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: textBlack,
          fontSize: 16,
          fontWeight: weightMedium,
        },
        topMargin: {
          marginTop: 20,
        },
        stickyBottom: {
          position: "sticky",
          bottom: 40,
          backgroundColor: textWhite,
        },
        buttons: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
        },
        budgetBreakDownTable: {
          display: "block",
          width: "100%",
        },
        confirmationModalContent: {
          fontSize: 16,
          fontWeight: weightMedium,
          lineHeight: 1.5,
          textAlign: "center",
          padding: "40px 0px",
        },
      }),
    [textBlack, textWhite]
  );
};

export default observer(CreateDailyBudgetCampaignContent);
