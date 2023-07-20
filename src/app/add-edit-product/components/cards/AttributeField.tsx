import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedTaxonomyAttribute } from "@core/taxonomy/toolkit";
import { Field } from "@ContextLogic/lego";
import AttributeInput from "./AttributeInput";
import AddEditProductState from "@add-edit-product/AddEditProductState";

type Props = BaseProps & {
  readonly state: AddEditProductState;
  readonly attribute: PickedTaxonomyAttribute;
  readonly value: ReadonlyArray<string> | null | undefined;
  readonly onChange: (value: ReadonlyArray<string> | undefined) => unknown;
};

const AttributeField: React.FC<Props> = ({
  style,
  className,
  attribute,
  state,
  value,
  onChange,
}: Props) => {
  const { forceValidation, isSubmitting } = state;

  return (
    <Field
      style={[style, className, { minWidth: 0, overflow: "auto" }]}
      title={
        attribute.usage === "ATTRIBUTE_USAGE_REQUIRED"
          ? `${attribute.name}*`
          : attribute.name
      }
      description={attribute.description}
      key={attribute.id}
    >
      <AttributeInput
        style={{ minWidth: 0 }}
        attribute={attribute}
        value={value}
        onChange={onChange}
        forceValidation={forceValidation}
        disabled={isSubmitting}
        acceptNegative={false}
      />
    </Field>
  );
};

export default observer(AttributeField);
