import React from "react";
import { observer } from "mobx-react";
import { Card, CardProps } from "@ContextLogic/atlas-ui";
import Markdown from "@core/components/Markdown";

const markdown = `
- Merchants will receive an email with the CSV files within 24 hours of submission.

- Only one request per promotion type/event ID can be submitted at one time.
`;

const SubmitRequestCard: React.FC<Omit<CardProps, "children">> = ({
  sx,
  ...props
}) => {
  return (
    <Card
      sx={{
        ...sx,
        padding: "16px",
      }}
      {...props}
    >
      <Markdown>{markdown}</Markdown>
    </Card>
  );
};

export default observer(SubmitRequestCard);
