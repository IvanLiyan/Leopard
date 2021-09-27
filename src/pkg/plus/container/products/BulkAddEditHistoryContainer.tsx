/*
 *
 * BulkAddEditHistoryContainer.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 10/01/2020
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
import BulkAddEditHistory from "@plus/component/products/bulk-add-edit-history/BulkAddEditHistory";
import { ProductCatalogSchema } from "@schema/types";

export type BulkAddEditHistoryInitialData = {
  readonly productCatalog: Pick<
    ProductCatalogSchema,
    "csvProductImportJobsCount"
  >;
};

type Props = {
  readonly initialData: BulkAddEditHistoryInitialData;
};

const BulkAddEditHistoryContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Bulk upload and edit history`}
        breadcrumbs={[
          { name: i`Products`, href: "/plus/products/list" },
          { name: i`Bulk upload and edit history`, href: window.location.href },
        ]}
        className={css(styles.header)}
      />
      <PageGuide>
        <div className={css(styles.content)}>
          <BulkAddEditHistory initialData={initialData} />
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

export default observer(BulkAddEditHistoryContainer);
