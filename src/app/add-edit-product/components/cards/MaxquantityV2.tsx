import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { Field, NumericInput } from "@ContextLogic/lego";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import Section, { SectionProps } from "./Section";
import { ci18n } from "@core/toolkit/i18n";
import { Stack } from "@ContextLogic/atlas-ui";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const MaxquantityV2: React.FC<Props> = (props: Props) => {
  const { className, style, state, ...sectionProps } = props;
  const styles = useStylesheet();

  const [maxQuantity, setMaxQuantity] = useState<number | null | undefined>(
    null,
  );

  const onNumberChange = (value: number | null | undefined) => {
    state.maxQuantity = value;
    setMaxQuantity(value);
  };

  return (
    <Section
      style={[className, style]}
      title={i`Max quantity`}
      {...sectionProps}
    >
      <Stack direction="row" sx={{ gap: "8px" }}>
        <Field title={ci18n("Field name", "Max quantity")} style={styles.field}>
          <NumericInput
            value={maxQuantity}
            incrementStep={1}
            onChange={(value) => onNumberChange(value.valueAsNumber)}
          />
        </Field>
      </Stack>
    </Section>
  );
};

export default observer(MaxquantityV2);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tag: {
          margin: 3,
        },
        brandCard: {
          marginTop: 16,
        },
        brandError: {
          marginTop: 8,
        },
        field: {
          flex: 0.5,
        },
        hideInputButtons: {
          "input[type='number']::-webkit-inner-spin-button": {
            display: "none",
          },
          "input[type='number']::-webkit-outer-spin-button": {
            display: "none",
          },
        },
      }),
    [],
  );
