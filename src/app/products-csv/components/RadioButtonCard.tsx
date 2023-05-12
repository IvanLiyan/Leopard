import React from "react";
import { observer } from "mobx-react";
import { Card } from "@ContextLogic/atlas-ui";
import { Layout, Radio } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";

export type RadioButtonCardProps = {
  readonly checked: boolean;
  readonly text: string;
  readonly onCheck?: () => unknown;
};

const RadioButtonCard: React.FC<RadioButtonCardProps> = ({
  checked,
  text,
  onCheck,
}: RadioButtonCardProps) => {
  const { secondaryDark } = useTheme();

  return (
    <Card
      onClick={onCheck}
      borderRadius="md"
      style={{
        width: "400px",
        padding: "16px",
        borderColor: checked ? secondaryDark : undefined,
        cursor: "pointer",
      }}
      // @ts-ignore mui typing issue, component prop is not being recognized
      component="button"
    >
      <Layout.FlexRow alignItems="center" style={{ gap: "10px" }}>
        <Radio checked={checked} />
        <Text variant="bodyL">{text}</Text>
      </Layout.FlexRow>
    </Card>
  );
};

export default observer(RadioButtonCard);
