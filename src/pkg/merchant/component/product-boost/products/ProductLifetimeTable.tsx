import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

/* External Libraries */
import moment from "moment-timezone";
import numeral from "numeral";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Popover } from "@merchant/component/core";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { CellInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { weightMedium } from "@toolkit/fonts";
import { CurrencyInput } from "@ContextLogic/lego";

/* Lego Utils */
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import ProductPerformanceSection from "@merchant/component/product-boost/products/ProductPerformanceSection";
import ProductPromotionPerformanceSection from "@merchant/component/product-boost/daily-budget-campaign/ProductPromotionPerformanceSection";
import { Switch } from "@ContextLogic/lego";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";
import {
  useProductBoostMerchantInfo,
  useProductBoostProperty,
} from "@merchant/stores/product-boost/ProductBoostContextStore";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { DailyBudgetCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";
import BudgetValidator from "@toolkit/product-boost/validators/BudgetValidator";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductPerformance } from "@merchant/api/product-boost";
import {
  ProductPromotionRowType,
  UpdateDailyBudgetCampaignConfirmationModalParams,
} from "@merchant/api/product-promotion";
import {
  CurrencyValue,
  MarketingServiceMutationsUpsertProductPromotionsArgs,
  ProductPromotionStatus,
  UpsertProductPromotions,
} from "@schema/types";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const UPDATE_PRODUCT_PROMOTION_MUTATION = gql`
  mutation ProductLifetimeTable_UpdateProductPromotion(
    $input: ProductPromotionsInput!
  ) {
    marketing {
      upsertProductPromotions(input: $input) {
        ok
        message
        maxAllowedSpending {
          amount
          currencyCode
        }
      }
    }
  }
`;

type UpdateProductPromotionsType = Pick<
  UpsertProductPromotions,
  "ok" | "message"
> & {
  readonly maxAllowedSpending: Pick<CurrencyValue, "amount" | "currencyCode">;
};
type UpdateProductPromotionsResponseType = {
  readonly marketing: {
    readonly upsertProductPromotions: UpdateProductPromotionsType;
  };
};

export type ProductLifetimeTableProps = BaseProps & {
  readonly data:
    | ReadonlyArray<ProductPerformance>
    | ReadonlyArray<ProductPromotionRowType>;
  readonly dailyBudgetEnabled?: boolean;
  readonly maxAllowedSpending?: number;
  readonly setMaxAllowedSpending?: (spend: number) => void;
  readonly refreshDailyBudgetCampaignsTable?: () => void;
};

const ProductLifetimeTable = (props: ProductLifetimeTableProps) => {
  const [updateProductPromotion] = useMutation<
    UpdateProductPromotionsResponseType,
    MarketingServiceMutationsUpsertProductPromotionsArgs
  >(UPDATE_PRODUCT_PROMOTION_MUTATION);

  const styles = useStylesheet();
  const {
    data,
    dailyBudgetEnabled,
    maxAllowedSpending,
    setMaxAllowedSpending,
    className,
    refreshDailyBudgetCampaignsTable,
  } = props;

  const results = useProductBoostMerchantInfo();
  const allowLocalizedCurrency =
    results?.marketing.currentMerchant.allowLocalizedCurrency || false;
  const merchantSourceCurrency =
    results?.currentMerchant.primaryCurrency || "USD";
  const minBudget =
    results?.marketing.currentMerchant.dailyMinBudget.amount || 1.5;
  const currencyCode = useMemo(() => {
    const currencyCode = merchantSourceCurrency || "USD";
    return allowLocalizedCurrency ? currencyCode : "USD";
  }, [allowLocalizedCurrency, merchantSourceCurrency]);

  const toastStore = useToastStore();
  const campaignProperty = useProductBoostProperty();
  const campaignLockDays =
    campaignProperty?.campaignProperty.campaignLockDays || 1;

  const [productBudgetMap, setProductBudgetMap] = useState<Map<string, string>>(
    new Map()
  );

  const logger = useLogger("PRODUCT_BOOST_UPDATE_DAILY_BUDGET_CAMPAIGN_CLICK");

  const budgetValidator =
    maxAllowedSpending !== undefined
      ? new BudgetValidator({
          oldBudget: 0,
          minBudget,
          maxAllowedSpending,
          currencyCode,
          isNewState: true,
        })
      : null;

  const renderConfirmationModal = (
    param: UpdateDailyBudgetCampaignConfirmationModalParams
  ) => {
    new ConfirmationModal(() => {
      return (
        <div className={css(styles.confirmationModalContent)}>
          {param.content}
          <p>It takes {campaignLockDays + 1} days to reflect the change.</p>
        </div>
      );
    })
      .setHeader({ title: i`Confirm Manage Product` })
      .setAction(i`Confirm`, async () => {
        const productBudget = {
          productId: param.product_id,
          budget: { amount: param.new_budget, currencyCode },
          intenseBoost: param.intense_boost,
        };

        try {
          logger.info({
            update_product_id: param.product_id,
            old_budget: param.old_budget,
            new_budget: param.new_budget,
            intense_boost: param.intense_boost,
          });

          const result = await updateProductPromotion({
            variables: {
              input: { productBudgetInfo: [productBudget] },
            },
          });
          const ok = result.data?.marketing.upsertProductPromotions.ok;
          if (!ok) {
            const message =
              result.data?.marketing.upsertProductPromotions.message;
            toastStore.negative(message || i`Something went wrong`);
            return;
          }
          toastStore.positive(i`Updated product successfully!`);

          const newMaxAllowedSpending =
            result.data?.marketing.upsertProductPromotions.maxAllowedSpending;
          if (
            newMaxAllowedSpending === undefined ||
            newMaxAllowedSpending?.currencyCode !== currencyCode
          ) {
            // Just to be safe, handle the case where the merchant's FE and BE
            // currencies are out of sync.
            toastStore.warning(i`The page is out of sync, please refresh`);
            return;
          }
          if (setMaxAllowedSpending) {
            setMaxAllowedSpending(newMaxAllowedSpending.amount);
          }
          if (refreshDailyBudgetCampaignsTable !== undefined) {
            refreshDailyBudgetCampaignsTable();
          }
        } catch (e) {
          toastStore.error(e.message || i`Something went wrong.`);
          return;
        }
      })
      .setFooterStyle({
        justifyContent: "center",
      })
      .render();
  };

  const [expandedRowsIndices, setExpandedRowsIndices] = useState<
    ReadonlyArray<number>
  >([]);

  const renderExpandedProduct = (
    product: ProductPerformance | ProductPromotionRowType
  ) => {
    return dailyBudgetEnabled ? (
      <ProductPromotionPerformanceSection
        productId={product.product_id}
        currencyCode={currencyCode}
      />
    ) : (
      <ProductPerformanceSection
        productId={product.product_id}
        currencyCode={currencyCode}
      />
    );
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    setExpandedRowsIndices(shouldExpand ? [index] : []);
  };

  const renderSpendOverGMV = (
    row: ProductPerformance | ProductPromotionRowType
  ) => {
    if (row.lifetime_gmv == 0) {
      return numeral(0).format("0.00%");
    }
    return numeral(row.lifetime_spend / row.lifetime_gmv).format("0.00%");
  };

  const validateBudget = async (row: ProductPromotionRowType) => {
    const newBudgetStr = productBudgetMap.get(row.product_id);
    if (
      newBudgetStr === undefined ||
      (row.daily_budget_state !== "INACTIVE" &&
        Math.abs(row.daily_max_budget - parseFloat(newBudgetStr)) < 0.01)
    ) {
      return i`Product budget doesn't change.`;
    }
    if (newBudgetStr.trim().length === 0) {
      return i`Please enter a valid product budget.`;
    }
    // shouldn't happen
    if (!budgetValidator) {
      return;
    }

    return await budgetValidator.validateText(newBudgetStr);
  };

  const updateBudget = async (row: ProductPromotionRowType) => {
    if (
      row.daily_budget_state === "INACTIVE" &&
      !productBudgetMap.get(row.product_id)
    ) {
      setProductBudgetMap((productBudgetMap) => {
        productBudgetMap.set(row.product_id, row.daily_max_budget.toFixed(2));
        return new Map<string, string>(productBudgetMap);
      });
    }
    const error = await validateBudget(row);
    if (error) {
      toastStore.error(error);
      return;
    }

    const newBudgetStr = productBudgetMap.get(row.product_id);
    const newBudget = newBudgetStr ? parseFloat(newBudgetStr) : 0;
    let content: string = "";
    if (row.daily_budget_state === "INACTIVE") {
      content = i`You are about to promote the product.`;
    } else if (newBudget > row.daily_max_budget) {
      content = i`You are about to increase the budget.`;
    } else {
      content = i`You are about to decrease the budget.`;
    }

    renderConfirmationModal({
      content,
      product_id: row.product_id,
      old_budget: row.daily_max_budget,
      new_budget: newBudget,
      intense_boost: row.intense_boost || false,
    });
  };

  const renderBudgetTextField = (row: ProductPromotionRowType) => {
    const budget = productBudgetMap.get(row.product_id);

    return (
      <CurrencyInput
        currencyCode={currencyCode}
        value={budget === undefined ? row.daily_max_budget.toFixed(2) : budget}
        placeholder={row.daily_max_budget.toFixed(2)}
        onChange={({ text }: OnTextChangeEvent) => {
          productBudgetMap.set(row.product_id, text);
          setProductBudgetMap(new Map(productBudgetMap));
        }}
        onBlur={async () => {
          if (
            budget === undefined ||
            Math.abs(row.daily_max_budget - parseFloat(budget)) < 0.01
          ) {
            return;
          }
          await updateBudget(row);
        }}
        hideCheckmarkWhenValid
      />
    );
  };

  const renderBudgetTextFieldWithBudgetUpdateDate = (
    row: ProductPromotionRowType
  ) => {
    if (!row.daily_budget_update_date) {
      return renderBudgetTextField(row);
    }
    const budgetUpdateDate = moment
      .tz(row.daily_budget_update_date, "YYYY-MM-DD", "America/Los_Angeles")
      .local();
    const now = moment();
    if (budgetUpdateDate.isAfter(now)) {
      return (
        <div>
          {renderBudgetTextField(row)}
          <span className={css(styles.budgetUpdateDate)}>
            To be updated on{" "}
            {formatDatetimeLocalized(budgetUpdateDate, "YYYY-MM-DD")}
          </span>
        </div>
      );
    }
    return renderBudgetTextField(row);
  };

  const renderIntenseBoostToggle = (row: ProductPromotionRowType) => {
    return (
      <Switch
        isOn={row.intense_boost || false}
        onToggle={(isOn: boolean) => {
          const content = isOn
            ? i`You are about to enable Intense Boost.`
            : i`You are about to disable Intense Boost.`;
          renderConfirmationModal({
            content,
            product_id: row.product_id,
            old_budget: row.daily_max_budget,
            new_budget: row.daily_max_budget,
            intense_boost: isOn,
          });
        }}
      />
    );
  };

  const renderPromoteProductToggle = (row: ProductPromotionRowType) => {
    return (
      <Switch
        isOn={row.daily_budget_state !== "INACTIVE"}
        onToggle={async (isOn: boolean) => {
          if (isOn) {
            await updateBudget(row);
          } else {
            const content = i`You are about to stop the product from promotion.`;
            renderConfirmationModal({
              content,
              product_id: row.product_id,
              old_budget: row.daily_max_budget,
              new_budget: 0,
              intense_boost: row.intense_boost || false,
            });
          }
        }}
      />
    );
  };

  const productPopups: { [state in ProductPromotionStatus]: string } = {
    ACTIVE: i`Product is under promotion.`,
    INACTIVE:
      i`Product is currently inactive. ` +
      i`Start promoting the product by setting a ` +
      i`positive budget to gain more impressions!`,
    OUT_OF_BALANCE: i`Product promotion is pending due to insufficient balance.`,
  };

  const productStates: { [state in ProductPromotionStatus]: string } = {
    ACTIVE: i`Active`,
    INACTIVE: i`Inactive`,
    OUT_OF_BALANCE: i`Insufficient Balance`,
  };

  const renderProductState = (row: ProductPromotionRowType) => {
    const productState = row.daily_budget_state;

    return (
      <Popover
        position={"top"}
        popoverContent={productPopups[productState]}
        contentWidth={250}
      >
        {productStates[productState]}
      </Popover>
    );
  };

  return (
    <Table
      className={css(className)}
      data={data}
      noDataMessage={i`No Records Found`}
      maxVisibleColumns={20}
      rowExpands={() => true} // all rows expand
      expandedRows={expandedRowsIndices}
      renderExpanded={renderExpandedProduct}
      onRowExpandToggled={onRowExpandToggled}
      highlightRowOnHover
    >
      <ProductColumn
        title={i`Product Info`}
        columnKey="product_id"
        align="left"
        width={300}
        showParentSku
        showFullName={false}
      />
      <Table.NumeralColumn
        title={dailyBudgetEnabled ? i`Orders` : i`Lifetime Orders`}
        description={
          dailyBudgetEnabled
            ? DailyBudgetCampaignExplanations.SALES_LIFETIME
            : null
        }
        columnKey="lifetime_sales"
        align="left"
        width={250}
        noDataMessage={"\u2014"}
      />
      <Table.CurrencyColumn
        title={dailyBudgetEnabled ? i`GMV` : i`Lifetime GMV`}
        description={
          dailyBudgetEnabled
            ? DailyBudgetCampaignExplanations.GMV_LIFETIME
            : null
        }
        columnKey="lifetime_gmv"
        align="left"
        currencyCode={currencyCode}
        multiline
      />
      <Table.CurrencyColumn
        title={dailyBudgetEnabled ? i`Spend` : i`Lifetime Spend`}
        description={
          dailyBudgetEnabled
            ? DailyBudgetCampaignExplanations.SPEND_LIFETIME
            : null
        }
        columnKey="lifetime_spend"
        align="left"
        currencyCode={currencyCode}
      />
      <Table.Column
        title={dailyBudgetEnabled ? i`Spend/GMV %` : i`Lifetime Spend/GMV %`}
        description={
          dailyBudgetEnabled
            ? DailyBudgetCampaignExplanations.SPEND_OVER_GMV_LIFETIME
            : null
        }
        columnKey="lifetime_gmv"
        align="left"
        width={250}
        noDataMessage={"\u2014"}
        multiline
        minWidth={120}
      >
        {({
          row,
        }: CellInfo<ProductPerformance["lifetime_gmv"], ProductPerformance>) =>
          renderSpendOverGMV(row)
        }
      </Table.Column>
      {!dailyBudgetEnabled && (
        <Table.NumeralColumn
          title={i`Number of Campaigns the Product Promoted in`}
          columnKey="num_campaigns"
          align="left"
          width={250}
          noDataMessage={"\u2014"}
        />
      )}
      {!dailyBudgetEnabled && (
        <Table.NumeralColumn
          title={i`Number of Active Days in Campaigns`}
          columnKey="num_active_days"
          align="left"
          width={250}
          noDataMessage={"\u2014"}
        />
      )}
      {dailyBudgetEnabled && (
        <Table.Column
          title={i`State`}
          description={
            dailyBudgetEnabled ? DailyBudgetCampaignExplanations.STATE : null
          }
          columnKey="daily_budget_state"
          width={250}
          noDataMessage={"\u2014"}
        >
          {({ row }) => renderProductState(row)}
        </Table.Column>
      )}
      {dailyBudgetEnabled && (
        <Table.Column
          title={i`Daily Budget`}
          columnKey="daily_max_budget"
          minWidth={150}
          description={DailyBudgetCampaignExplanations.DAILY_BUDGET}
        >
          {({ row }) => renderBudgetTextFieldWithBudgetUpdateDate(row)}
        </Table.Column>
      )}
      {dailyBudgetEnabled && (
        <Table.Column
          columnKey="intense_boost"
          title={i`Intense Boost`}
          description={DailyBudgetCampaignExplanations.INTENSE_BOOST}
        >
          {({ row }) => renderIntenseBoostToggle(row)}
        </Table.Column>
      )}
      {dailyBudgetEnabled && (
        <Table.Column
          title={i`Promote Product`}
          columnKey="daily_budget_state"
          minWidth={120}
          align="center"
        >
          {({ row }) => renderPromoteProductToggle(row)}
        </Table.Column>
      )}
    </Table>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        confirmationModalContent: {
          fontSize: 16,
          fontWeight: weightMedium,
          lineHeight: 1.5,
          textAlign: "center",
          padding: "40px 0px",
        },
        budgetUpdateDate: {
          fontSize: 12,
          fontWeight: weightMedium,
        },
      }),
    []
  );
};

export default observer(ProductLifetimeTable);
