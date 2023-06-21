import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import NextLink, { LinkProps as NextLinkProps } from "next/link";

import SimpleLink, {
  SimpleLinkProps,
} from "@ContextLogic/lego/component/button/SimpleLink";
import { useTheme } from "@core/stores/ThemeStore";

export type LinkProps = Omit<SimpleLinkProps, "href"> & {
  readonly href?: NextLinkProps["href"] | null; // null required to match legacy clroot typing
  readonly download?: boolean | null | undefined;
  readonly openInNewTab?: boolean | null | undefined;
  readonly onMouseOver?: (() => unknown) | null | undefined;
  readonly onMouseLeave?: (() => unknown) | null | undefined;
  readonly fadeOnHover?: boolean | null | undefined;
  readonly underline?: boolean;
} & ({ readonly light: true } | { readonly light?: never }); // this functionality should be moved to the Atlas link when built

export const isValidURL = (s: string): boolean => {
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
    openInNewTab,
    onClick,
    light,
    underline,
    ...otherProps
  } = _props;
  const { corePrimaryLight, primary } = useTheme();

  // required since legacy lego link allows href to be null, but anchor doesn't
  const href = hrefProp === null ? undefined : hrefProp;

  const propsWithoutHref = {
    style: [
      { color: light ? corePrimaryLight : primary },
      underline && {
        textDecoration: "underline",
        ":link": {
          textDecoration: "underline",
        },
        ":visited": {
          textDecoration: "underline",
        },
        ":hover": {
          textDecoration: "underline",
        },
        ":active": {
          textDecoration: "underline",
        },
      },
      style,
      className,
    ],
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

  // urls of the form `${window.location.origin}/slug` can be used to access
  // Merch-FE pages, while "/slug" can be used to access Leopard pages
  if (!href || (typeof href == "string" && isValidURL(href))) {
    return <SimpleLink href={href} {...propsWithoutHref} />;
  }

  return (
    <NextLink href={href} passHref>
      <SimpleLink href={href?.toString()} {...propsWithoutHref} />
    </NextLink>
  );
};

export default observer(Link);
