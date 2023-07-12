import React from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { NextPage } from "next";

import AddEditProductContainer from "@add-edit-product/components/AddEditProductContainer";
import {
  AddEditProductInitialData,
  EDIT_PRODUCT_INITIAL_DATA_QUERY,
} from "@add-edit-product/queries/initial-queries";
import { LoadingIndicator } from "@ContextLogic/lego";
import FullPageError from "@core/components/FullPageError";
import { useProductId } from "@add-edit-product/toolkit";

const EditProductPage: NextPage<Record<string, never>> = () => {
  const [productId] = useProductId();

  const {
    data: initialData,
    loading: isLoadingInitialData,
    error,
  } = useQuery<AddEditProductInitialData>(EDIT_PRODUCT_INITIAL_DATA_QUERY, {
    variables: {
      productId: productId,
    },
    skip: productId == null || productId.trim().length === 0,
  });

  if (isLoadingInitialData) {
    return <LoadingIndicator />;
  }

  if (productId == null || productId.trim().length === 0) {
    return <FullPageError error="404" />;
  }

  if (error || initialData == null) {
    return <FullPageError error="500" />;
  }

  return <AddEditProductContainer initialData={initialData} />;
};

export default observer(EditProductPage);
