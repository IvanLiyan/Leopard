/*
 *
 * BulkFulfillHistoryContainer.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/24/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import BulkFulfillHistory from "@plus/component/orders/bulk-fulfill-history/BulkFulfillHistory";
import { FulfillmentSchema } from "@schema/types";

export type BulkFulfillHistoryInitialData = {
  readonly fulfillment: Pick<FulfillmentSchema, "csvFulfillmentJobsCount">;
};

type Props = {
  readonly initialData: BulkFulfillHistoryInitialData;
};

const BulkFulfillHistoryContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Bulk fulfill history`}
        breadcrumbs={[
          { name: i`Orders`, href: "/plus/orders/unfulfilled" },
          { name: i`Bulk fulfill history`, href: window.location.href },
        ]}
        className={css(styles.header)}
      />
      <PageGuide>
        <div className={css(styles.content)}>
          <BulkFulfillHistory initialData={initialData} />
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
    [],
  );

export default observer(BulkFulfillHistoryContainer);
