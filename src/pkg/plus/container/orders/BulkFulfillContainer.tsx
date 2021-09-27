/*
 *
 * BulkFulfillContainer.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/14/2020, 2:00:00 PM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Layout, PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import BulkFulfill from "@plus/component/orders/bulk-fulfill/BulkFulfill";
import PageGuide from "@plus/component/nav/PageGuide";
import { FulfillmentCsvSchema } from "@schema/types";
import BulkFulfillState from "@plus/model/BulkFulfillState";

export type BulkFulfillInitialData = {
  readonly fulfillment: {
    readonly fulfillmentCsv: Pick<
      FulfillmentCsvSchema,
      "requiredColumns" | "optionalColumns"
    >;
  };
};

type Props = {
  readonly initialData: BulkFulfillInitialData;
};

const BulkFulfillContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();

  const state = useMemo(() => {
    return new BulkFulfillState({
      initialData,
    });
  }, [initialData]);

  const actions = (
    <>
      <PrimaryButton
        onClick={state.submit}
        minWidth
        isDisabled={!state.isFulfillButtonEnabled}
      >
        Fulfill
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Bulk fulfill with CSV`}
        breadcrumbs={[
          { name: i`Orders`, href: "/plus/orders/unfulfilled" },
          { name: i`Bulk fulfill`, href: window.location.href },
        ]}
        actions={actions}
        className={css(styles.header)}
      />
      <PageGuide>
        <Layout.FlexColumn alignItems="stretch">
          <BulkFulfill state={state} />
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
      }),
    [],
  );

export default observer(BulkFulfillContainer);
