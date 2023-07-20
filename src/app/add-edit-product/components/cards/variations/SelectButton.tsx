import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { Button, FormSelectProps, FormSelect } from "@ContextLogic/lego";
import { Stack } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";

type Props = Omit<FormSelectProps<string>, "onSelected" | "selectedValue"> & {
  readonly onSubmit: (value: string | null | undefined) => unknown;
  readonly buttonText: string;
};

const SelectButton: React.FC<Props> = ({
  buttonText,
  onSubmit,
  "data-cy": dataCy,
  ...otherProps
}) => {
  const styles = useStylesheet();
  const [value, setValue] = useState<string | null | undefined>();

  return (
    <Stack direction="row" style={{ height: "42px" }}>
      <FormSelect
        selectedValue={value}
        onSelected={(option: string) => setValue(option)}
        style={styles.select}
        data-cy={`${dataCy}-select`}
        {...otherProps}
      />
      <Button
        onClick={() => onSubmit(value)}
        style={styles.button}
        data-cy={`${dataCy}-button`}
      >
        {buttonText}
      </Button>
    </Stack>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        select: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: "4px 0px 0px 4px",
          height: 40,
        },
        button: {
          borderRadius: "0px 4px 4px 0px",
          borderLeft: 0,
          height: 42,
          boxShadow: "none",
        },
      }),
    [borderPrimary],
  );
};

export default observer(SelectButton);
