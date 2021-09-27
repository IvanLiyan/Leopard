/*
 * BulkAddEditProductV2Container.tsx
 *
 * Created by Jonah Dlin on Tue Apr 06 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
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
import BulkAddEditProductV2State from "@plus/model/BulkAddEditProductV2State";
import BulkAddEdit from "@plus/component/products/bulk-add-edit-v2/BulkAddEdit";
import { BulkAddEditInitialData } from "@toolkit/products/bulk-add-edit-v2";

type Props = {
  readonly initialData: BulkAddEditInitialData;
};

const BulkAddEditProductV2Container: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const actionLogger = useLogger("PLUS_PRODUCT_UPLOAD");

  const state = useMemo(() => {
    actionLogger.info({
      action: `VIEW_PRODUCTS_BULK_ADD_EDIT_PAGE`,
    });
    return new BulkAddEditProductV2State({
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
        isDisabled={state.hasErrors}
      >
        Submit
      </PrimaryButton>
    </>
  );

  const {
    currentMerchant: { isMerchantPlus },
  } = initialData;

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Bulk add/edit products with CSV`}
        breadcrumbs={
          isMerchantPlus
            ? [
                { name: i`Products`, href: "/plus/products/list" },
                { name: i`Bulk add/edit`, href: window.location.href },
              ]
            : undefined
        }
        actions={actions}
        sticky
        relaxed
      />
      <PageGuide relaxed>
        <BulkAddEdit className={css(styles.content)} state={state} />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 24,
        },
      }),
    []
  );

export default observer(BulkAddEditProductV2Container);
