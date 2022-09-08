/* eslint-disable filenames/match-regex */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { FormSelect, Layout, Option } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useNavigationStore } from "@stores/NavigationStore";

export type EditShippingWarehouseSelectorProps = BaseProps & {
  readonly productId: string;
  readonly setWarehouse: (wid: string) => void;
  readonly selectedWarehouseId: string;
  readonly warehouseOptions: ReadonlyArray<Option<string>>;
};

const EditShippingWarehouseSelector = (
  props: EditShippingWarehouseSelectorProps
) => {
  const { productId, setWarehouse, selectedWarehouseId, warehouseOptions } =
    props;
  const navigationStore = useNavigationStore();

  return (
    <Layout.FlexRow>
      <FormSelect
        options={warehouseOptions}
        onSelected={(wid: string) => {
          if (wid != selectedWarehouseId) {
            setWarehouse(wid);
            navigationStore.navigate(`/product-shipping/${productId}/${wid}`);
          }
        }}
        selectedValue={selectedWarehouseId}
      />
    </Layout.FlexRow>
  );
};

export default observer(EditShippingWarehouseSelector);
