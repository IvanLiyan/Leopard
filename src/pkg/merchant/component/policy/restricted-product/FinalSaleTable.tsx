import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";

/* Lego Components */
import {
  CellInfo,
  H5,
  Table,
  Popover,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { errorFilledGrey } from "@assets/icons";

/* Merchant Store */
import { useToastStore } from "@stores/ToastStore";

/* Type Imports */
import {
  Scalars,
  FinalSaleCategorySchema,
  PolicySchemaFinalSaleCategoriesArgs,
  UpdateMerchantFinalSale,
  FinalSaleCategory,
  MerchantFinalSaleAction,
  MerchantFinalSaleMutationsUpdateMerchantFinalSaleArgs,
} from "@schema/types";

const MUTATE_FINAL_SALE = gql`
  mutation FinalSale_Mutation($input: MerchantFinalSaleUpdateInput!) {
    policy {
      merchantFinalSale {
        updateMerchantFinalSale(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type UpdateFinalSaleResponseType = {
  readonly policy: {
    readonly merchantFinalSale: {
      readonly updateMerchantFinalSale: Pick<
        UpdateMerchantFinalSale,
        "ok" | "message"
      >;
    };
  };
};

const GET_FINAL_SALE_CATEGORIES = gql`
  query GetCategories($merchantId: ObjectIdType!) {
    policy {
      finalSaleCategories(merchantId: $merchantId) {
        name
        category
        totalProducts
        finalSaleEnabled
        description
      }
    }
  }
`;

type CategoryType = Pick<
  FinalSaleCategorySchema,
  "name" | "category" | "totalProducts" | "finalSaleEnabled" | "description"
>;

type RequestType = Pick<PolicySchemaFinalSaleCategoriesArgs, "merchantId">;

type ResponseType = {
  readonly policy: {
    readonly finalSaleCategories: ReadonlyArray<CategoryType>;
  };
};

type FinalSaleTableProps = BaseProps & {
  readonly merchantId: Scalars["ObjectIdType"];
};

const FinalSaleTable = ({ style, merchantId }: FinalSaleTableProps) => {
  const styles = useStylesheet();

  const [disableToogle, setDisableToogle] = useState<boolean>(false);

  const { data, loading, error, refetch } = useQuery<ResponseType, RequestType>(
    GET_FINAL_SALE_CATEGORIES,
    {
      variables: { merchantId },
    },
  );

  const errorMsg = error?.message;
  const toastStore = useToastStore();
  useEffect(() => {
    if (errorMsg != null && errorMsg.trim().length > 0) {
      toastStore.error(errorMsg);
    }
  }, [errorMsg, toastStore]);

  const categories = data?.policy?.finalSaleCategories;

  const [updateFinalSale] = useMutation<
    UpdateFinalSaleResponseType,
    MerchantFinalSaleMutationsUpdateMerchantFinalSaleArgs
  >(MUTATE_FINAL_SALE);

  const toggleFinalSale = async (updateArgs: {
    readonly action: MerchantFinalSaleAction;
    readonly category: FinalSaleCategory;
    readonly name: string;
  }) => {
    setDisableToogle(true);
    const { data } = await updateFinalSale({
      variables: {
        input: {
          action: updateArgs.action,
          category: updateArgs.category,
          merchantId,
        },
      },
    });
    const ok = data?.policy.merchantFinalSale.updateMerchantFinalSale.ok;
    const message =
      data?.policy.merchantFinalSale.updateMerchantFinalSale.message;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    await refetch();

    setDisableToogle(false);
    if (updateArgs.action == "ENABLE") {
      toastStore.positive(
        i`Final Sale Policy has been enabled for eligible products within ${updateArgs.name}`,
      );
    }

    if (updateArgs.action == "DISABLE") {
      toastStore.info(
        i`You have turned off Final Sale Policy for eligible products within ${updateArgs.name}`,
      );
    }
  };

  return (
    <div className={css(style)}>
      <div className={css(styles.header)}>
        <Popover
          popoverContent={
            i`If Final Sale Policy is enabled, all tagged product ` +
            i`listings within that category will be marked as Final ` +
            i`Sale in the Wish app. You may remove individual products ` +
            i`from Final Sale by editing the product under "All Products".`
          }
          position="top center"
          popoverMaxWidth={500}
        >
          <div className={css(styles.row)}>
            <H5>Final Sale Policy</H5>
            <img src={errorFilledGrey} className={css(styles.icon)} />
          </div>
        </Popover>
      </div>

      <LoadingIndicator loadingComplete={!loading}>
        <Table
          data={categories}
          noDataMessage={i`No Final Sale Categories Available`}
          cellPadding="8px 16px"
          highlightRowOnHover
        >
          <Table.Column
            title={i`Category`}
            columnKey="name"
            align="left"
            minWidth={70}
          />
          <Table.Column
            title={i`Description`}
            columnKey="description"
            align="left"
            width={200}
            multiline
          />
          <Table.Column
            title={i`Eligible products`}
            columnKey="totalProducts"
            handleEmptyRow
            align="left"
            minWidth={70}
          >
            {({
              value,
            }: CellInfo<CategoryType["totalProducts"], CategoryType>) =>
              value == -1 ? i`counting` : value
            }
          </Table.Column>
          <Table.SwitchColumn
            title={i`Enable Final Sale Policy`}
            columnKey="finalSaleEnabled"
            handleEmptyRow
            align="center"
            switchProps={({
              row,
            }: CellInfo<CategoryType["finalSaleEnabled"], CategoryType>) => {
              const action: MerchantFinalSaleAction = row.finalSaleEnabled
                ? "DISABLE"
                : "ENABLE";
              const category: FinalSaleCategory = row.category;
              return {
                isOn: row.finalSaleEnabled,
                disabled: disableToogle,
                onToggle: () => {
                  toggleFinalSale({
                    action,
                    category,
                    name: row.name,
                  });
                },
              };
            }}
          />
        </Table>
      </LoadingIndicator>
    </div>
  );
};

export default observer(FinalSaleTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          display: "flex",
          justifyContent: "space-between",
          alignContent: "stretch",
          alignSelf: "stretch",
          paddingBottom: 18,
        },
        row: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        icon: {
          marginLeft: 6,
          width: 12,
        },
      }),
    [],
  );
};
