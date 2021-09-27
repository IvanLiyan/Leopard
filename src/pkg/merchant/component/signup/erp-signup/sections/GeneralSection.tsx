import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseSectionProps } from "./SectionWrapper";

const GeneralSection = (props: BaseSectionProps) => {
  const styles = useStylesheet();
  const { state, className } = props;

  return (
    <div className={css(className)}>
      <HorizontalField
        className={css(styles.field)}
        title={i`Identify yourself`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <Select
          options={state.partnerRoleOptions}
          selectedValue={state.partnerRole}
          onSelected={(value) => {
            state.partnerRole = value;
          }}
        />
      </HorizontalField>
    </div>
  );
};
export default observer(GeneralSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          marginTop: 24,
        },
      }),
    []
  );
