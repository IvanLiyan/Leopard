import React from "react";
import { observer } from "mobx-react";

/* Lego Component */
import { Text } from "@ContextLogic/atlas-ui";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Style } from "@core/toolkit/styling";

/* Merchant Store */
import HorizontalField from "@infractions/components/HorizontalField";

type Props = BaseProps & {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly popoverContent?: string | null | undefined;
  readonly contentStyles?: Style | undefined;
};

const Row = (props: Props) => {
  const { children, title, popoverContent } = props;

  return (
    <HorizontalField
      title={title}
      info={popoverContent ?? undefined}
      titleWidth={200}
    >
      {typeof children === "string" ? (
        <Text variant="bodyM">{children}</Text>
      ) : (
        children
      )}
    </HorizontalField>
  );
};

export default observer(Row);
