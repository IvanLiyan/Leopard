import React from "react";
import { observer } from "mobx-react";
import { CheckboxField } from "@ContextLogic/lego";
import { CustomsLogistics } from "@add-edit-product/AddEditProductState";
import { Stack, Text } from "@ContextLogic/atlas-ui";

type Props = {
  readonly onUpdate: (newProps: Partial<CustomsLogistics>) => void;
  readonly data: CustomsLogistics;
  readonly disabled?: boolean;
  readonly "data-cy"?: string;
};

const ProductContents: React.FC<Props> = ({
  data,
  onUpdate,
  disabled,
  "data-cy": dataCy,
}: Props) => {
  const { hasPowder, hasLiquid, hasBattery, hasMetal } = data;

  return (
    <Stack direction="column" alignItems="stretch" sx={{ gap: "16px" }}>
      <Text variant="bodyM">
        Does the product contain any of the following?
      </Text>
      <CheckboxField
        checked={hasPowder || false}
        onChange={(checked) => onUpdate({ hasPowder: checked })}
        disabled={disabled}
        data-cy={`${dataCy}-checkbox-powder`}
        description={i`Any product that is composed of fine, dry particles.`}
      >
        <Text variant="bodyM">Powder</Text>
      </CheckboxField>
      <CheckboxField
        checked={hasLiquid || false}
        onChange={(checked) => onUpdate({ hasLiquid: checked })}
        disabled={disabled}
        data-cy={`${dataCy}-checkbox-liquid`}
        description={
          i`Products that consist of a substance that has a consistency like water or oil, ` +
          i`including semi-liquids such as creams, gels, lubes, etc.`
        }
      >
        <Text variant="bodyM">Liquid</Text>
      </CheckboxField>
      <CheckboxField
        checked={hasBattery || false}
        onChange={(checked) => onUpdate({ hasBattery: checked })}
        disabled={disabled}
        data-cy={`${dataCy}-checkbox-battery`}
        description={i`Products that contain batteries, either replaceable or built into the product.`}
      >
        <Text variant="bodyM">Battery</Text>
      </CheckboxField>
      <CheckboxField
        checked={hasMetal || false}
        onChange={(checked) => onUpdate({ hasMetal: checked })}
        disabled={disabled}
        data-cy={`${dataCy}-checkbox-metal`}
        description={i`Products made of or containing metal as a material component.`}
      >
        <Text variant="bodyM">Metal</Text>
      </CheckboxField>
    </Stack>
  );
};

export default observer(ProductContents);
