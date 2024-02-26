/*
 *
 * FullReport.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/27/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React from "react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

import CardContainer from "./CardContainer";
import StatusDetail from "./StatusDetail";
import BasicInfo from "./BasicInfo";
import { CsvProductImportJobDetailSchema } from "@schema";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly showNewProductCsvStatusPage?: boolean | null;
  readonly initialData?: CsvProductImportJobDetailSchema;
};

const ProductCsvHistory: React.FC<Props> = (props: Props) => {
  const { className, style, initialData } = props;

  // eslint-disable-next-line no-console
  console.log("initialDataKKK", initialData);

  const body = (
    <>
      <Layout.FlexColumn>
        {/* Card */}
        <CardContainer propData={initialData} />
        {/* Status Detail */}
        <StatusDetail propData={initialData} />
        {/* Basic Info */}
        <BasicInfo propData={initialData} />
      </Layout.FlexColumn>
    </>
  );

  return <div className={css(className, style)}>{body}</div>;
};

export default ProductCsvHistory;
