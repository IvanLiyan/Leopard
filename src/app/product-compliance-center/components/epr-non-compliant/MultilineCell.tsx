import React from "react";
import { observer } from "mobx-react";
import { Stack, Text } from "@ContextLogic/atlas-ui";

type Props = {
  readonly lines: ReadonlyArray<string>;
};

const MultilineCell = (props: Props) => {
  const { lines } = props;

  return (
    <Stack direction="column" sx={{ padding: "8px 0px" }}>
      {lines.map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
    </Stack>
  );
};

export default observer(MultilineCell);
