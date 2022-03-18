import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import NextLink from "next/link";

import SimpleLink, {
  SimpleLinkProps,
} from "@ContextLogic/lego/component/button/SimpleLink";

export type LinkProps = SimpleLinkProps & {
  readonly href?: string | null | undefined;
  readonly download?: boolean | null | undefined;
  readonly DEPRECATED_isRouterLink?: boolean | null | undefined;
  readonly openInNewTab?: boolean | null | undefined;
  readonly onMouseOver?: (() => unknown) | null | undefined;
  readonly onMouseLeave?: (() => unknown) | null | undefined;
  readonly fadeOnHover?: boolean | null | undefined;
};

const Link = (props: LinkProps) => {
  const {
    href,
    style,
    className,
    DEPRECATED_isRouterLink,
    openInNewTab,
    onClick,
    children,
    ...otherProps
  } = props;

  // TODO [hdinh]: delete all files using Link w/ DEPRECATED_isRouterLink prop
  // https://jira.wish.site/browse/MKL-56811
  if (DEPRECATED_isRouterLink) {
    return null;
  }

  // TODO [hdinh]: add next/link-passhref lint
  // https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag

  // css prop is missing in SimpleLink's props, for now it's set to undefined
  // has to be an issue with NextJS
  // similar to issues identified with emotion: https://github.com/emotion-js/emotion/issues/2111
  // emotion has gotten into the prop types, which is adding a css variable that does not normally exist in this type in Lego

  return (
    <NextLink href={{ pathname: href }} passHref>
      <SimpleLink
        href={href}
        style={[style, className]}
        rel={openInNewTab || onClick ? "noopener noreferrer" : undefined}
        target={openInNewTab ? "_blank" : undefined}
        onClick={onClick}
        css={undefined}
        {...otherProps}
      >
        {children}
      </SimpleLink>
    </NextLink>
  );
};

export default observer(Link);
