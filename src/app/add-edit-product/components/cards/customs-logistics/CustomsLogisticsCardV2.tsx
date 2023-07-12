import React from "react";
import { observer } from "mobx-react";
import Section, {
  SectionProps,
} from "@add-edit-product/components/cards/Section";
import AddEditProductState, {
  createCustomsLogistics,
} from "@add-edit-product/AddEditProductState";
import CustomsLogisticsFormV2 from "./CustomsLogisticsFormV2";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly state: AddEditProductState;
};

const CustomsLogisticsCardV2: React.FC<Props> = ({
  style,
  className,
  state,
  ...sectionProps
}: Props) => {
  const {
    customsCountryOptions,
    primaryCurrency,
    customsLogisticsDefault,
    updateDefaultCustomsLogistics,
    isSubmitting,
    useCalculatedShipping,
  } = state;

  return (
    <Section
      style={[style, className]}
      title={i`**Customs and logistics**`}
      markdown
      {...sectionProps}
    >
      <CustomsLogisticsFormV2
        data={customsLogisticsDefault || createCustomsLogistics()}
        disabled={isSubmitting}
        onUpdate={updateDefaultCustomsLogistics}
        currency={primaryCurrency}
        customsCountryOptions={customsCountryOptions}
        data-cy="default-customs"
        state={state}
        useCalculatedShipping={useCalculatedShipping}
      />
    </Section>
  );
};

export default observer(CustomsLogisticsCardV2);
