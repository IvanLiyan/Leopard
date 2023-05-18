import React from "react";
import { observer } from "mobx-react";
import ReactMarkdown, { Options } from "react-markdown";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import Link from "@core/components/Link";

const Markdown = (props: Omit<Options, "components">) => {
  return (
    <ReactMarkdown
      /* eslint-disable @typescript-eslint/no-unused-vars */
      components={{
        h1: ({ node, ...props }) => <Heading variant="h1" {...props} />,
        h2: ({ node, ...props }) => <Heading variant="h2" {...props} />,
        h3: ({ node, ...props }) => <Heading variant="h3" {...props} />,
        h4: ({ node, ...props }) => <Heading variant="h4" {...props} />,
        h5: ({ node, ...props }) => <Heading variant="h5" {...props} />,
        h6: ({ node, ...props }) => <Heading variant="h6" {...props} />,
        a: (
          { node, onMouseOver, onMouseLeave, ...props }, // extract onMouseOver, onMouseLeave for typing purposes
        ) => <Link {...props} />,
        strong: ({ node, ...props }) => (
          <Text variant="bodyMStrong" {...props} />
        ),
        p: ({ node, ...props }) => (
          <Text variant="bodyM" component="div" {...props} />
        ),
        ul: ({ node, ...props }) => <ul style={{ margin: 0 }} {...props} />,
      }}
      /* eslint-enable @typescript-eslint/no-unused-vars */
      {...props}
    />
  );
};

export default observer(Markdown);
