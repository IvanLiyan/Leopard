import React from "react";
import { observer } from "mobx-react";
import ReactMarkdown, { Options } from "react-markdown";
import { Heading, HeadingProps, Text, TextProps } from "@ContextLogic/atlas-ui";
import Link, { LinkProps } from "@deprecated/components/Link";

const Markdown = ({
  h1Props,
  h2Props,
  h3Props,
  h4Props,
  h5Props,
  h6Props,
  aProps,
  strongProps,
  pProps,
  ulProps,
  ...props
}: Omit<Options, "components"> & {
  readonly h1Props?: HeadingProps;
  readonly h2Props?: HeadingProps;
  readonly h3Props?: HeadingProps;
  readonly h4Props?: HeadingProps;
  readonly h5Props?: HeadingProps;
  readonly h6Props?: HeadingProps;
  readonly aProps?: LinkProps;
  readonly strongProps?: TextProps;
  readonly pProps?: TextProps;
  readonly ulProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >;
}) => {
  return (
    <ReactMarkdown
      /* eslint-disable @typescript-eslint/no-unused-vars */
      components={{
        h1: ({ node, ...props }) => (
          <Heading variant="h1" {...props} {...h1Props} />
        ),
        h2: ({ node, ...props }) => (
          <Heading variant="h2" {...props} {...h2Props} />
        ),
        h3: ({ node, ...props }) => (
          <Heading variant="h3" {...props} {...h3Props} />
        ),
        h4: ({ node, ...props }) => (
          <Heading variant="h4" {...props} {...h4Props} />
        ),
        h5: ({ node, ...props }) => (
          <Heading variant="h5" {...props} {...h5Props} />
        ),
        h6: ({ node, ...props }) => (
          <Heading variant="h6" {...props} {...h6Props} />
        ),
        a: (
          { node, onMouseOver, onMouseLeave, ...props }, // extract onMouseOver, onMouseLeave for typing purposes
        ) => <Link {...props} {...aProps} />,
        strong: ({ node, ...props }) => (
          <Text variant="bodyMStrong" {...props} {...strongProps} />
        ),
        p: ({ node, ...props }) => (
          <Text variant="bodyM" component="div" {...props} {...pProps} />
        ),
        ul: ({ node, ...props }) => (
          <ul style={{ margin: 0 }} {...props} {...ulProps} />
        ),
      }}
      /* eslint-enable @typescript-eslint/no-unused-vars */
      {...props}
    />
  );
};

export default observer(Markdown);
