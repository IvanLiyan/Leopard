import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import AddEditProductState, {
  Variation,
} from "@add-edit-product/AddEditProductState";
import Link from "@deprecated/components/Link";
import { ci18n } from "@core/toolkit/i18n";
import AttributesModal from "./AttributesModal";
import { Stack } from "@ContextLogic/atlas-ui";
import { ErrorText } from "@ContextLogic/lego";

type Props = {
  readonly state: AddEditProductState;
  readonly variation: Variation;
};

const AttributesCell: React.FC<Props> = (props: Props) => {
  const { state, variation } = props;
  const [isAttributesModalOpen, setIsAttributesModalOpen] =
    useState<boolean>(false);
  const { attributesHasError, forceValidation } = state;

  const hasError = useMemo(() => {
    return attributesHasError({
      attributesInput: variation.attributes ?? {},
      isVariationLevel: true,
    });
  }, [attributesHasError, variation.attributes]);

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
      <Stack direction="column" key={`${hasError}-${forceValidation}`}>
        <Link
          onClick={() => {
            setIsAttributesModalOpen(true);
          }}
        >
          {ci18n("Link text, add/edit info", "Add/Edit")}
        </Link>
        {hasError && forceValidation && (
          <ErrorText style={{ marginTop: 8 }}>Has error</ErrorText>
        )}
      </Stack>
    </>
  );
};

export default observer(AttributesCell);
