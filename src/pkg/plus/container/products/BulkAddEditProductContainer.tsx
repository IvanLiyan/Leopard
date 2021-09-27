/*
 *
 * BulkAddEditProductContainer.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/25/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { useLogger } from "@toolkit/logger";
import { css } from "@toolkit/styling";

import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import { MerchantSchema, ProductCsvImportColumnSchema } from "@schema/types";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductState";
import BulkAddEdit from "@plus/component/products/bulk-add-edit/BulkAddEdit";

type PickedProductCsvImportColumnSchema = Pick<
  ProductCsvImportColumnSchema,
  "columnId" | "name" | "description"
>;

export type BulkAddEditInitialData = {
  readonly platformConstants: {
    readonly productCsvImportColumns: {
      readonly requiredColumns: ReadonlyArray<
        PickedProductCsvImportColumnSchema
      >;
      readonly optionalColumns: ReadonlyArray<
        PickedProductCsvImportColumnSchema
      >;
    };
  };
  readonly currentMerchant: Pick<
    MerchantSchema,
    "canManageShipping" | "isStoreMerchant"
  >;
};

type Props = {
  readonly initialData: BulkAddEditInitialData;
};

const BulkAddEditProductContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const actionLogger = useLogger("PLUS_PRODUCT_UPLOAD");

  const state = useMemo(() => {
    actionLogger.info({
      action: `VIEW_PRODUCTS_BULK_ADD_EDIT_PAGE`,
    });
    return new BulkAddEditProductState({
      initialData,
    });
  }, [initialData, actionLogger]);

  const actions = (
    <>
      <PrimaryButton
        onClick={() => {
          actionLogger.info({
            action: `CLICK_ON_SUBMIT_FROM_PRODUCTS_BULK_ADD_EDIT_PAGE`,
          });
          state.submit();
        }}
        minWidth
        isDisabled={!state.isSubmitButtonEnabled}
      >
        Submit
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Bulk add/edit products with CSV`}
        breadcrumbs={[
          { name: i`Products`, href: "/plus/products/list" },
          { name: i`Bulk add/edit`, href: window.location.href },
        ]}
        actions={actions}
        className={css(styles.header)}
      />
      <PageGuide>
        <div className={css(styles.content)}>
          <BulkAddEdit state={state} />
        </div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
      }),
    []
  );

export default observer(BulkAddEditProductContainer);
