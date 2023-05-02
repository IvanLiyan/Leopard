import React from "react";
import { observer } from "mobx-react";
import { Card, CardProps, Heading, HeadingProps } from "@ContextLogic/atlas-ui";

type Props = CardProps & {
  readonly title?: HeadingProps["children"];
  readonly ctaButtons?: React.ReactFragment;
  readonly ctaButtonLayout?: "ROW" | "COLUMN";
};

const ActionCard: React.FC<Props> = ({
  children,
  title,
  ctaButtons,
  ctaButtonLayout = "ROW",
  sx,
  ...props
}) => {
  return (
    <>
      <style jsx>{`
        .content {
          flex: 1;
        }
        .button-row {
          display: flex;
          flex-direction: ${ctaButtonLayout === "ROW" ? "row" : "column"};
          ${
            ctaButtonLayout === "ROW" ? "justify-content" : "align-items"
          }: flex-end;
          margin-top: 16px;
        }
        .button-row > :global(:nth-child(n + 2)) {
          margin-${ctaButtonLayout === "ROW" ? "left" : "top"}: 16px;
        }
      `}</style>
      <Card
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          ...sx,
        }}
        {...props}
      >
        {title && (
          <Heading variant="h4" sx={{ marginBottom: "12px" }}>
            {title}
          </Heading>
        )}
        <div className="content">{children}</div>
        {ctaButtons && <div className="button-row">{ctaButtons}</div>}
      </Card>
    </>
  );
};

export default observer(ActionCard);
