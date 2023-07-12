import React, { useState } from "react";
import { observer } from "mobx-react";
import AddEditProductState, {
  Variation,
} from "@add-edit-product/AddEditProductState";
import Link from "@deprecated/components/Link";
import { ci18n } from "@core/toolkit/i18n";
import AttributesModal from "./AttributesModal";

type Props = {
  readonly state: AddEditProductState;
  readonly variation: Variation;
};

const AttributesCell: React.FC<Props> = (props: Props) => {
  const { state, variation } = props;
  const [isAttributesModalOpen, setIsAttributesModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <AttributesModal
        state={state}
        variation={variation}
        onClose={() => {
          setIsAttributesModalOpen(false);
        }}
        open={isAttributesModalOpen}
      />
      <Link
        onClick={() => {
          setIsAttributesModalOpen(true);
        }}
      >
        {ci18n("Link text, add/edit info", "Add/Edit")}
      </Link>
    </>
  );
};

export default observer(AttributesCell);
