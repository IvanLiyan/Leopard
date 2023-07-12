/*
 * CustomsLogisticsCard.tsx
 *
 * Created by Jonah Dlin on Wed Oct 27 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import Section, {
  SectionProps,
} from "@add-edit-product/components/cards/Section";
import AddEditProductState, {
  createCustomsLogistics,
} from "@add-edit-product/AddEditProductState";
import CustomsLogisticsForm from "./CustomsLogisticsForm";

type Props = Omit<SectionProps, "title" | "rightCard"> & {
  readonly state: AddEditProductState;
};

const CustomsLogisticsCard: React.FC<Props> = ({
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
  } = state;

  return (
    <Section
      className={css(style, className)}
      title={i`**Customs and Logistics** (Default / Optional)`}
      markdown
      {...sectionProps}
    >
      <CustomsLogisticsForm
        data={customsLogisticsDefault || createCustomsLogistics()}
        disable={isSubmitting}
        onUpdate={updateDefaultCustomsLogistics}
        currency={primaryCurrency}
        customsCountryOptions={customsCountryOptions}
        data-cy="default-customs"
      />
    </Section>
  );
};

export default observer(CustomsLogisticsCard);
