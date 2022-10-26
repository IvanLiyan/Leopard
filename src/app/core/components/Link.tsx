import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import NextLink from "next/link";

import SimpleLink, {
  SimpleLinkProps,
} from "@ContextLogic/lego/component/button/SimpleLink";

export type LinkProps = Omit<SimpleLinkProps, "href"> & {
  readonly href?: string | null | undefined;
  readonly download?: boolean | null | undefined;
  readonly DEPRECATED_isRouterLink?: boolean | null | undefined;
  readonly openInNewTab?: boolean | null | undefined;
  readonly onMouseOver?: (() => unknown) | null | undefined;
  readonly onMouseLeave?: (() => unknown) | null | undefined;
  readonly fadeOnHover?: boolean | null | undefined;
};

const isValidURL = (s: string): boolean => {
  try {
    new URL(s);
    // test has passed, s is a valid URL
    return true;
  } catch (_) {
    // test failed, s is not a valid URL
    return false;
  }
};

const Link = (_props: LinkProps) => {
  const {
    href: hrefProp,
    style,
    className,
    DEPRECATED_isRouterLink,
    openInNewTab,
    onClick,
    ...otherProps
  } = _props;

  // TODO [hdinh]: delete all files using Link w/ DEPRECATED_isRouterLink prop
  // https://jira.wish.site/browse/MKL-56811
  if (DEPRECATED_isRouterLink) {
    return null;
  }

  // required since legacy lego link allows href to be null, but anchor doesn't
  const href = hrefProp === null ? undefined : hrefProp;

  const props = {
    href,
    style: [style, className],
    rel: openInNewTab || onClick ? "noopener noreferrer" : undefined,
    target: openInNewTab ? "_blank" : undefined,
    onClick,
    // css prop is missing in SimpleLink's props, for now it's set to undefined
    // has to be an issue with NextJS
    // similar to issues identified with emotion: https://github.com/emotion-js/emotion/issues/2111
    // emotion has gotten into the prop types, which is adding a css variable that does not normally exist in this type in Lego
    css: undefined,
    ...otherProps,
  };

  // urls of the form `${window.location.href}/slug` can be used to access
  // Merch-FE pages, while "/slug" can be used to access Leopard pages
  if (!href || isValidURL(href)) {
    return <SimpleLink {...props} />;
  }

  return (
    <NextLink href={{ pathname: href }} passHref>
      <SimpleLink {...props} />
    </NextLink>
  );
};

export default observer(Link);
