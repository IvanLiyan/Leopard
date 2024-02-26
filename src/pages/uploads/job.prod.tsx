import React from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { NextPage } from "next";

import FullReportContainer from "@products-csv/components/FullReportContainer";
import {
  ADD_PRODUCT_INITIAL_DATA_QUERY,
  AddEditProductInitialData,
} from "@add-edit-product/queries/initial-queries";
import { LoadingIndicator } from "@ContextLogic/lego";
import FullPageError from "@core/components/FullPageError";

const AddProductPage: NextPage<Record<string, never>> = () => {
  const {
    data: initialData,
    loading: isLoadingInitialData,
    error,
  } = useQuery<AddEditProductInitialData>(ADD_PRODUCT_INITIAL_DATA_QUERY);

  if (isLoadingInitialData) {
    return <LoadingIndicator />;
  }

  if (error || initialData == null) {
    return <FullPageError error="500" />;
  }

  return <FullReportContainer />;
};

export default observer(AddProductPage);
