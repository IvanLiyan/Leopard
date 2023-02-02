import React, { useState } from "react";
import { observer } from "mobx-react";
import { SecondaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedWarehouse } from "@all-products/toolkit";
import { ci18n } from "@core/toolkit/i18n";
import DeleteWarehouseConfirmModal from "./DeleteWarehouseConfirmModal";
import { useTheme } from "@core/stores/ThemeStore";
import { useRouter } from "next/router";

type Props = BaseProps & {
  readonly warehouse: PickedWarehouse;
  readonly onRefetchInitialData: () => unknown;
};

const DeleteWarehouseButton: React.FC<Props> = ({
  className,
  style,
  warehouse,
  onRefetchInitialData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { negativeDark } = useTheme();
  const router = useRouter();

  return (
    <>
      <DeleteWarehouseConfirmModal
        open={modalOpen}
        onClose={async ({ removed }) => {
          if (removed) {
            onRefetchInitialData();
            await router.replace("/products");
          }
          setModalOpen(false);
        }}
        warehouse={warehouse}
      />
      <SecondaryButton
        style={[className, style]}
        color={negativeDark}
        onClick={() => setModalOpen(true)}
      >
        {ci18n(
          "Text on button merchants can click to delete the currently selected warehouse",
          "Delete Warehouse",
        )}
      </SecondaryButton>
    </>
  );
};

export default observer(DeleteWarehouseButton);
