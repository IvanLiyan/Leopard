import React from "react";
import { observer } from "mobx-react";
import { Markdown as LegoMarkdown, MarkdownProps } from "@ContextLogic/lego";

const Markdown: React.FC<MarkdownProps> = ({
  className,
  style,
  ...props
}: MarkdownProps) => {
  return (
    <LegoMarkdown
      style={[
        {
          ":nth-child(1n) > ul": {
            marginTop: 0,
            marginBottom: 0,
          },
        },
        className,
        style,
      ]}
      {...props}
    />
  );
};

export default observer(Markdown);
